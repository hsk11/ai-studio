import { authService } from '../src/services/auth.service';
import { dbRun, initializeDatabase } from '../src/database/init';

describe('Auth Service', () => {
  beforeEach(() => {
    initializeDatabase();
    dbRun('DELETE FROM generations');
    dbRun('DELETE FROM users');
  });

  describe('signup', () => {
    it('should throw error for existing user', () => {
      const existingUserData = {
        email: 'test@example.com',
        password: 'password123'
      };

      authService.signup(existingUserData);
      
      expect(() => authService.signup(existingUserData))
        .toThrow('User already exists');
    });

    it('should create new user successfully', () => {
      const newUserData = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
      };

      const result = authService.signup(newUserData);
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId');
      expect(typeof result.token).toBe('string');
      expect(typeof result.userId).toBe('number');
    });
  });

  describe('login', () => {
    it('should throw error for invalid credentials', () => {
      const invalidData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      expect(() => authService.login(invalidData))
        .toThrow('Invalid credentials');
    });
  });
});
