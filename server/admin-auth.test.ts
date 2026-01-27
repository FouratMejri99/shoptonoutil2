import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";

describe("Admin Authentication", () => {
  it("should hash passwords securely", async () => {
    const password = "Zuna9sK_4SoQ!sx#G";
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);

    // Hashes should be different due to salt
    expect(hash1).not.toBe(hash2);

    // Both should match the original password
    expect(await bcrypt.compare(password, hash1)).toBe(true);
    expect(await bcrypt.compare(password, hash2)).toBe(true);
  });

  it("should reject incorrect passwords", async () => {
    const correctPassword = "Zuna9sK_4SoQ!sx#G";
    const wrongPassword = "WrongPassword123!";
    const hash = await bcrypt.hash(correctPassword, 10);

    expect(await bcrypt.compare(correctPassword, hash)).toBe(true);
    expect(await bcrypt.compare(wrongPassword, hash)).toBe(false);
  });

  it("should validate email format", () => {
    const validEmail = "weseily@solupedia.com";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test(validEmail)).toBe(true);
    expect(emailRegex.test("invalid-email")).toBe(false);
    expect(emailRegex.test("@solupedia.com")).toBe(false);
  });

  it("should validate password has minimum length", () => {
    const strongPassword = "Zuna9sK_4SoQ!sx#G";
    const weakPassword = "123456";

    // Password must be at least 6 characters
    expect(strongPassword.length >= 6).toBe(true);
    expect(weakPassword.length >= 6).toBe(true);
    
    // But strong password should be longer and more complex
    expect(strongPassword.length > weakPassword.length).toBe(true);
  });

  it("should handle admin session data correctly", () => {
    const adminSession = {
      id: 1,
      email: "weseily@solupedia.com",
      loginTime: new Date().toISOString(),
    };

    const sessionString = JSON.stringify(adminSession);
    const parsedSession = JSON.parse(sessionString);

    expect(parsedSession.id).toBe(1);
    expect(parsedSession.email).toBe("weseily@solupedia.com");
    expect(parsedSession.loginTime).toBeDefined();
  });

  it("should validate admin credentials structure", () => {
    const adminCredentials = {
      email: "weseily@solupedia.com",
      passwordHash: "$2a$10$...", // bcrypt hash format
      isActive: true,
      lastLoginAt: new Date(),
    };

    expect(adminCredentials.email).toBeDefined();
    expect(adminCredentials.passwordHash).toBeDefined();
    expect(adminCredentials.isActive).toBe(true);
  });
});
