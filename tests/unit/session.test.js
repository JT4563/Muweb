/* eslint-env jest */
// tests/unit/session.test.js
const Session = require("../../models/session.model");
const User = require("../../models/user.model");
const {
  connectTestDB,
  disconnectTestDB,
  cleanCollections,
} = require("../setup");

describe("Session Model Tests", () => {
  let testUser, testUser2;

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await cleanCollections();

    // Create test users
    testUser = new User({
      email: "user1@example.com",
      username: "user1",
      password: "SecurePassword123!",
    });
    await testUser.save();

    testUser2 = new User({
      email: "user2@example.com",
      username: "user2",
      password: "SecurePassword123!",
    });
    await testUser2.save();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe("Session Creation", () => {
    it("should create a session with owner", async () => {
      const session = new Session({
        owner: testUser._id,
        title: "Test Session",
        language: "javascript",
        content: 'console.log("Hello");',
      });

      await session.save();

      expect(session._id).toBeDefined();
      expect(session.owner.toString()).toBe(testUser._id.toString());
      expect(session.title).toBe("Test Session");
      expect(session.language).toBe("javascript");
    });

    it("should have default values", async () => {
      const session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });

      await session.save();

      expect(session.language).toBe("javascript");
      expect(session.isActive).toBe(true);
      expect(session.isPublic).toBe(false);
      expect(session.content).toBe("");
      expect(session.participants).toEqual([]);
      expect(session.snapshots).toEqual([]);
    });
  });

  describe("hasPermission Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });
      await session.save();
    });

    it("owner should have all permissions", async () => {
      expect(session.hasPermission(testUser._id, "read")).toBe(true);
      expect(session.hasPermission(testUser._id, "write")).toBe(true);
      expect(session.hasPermission(testUser._id, "admin")).toBe(true);
    });

    it("non-participant should have no access", async () => {
      expect(session.hasPermission(testUser2._id, "read")).toBe(false);
      expect(session.hasPermission(testUser2._id, "write")).toBe(false);
    });

    it("viewer should only read", async () => {
      session.participants.push({
        user: testUser2._id,
        role: "viewer",
      });
      await session.save();

      expect(session.hasPermission(testUser2._id, "read")).toBe(true);
      expect(session.hasPermission(testUser2._id, "write")).toBe(false);
      expect(session.hasPermission(testUser2._id, "admin")).toBe(false);
    });

    it("editor should read and write", async () => {
      session.participants.push({
        user: testUser2._id,
        role: "editor",
      });
      await session.save();

      expect(session.hasPermission(testUser2._id, "read")).toBe(true);
      expect(session.hasPermission(testUser2._id, "write")).toBe(true);
      expect(session.hasPermission(testUser2._id, "admin")).toBe(false);
    });

    it("admin should have all permissions", async () => {
      session.participants.push({
        user: testUser2._id,
        role: "admin",
      });
      await session.save();

      expect(session.hasPermission(testUser2._id, "read")).toBe(true);
      expect(session.hasPermission(testUser2._id, "write")).toBe(true);
      expect(session.hasPermission(testUser2._id, "admin")).toBe(true);
    });
  });

  describe("addParticipant Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });
      await session.save();
    });

    it("should add a new participant", async () => {
      await session.addParticipant(testUser2._id, "editor");

      expect(session.participants.length).toBe(1);
      expect(session.participants[0].user.toString()).toBe(
        testUser2._id.toString()
      );
      expect(session.participants[0].role).toBe("editor");
      expect(session.participants[0].isOnline).toBe(true);
    });

    it("should update existing participant", async () => {
      await session.addParticipant(testUser2._id, "viewer");
      expect(session.participants[0].role).toBe("viewer");

      await session.addParticipant(testUser2._id, "admin");
      expect(session.participants.length).toBe(1);
      expect(session.participants[0].role).toBe("admin");
    });

    it("should update stats when adding participant", async () => {
      await session.addParticipant(testUser2._id, "editor");

      expect(session.stats.activeParticipants).toBe(1);
      expect(session.stats.lastActivity).toBeDefined();
    });
  });

  describe("removeParticipant Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });
      await session.addParticipant(testUser2._id, "editor");
    });

    it("should remove a participant", async () => {
      expect(session.participants.length).toBe(1);

      await session.removeParticipant(testUser2._id);

      expect(session.participants.length).toBe(0);
    });
  });

  describe("createSnapshot Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
        content: "const x = 1;",
      });
      await session.save();
    });

    it("should create a snapshot", async () => {
      const snapshot = await session.createSnapshot(
        testUser._id,
        "First version"
      );

      expect(snapshot).toBeDefined();
      expect(snapshot.createdBy.toString()).toBe(testUser._id.toString());
      expect(snapshot.content).toBe("const x = 1;");
      expect(snapshot.message).toBe("First version");
    });

    it("should store snapshot in array", async () => {
      await session.createSnapshot(testUser._id, "Version 1");

      const reloaded = await Session.findById(session._id);
      expect(reloaded.snapshots.length).toBe(1);
      expect(reloaded.snapshots[0].message).toBe("Version 1");
    });
  });

  describe("fork Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Original Session",
        language: "python",
        content: 'print("Hello")',
      });
      await session.save();
    });

    it("should create a forked session", async () => {
      const forked = await session.fork(
        testUser2._id,
        "Forked Session",
        "A fork of the original"
      );

      expect(forked._id).toBeDefined();
      expect(forked._id.toString()).not.toBe(session._id.toString());
      expect(forked.owner.toString()).toBe(testUser2._id.toString());
      expect(forked.title).toBe("Forked Session");
      expect(forked.language).toBe(session.language);
      expect(forked.content).toBe(session.content);
      expect(forked.forkFrom.toString()).toBe(session._id.toString());
    });

    it("should increment fork count on original", async () => {
      expect(session.forksCount).toBe(0);

      await session.fork(testUser2._id, "Forked Session");

      expect(session.forksCount).toBe(1);
    });
  });

  describe("addExecution Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });
      await session.save();
    });

    it("should add execution record", async () => {
      await session.addExecution({
        userId: testUser._id,
        language: "javascript",
        output: "Hello World",
        error: null,
        exitCode: 0,
      });

      expect(session.execution.count).toBe(1);
      expect(session.execution.history.length).toBe(1);
      expect(session.execution.history[0].output).toBe("Hello World");
    });

    it("should update stats on execution", async () => {
      await session.addExecution({
        userId: testUser._id,
        language: "javascript",
        output: "Test",
        error: null,
        exitCode: 0,
      });

      expect(session.stats.totalExecutions).toBe(1);
      expect(session.stats.lastActivity).toBeDefined();
    });
  });

  describe("updateParticipantStatus Method", () => {
    let session;

    beforeEach(async () => {
      session = new Session({
        owner: testUser._id,
        title: "Test Session",
      });
      await session.addParticipant(testUser2._id, "editor");
    });

    it("should update participant online status", async () => {
      expect(session.participants[0].isOnline).toBe(true);

      await session.updateParticipantStatus(testUser2._id, false);

      expect(session.participants[0].isOnline).toBe(false);
    });

    it("should update active participants count", async () => {
      expect(session.stats.activeParticipants).toBe(1);

      await session.updateParticipantStatus(testUser2._id, false);

      expect(session.stats.activeParticipants).toBe(0);
    });
  });
});
