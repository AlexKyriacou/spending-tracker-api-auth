//utility functions for password complexity checking and hashing
import bcrypt from "bcrypt";

export const SALT_ROUNDS = 10;

export function passwordMeetsRequirements(password: string): boolean {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Password must contain at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return false;
  }

  // Password must contain at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  return true;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}