import request from 'supertest';
const JaiServer = require('jai-server');
import { loadControllers } from '../src/controllers';
import { dbRun, initializeDatabase } from '../src/database/init';
import jwt from 'jsonwebtoken';

const app = JaiServer({
  bodyParser: {
    limit: 10000000,
  }
});
loadControllers(app);

const JWT_SECRET = 'your-secret-key';

describe('Generations', () => {
  let authToken: string;
  let userId: number;

  beforeEach(() => {
    initializeDatabase();
    dbRun('DELETE FROM generations');
    dbRun('DELETE FROM users');
    
    const result = dbRun(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['test@example.com', 'hashedpassword']
    );
    userId = result.lastID;
    authToken = jwt.sign({ userId }, JWT_SECRET);
  });

  describe('POST /generations', () => {
    it('should create a generation with valid data', async () => {
      const formData = {
        prompt: 'A beautiful sunset',
        style: 'realistic',
      };

      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', formData.prompt)
        .field('style', formData.style)
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('image_url');
      expect(response.body.data).toHaveProperty('prompt', formData.prompt);
      expect(response.body.data).toHaveProperty('style', formData.style);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/generations')
        .field('prompt', 'test')
        .field('style', 'realistic')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'test')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(400);
    });

    it('should reject non-image files', async () => {
      await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'test')
        .field('style', 'realistic')
        .attach('image', Buffer.from('fake-text-data'), 'test.txt')
        .expect(400);
    });
  });

      describe('GET /generations', () => {
        beforeEach(() => {
          dbRun(
            'INSERT INTO generations (user_id, prompt, style, image_url) VALUES (?, ?, ?, ?)',
            [userId, 'Test prompt', 'realistic', 'data:image/jpeg;base64,test']
          );
        });

    it('should return user generations', async () => {
      const response = await request(app)
        .get('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/generations?limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/generations')
        .expect(401);
    });
  });
});
