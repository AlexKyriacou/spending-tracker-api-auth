import jwt from "jsonwebtoken";
import { User } from "../types/graphql";
import { config } from 'dotenv';

const jwtSecret = config().parsed?.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
}

export const createToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): string | object => {
  return jwt.verify(token, jwtSecret);
};

export const getUserIdFromToken = (token: string): number => {
  const decoded = verifyToken(token) as { userId: number };
  return decoded.userId;
};
