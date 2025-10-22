import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'ai_studio.db');
const db = new Database(dbPath);

export { db };

export const dbRun = (sql: string, params: any[] = []): { lastID: number; changes: number } => {
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    lastID: result.lastInsertRowid as number,
    changes: result.changes
  };
};

export const dbGet = (sql: string, params: any[] = []): any => {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
};

export const dbAll = (sql: string, params: any[] = []): any[] => {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
};

export function initializeDatabase(): void {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createGenerationsTable = `
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      style TEXT NOT NULL,
      image_url TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;

  db.exec(createUsersTable);
  db.exec(createGenerationsTable);
  console.log('SQLite database initialized successfully.');
}