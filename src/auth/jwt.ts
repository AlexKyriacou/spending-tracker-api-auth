import jwt from "jsonwebtoken";
import { User } from "../types/graphql";
import * as dotenv from 'dotenv'
dotenv.config()

var jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

export const createToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): string | object => {
  return jwt.verify(token, jwtSecret);
};

export const getUserIdFromToken = (token: string): string => {
  if (!token) {
    return "";
  }
  const decoded = verifyToken(token) as { userId: string };
  if (!decoded) {
    return "";
  }
  return decoded.userId.toString();
};

export const getTokenFromRequest = (req: any): string => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    } else {
      console.error("Authorization header is not in Bearer <token> format");
    }
  } else {
    console.error("Authorization header is missing");
  }

  return ""; // Return a default value if no token is found
};
