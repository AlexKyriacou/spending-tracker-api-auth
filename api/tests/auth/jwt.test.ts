import { createToken } from '../../src/auth/jwt'

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
