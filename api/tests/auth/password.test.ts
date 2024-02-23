import { passwordMeetsRequirements, comparePasswords } from '../../src/auth/password';
import bcrypt from 'bcrypt';

describe('passwordMeetsRequirements', () => {
  it('should return false if password is less than 8 characters long', () => {
    const password = 'pass';
    const result = passwordMeetsRequirements(password);
    expect(result).toBe(false);
  });

  it('should return false if password does not contain any letter', () => {
    const password = '12345678';
    const result = passwordMeetsRequirements(password);
    expect(result).toBe(false);
  });

  it('should return false if password does not contain any number', () => {
    const password = 'password';
    const result = passwordMeetsRequirements(password);
    expect(result).toBe(false);
  });

  it('should return true if password meets all requirements', () => {
    const password = 'Password123';
    const result = passwordMeetsRequirements(password);
    expect(result).toBe(true);
  });
});

describe('comparePasswords', () => {
  it('should return true if the passwords match', async () => {
    const password = 'Password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await comparePasswords(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false if the passwords do not match', async () => {
    const password = 'Password123';
    const wrongPassword = 'WrongPassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await comparePasswords(wrongPassword, hashedPassword);
    expect(result).toBe(false);
  });
});