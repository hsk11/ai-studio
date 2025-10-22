import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../database/init';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

interface SignupData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  password: string;
}

export const authService = {
  signup(data: SignupData): { token: string; userId: number } {
    const { email, password } = data;

    const existingUser = dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = dbRun(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const token = jwt.sign({ userId: result.lastID }, JWT_SECRET, { expiresIn: '24h' });

    return { token, userId: result.lastID };
  },

  login(data: LoginData): { token: string; userId: number } {
    const { email, password } = data;

    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]) as User;
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    return { token, userId: user.id };
  }
};
