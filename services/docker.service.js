const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class DockerService {
  constructor() {
    this.docker = new Docker();
    this.executionDir = path.join(process.cwd(), 'tmp', 'executions');
    this.languages = {
      javascript: {
        image: 'node:18-alpine',
        filename: 'code.js',
        command: ['node', 'code.js'],
        timeout: 30000
      },
      python: {
        image: 'python:3.11-alpine',
        filename: 'code.py',
        command: ['python', 'code.py'],
        timeout: 30000
      },
      java: {
        image: 'openjdk:17-alpine',
        filename: 'Main.java',
        command: ['sh', '-c', 'javac Main.java && java Main'],
        timeout: 45000
      },
      cpp: {
        image: 'gcc:alpine',
        filename: 'code.cpp',
        command: ['sh', '-c', 'g++ -o code code.cpp && ./code'],
        timeout: 45000
      },
      c: {
        image: 'gcc:alpine',
        filename: 'code.c',
        command: ['sh', '-c', 'gcc -o code code.c && ./code'],
        timeout: 45000
      },
      go: {
        image: 'golang:alpine',
        filename: 'main.go',
        command: ['go', 'run', 'main.go'],
        timeout: 30000
      },
      rust: {
        image: 'rust:alpine',
        filename: 'main.rs',
        command: ['sh', '-c', 'rustc main.rs && ./main'],
        timeout: 45000
      }
    };
  }

  /**
   * Initialize Docker service and ensure execution directory exists
   */
  async initialize() {
    try {
      // Test Docker connection
      await this.docker.ping();
      logger.info('Docker service initialized successfully');

      // Create execution directory
      await fs.mkdir(this.executionDir, { recursive: true });
      
      // Pull required images
      await this.pullRequiredImages();
      
    } catch (error) {
      logger.error('Failed to initialize Docker service:', error);
      throw error;
    }
  }

  /**
   * Pull all required Docker images
   */
  async pullRequiredImages() {
    const images = [...new Set(Object.values(this.languages).map(lang => lang.image))];
    
    for (const image of images) {
      try {
        logger.info(`Pulling Docker image: ${image}`);
        await this.pullImage(image);
        logger.info(`Successfully pulled: ${image}`);
      } catch (error) {
        logger.warn(`Failed to pull image ${image}:`, error.message);
      }
    }
  }

  /**
   * Pull a Docker image
   */
  async pullImage(imageName) {
    return new Promise((resolve, reject) => {
      this.docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);
        
        this.docker.modem.followProgress(stream, (err, output) => {
          if (err) return reject(err);
          resolve(output);
        });
      });
    });
  }

  /**
   * Execute code in a Docker container
   * @param {Object} params - Execution parameters
   * @param {string} params.language - Programming language
   * @param {string} params.code - Code to execute
   * @param {string} params.stdin - Standard input
   * @param {number} params.timeout - Execution timeout in ms
   * @returns {Promise<Object>} Execution result
   */
  async executeCode(params) {
    const { language, code, stdin = '', timeout } = params;
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      // Validate language support
      if (!this.languages[language]) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const langConfig = this.languages[language];
      const executionTimeout = timeout || langConfig.timeout;

      // Create execution workspace
      const workspaceDir = path.join(this.executionDir, executionId);
      await fs.mkdir(workspaceDir, { recursive: true });

      // Write code to file
      const codeFile = path.join(workspaceDir, langConfig.filename);
      await fs.writeFile(codeFile, code);

      // Write stdin to file if provided
      let stdinFile = null;
      if (stdin) {
        stdinFile = path.join(workspaceDir, 'input.txt');
        await fs.writeFile(stdinFile, stdin);
      }

      logger.info(`Executing ${language} code`, { 
        executionId, 
        codeLength: code.length,
        hasStdin: !!stdin 
      });

      // Execute in container
      const result = await this.runInContainer({
        image: langConfig.image,
        command: langConfig.command,
        workspaceDir,
        stdinFile,
        timeout: executionTimeout,
        executionId
      });

      const executionTime = Date.now() - startTime;

      // Clean up workspace
      await this.cleanupWorkspace(workspaceDir);

      logger.info(`Code execution completed`, { 
        executionId, 
        executionTime,
        success: !result.error 
      });

      return {
        ...result,
        executionTime,
        language,
        executionId
      };

    } catch (error) {
      logger.error(`Code execution failed`, { 
        executionId, 
        language, 
        error: error.message 
      });

      // Clean up workspace on error
      const workspaceDir = path.join(this.executionDir, executionId);
      await this.cleanupWorkspace(workspaceDir).catch(() => {});

      return {
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime,
        language,
        executionId
      };
    }
  }

  /**
   * Run code in Docker container
   */
  async runInContainer({ image, command, workspaceDir, stdinFile, timeout, executionId }) {
    let container = null;
    
    try {
      // Container configuration
      const containerConfig = {
        Image: image,
        Cmd: command,
        WorkingDir: '/workspace',
        HostConfig: {
          Memory: 128 * 1024 * 1024, // 128MB
          CpuShares: 512, // 0.5 CPU
          NetworkMode: 'none', // No network access
          ReadonlyRootfs: true,
          AutoRemove: true,
          Binds: [
            `${workspaceDir}:/workspace:rw`
          ],
          Tmpfs: {
            '/tmp': 'size=50m,exec'
          }
        },
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: !!stdinFile,
        OpenStdin: !!stdinFile,
        Tty: false
      };

      // Create container
      container = await this.docker.createContainer(containerConfig);

      // Start container
      await container.start();

      // Handle stdin if provided
      if (stdinFile) {
        const stdinContent = await fs.readFile(stdinFile, 'utf8');
        const stream = await container.attach({
          stream: true,
          stdin: true,
          stdout: false,
          stderr: false
        });
        stream.write(stdinContent);
        stream.end();
      }

      // Get output streams
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true
      });

      // Collect output with timeout
      const result = await this.collectOutput(stream, timeout);

      // Wait for container to finish
      await container.wait();

      return result;

    } catch (error) {
      if (container) {
        try {
          await container.kill();
          await container.remove();
        } catch (cleanupError) {
          logger.error('Container cleanup failed:', cleanupError);
        }
      }
      throw error;
    }
  }

  /**
   * Collect output from container streams
   */
  async collectOutput(stream, timeout) {
    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let isResolved = false;

      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          resolve({
            output: stdout,
            error: stderr + '\nExecution timed out',
            timedOut: true
          });
        }
      }, timeout);

      // Parse Docker stream format
      stream.on('data', (chunk) => {
        // Docker multiplexes stdout/stderr in 8-byte headers
        let offset = 0;
        while (offset < chunk.length) {
          const header = chunk.slice(offset, offset + 8);
          if (header.length < 8) break;

          const streamType = header[0];
          const size = header.readUInt32BE(4);
          const data = chunk.slice(offset + 8, offset + 8 + size).toString();

          if (streamType === 1) { // stdout
            stdout += data;
          } else if (streamType === 2) { // stderr
            stderr += data;
          }

          offset += 8 + size;
        }
      });

      stream.on('end', () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          resolve({
            output: stdout,
            error: stderr,
            timedOut: false
          });
        }
      });

      stream.on('error', (error) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    });
  }

  /**
   * Clean up execution workspace
   */
  async cleanupWorkspace(workspaceDir) {
    try {
      await fs.rm(workspaceDir, { recursive: true, force: true });
    } catch (error) {
      logger.warn(`Failed to cleanup workspace: ${workspaceDir}`, error);
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return Object.keys(this.languages);
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(language) {
    return this.languages[language] || null;
  }

  /**
   * Health check for Docker service
   */
  async healthCheck() {
    try {
      await this.docker.ping();
      
      // Check if required images are available
      const images = await this.docker.listImages();
      const imageNames = images.flatMap(img => img.RepoTags || []);
      
      const requiredImages = [...new Set(Object.values(this.languages).map(lang => lang.image))];
      const missingImages = requiredImages.filter(img => 
        !imageNames.some(name => name.startsWith(img.split(':')[0]))
      );

      return {
        status: 'healthy',
        dockerConnected: true,
        missingImages: missingImages.length > 0 ? missingImages : undefined,
        supportedLanguages: this.getSupportedLanguages()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        dockerConnected: false,
        error: error.message
      };
    }
  }

  /**
   * Get execution statistics
   */
  async getStats() {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const images = await this.docker.listImages();
      
      return {
        runningContainers: containers.filter(c => c.State === 'running').length,
        totalContainers: containers.length,
        totalImages: images.length,
        supportedLanguages: this.getSupportedLanguages().length
      };
    } catch (error) {
      logger.error('Failed to get Docker stats:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Kill all running execution containers
   */
  async killAllExecutionContainers() {
    try {
      const containers = await this.docker.listContainers();
      const executionContainers = containers.filter(container =>
        container.Image.includes('node') ||
        container.Image.includes('python') ||
        container.Image.includes('openjdk') ||
        container.Image.includes('gcc') ||
        container.Image.includes('golang') ||
        container.Image.includes('rust')
      );

      for (const containerInfo of executionContainers) {
        try {
          const container = this.docker.getContainer(containerInfo.Id);
          await container.kill();
          logger.info(`Killed execution container: ${containerInfo.Id}`);
        } catch (error) {
          logger.warn(`Failed to kill container ${containerInfo.Id}:`, error.message);
        }
      }

      return executionContainers.length;
    } catch (error) {
      logger.error('Failed to kill execution containers:', error);
      throw error;
    }
  }
}

module.exports = new DockerService();
