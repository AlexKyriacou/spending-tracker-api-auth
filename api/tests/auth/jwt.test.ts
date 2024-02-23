import { createToken, getUserIdFromToken } from '../../src/auth/jwt';

describe("createToken", () => {
  it("should return a token", () => {
    const token = createToken({
      id: "1",
      username: "test",
      createdAt: Date.now(),
      email: "",
      updatedAt: Date.now(),
    });
    expect(token).toBeTruthy();
  });
});

describe("getUserIdFromToken", () => {
  it("should return the user ID from the token", () => {
    const token = createToken({
      id: "1",
      username: "test",
      createdAt: Date.now(),
      email: "",
      updatedAt: Date.now(),
    });
    const userId = getUserIdFromToken(token);
    expect(userId).toBe("1");
  });
});