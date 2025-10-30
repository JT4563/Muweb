// tests/unit/auth.test.js
const User = require("../../models/user.model");
const {
  connectTestDB,
  disconnectTestDB,
  cleanCollections,
} = require("../setup");

describe("Authentication Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await cleanCollections();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
        firstName: "Test",
        lastName: "User",
      };

      const user = new User({
        ...userData,
        password: await require("bcryptjs").hash(userData.password, 10),
      });

      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
    });

    it("should not register with duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser1",
        password: "SecurePassword123!",
      };

      const user1 = new User({
        ...userData,
        password: await require("bcryptjs").hash(userData.password, 10),
      });
      await user1.save();

      const user2 = new User({
        ...userData,
        username: "testuser2",
        password: await require("bcryptjs").hash(userData.password, 10),
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it("should not register with duplicate username", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user1 = new User({
        ...userData,
        password: await require("bcryptjs").hash(userData.password, 10),
      });
      await user1.save();

      const user2 = new User({
        ...userData,
        email: "test2@example.com",
        password: await require("bcryptjs").hash(userData.password, 10),
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it("should validate email format", async () => {
      const userData = {
        email: "invalid-email",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user = new User({
        ...userData,
        password: await require("bcryptjs").hash(userData.password, 10),
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should validate username length (min 3 chars)", async () => {
      const userData = {
        email: "test@example.com",
        username: "ab",
        password: "SecurePassword123!",
      };

      const user = new User({
        ...userData,
        password: await require("bcryptjs").hash(userData.password, 10),
      });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("Password Handling", () => {
    it("should hash password before saving", async () => {
      const plainPassword = "SecurePassword123!";
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: plainPassword,
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(plainPassword);
    });

    it("should compare password correctly", async () => {
      const plainPassword = "SecurePassword123!";
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: plainPassword,
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const wrongPassword = await user.comparePassword("WrongPassword123!");
      expect(wrongPassword).toBe(false);
    });
  });

  describe("User Fields", () => {
    it("should have all required fields", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user = new User(userData);
      await user.save();

      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.role).toBe("user");
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.lastLogin).toBeUndefined();
    });

    it("should update lastLogin timestamp", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user = new User(userData);
      await user.save();

      user.lastLogin = new Date();
      await user.save();

      expect(user.lastLogin).toBeDefined();
    });

    it("should have preferences field", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user = new User(userData);
      user.preferences = {
        theme: "dark",
        editorSettings: { fontSize: 14 },
      };
      await user.save();

      expect(user.preferences.theme).toBe("dark");
      expect(user.preferences.editorSettings.fontSize).toBe(14);
    });
  });

  describe("toJSON Method", () => {
    it("should not include password in toJSON", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "SecurePassword123!",
      };

      const user = new User(userData);
      await user.save();

      const userJson = user.toJSON();
      expect(userJson.password).toBeUndefined();
      expect(userJson.email).toBe(userData.email);
    });
  });
});
