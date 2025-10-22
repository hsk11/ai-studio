import request from 'supertest';
const JaiServer = require('jai-server');
import { loadControllers } from '../src/controllers';
import { dbRun, initializeDatabase } from '../src/database/init';

const app = JaiServer({
  bodyParser: {
    limit: 10000000,
  }
});
loadControllers(app);

describe('Authentication', () => {
  beforeEach(() => {
    initializeDatabase();
    dbRun('DELETE FROM generations');
    dbRun('DELETE FROM users');
  });

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await request(app).post('/api/auth/signup').send(userData);
      
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);
    });

    it('should validate password length', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      await request(app).post('/api/auth/signup').send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });

    it('should reject invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });
});
