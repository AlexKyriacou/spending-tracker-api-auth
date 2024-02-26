import { createToken, getUserIdFromToken } from "../../src/auth/jwt.js";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

describe("JWT Token Logic", () => {
  it("should return a token", () => {
    const token = createToken({
      id: 1,
      username: "test",
      createdAt: Date.now(),
      email: "",
      updatedAt: Date.now(),
    });
    expect(token).toBeTruthy();
  });
});

it("should return the user ID from the token", () => {
  const token = createToken({
    id: 1,
    username: "test",
    createdAt: Date.now(),
    email: "",
    updatedAt: Date.now(),
  });
  const userId = getUserIdFromToken(token);
  expect(userId).toBe(1);
});

it("should throw a TokenExpiredError if the JWT is expired", () => {
  const token = createToken({
    id: 1,
    username: "test",
    createdAt: Date.now(),
    email: "",
    updatedAt: Date.now(),
  });
  const userId = getUserIdFromToken(token);
  expect(userId).toBe(1);
  // Expire the token
  jest.spyOn(Date, "now").mockReturnValue(100000000000000);
  expect(() => {
    getUserIdFromToken(token);
  }).toThrow(TokenExpiredError);
});

it("should throw an error if the JWT is tampered with", () => {
  const token = createToken({
    id: 1,
    username: "test",
    createdAt: Date.now(),
    email: "",
    updatedAt: Date.now(),
  });
  const userId = getUserIdFromToken(token);
  expect(userId).toBe(1);
  // Tamper with the token
  const tamperedToken = token + "a";
  expect(() => {
    getUserIdFromToken(tamperedToken);
  }).toThrow(JsonWebTokenError);
});
