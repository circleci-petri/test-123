import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(__dirname, '../../database/app.db');
const db = new sqlite3.Database(dbPath);

const runAsync = promisify(db.run.bind(db));
const allAsync = promisify(db.all.bind(db));
const getAsync = promisify(db.get.bind(db));

export const query = async (sql: string, params: any[] = []): Promise<any> => {
  return allAsync(sql, params);
};

export const queryOne = async (sql: string, params: any[] = []): Promise<any> => {
  return getAsync(sql, params);
};

export const execute = async (sql: string, params: any[] = []): Promise<any> => {
  return runAsync(sql, params);
};

export const initDatabase = async () => {
  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  const seedPath = path.join(__dirname, '../../database/seed.sql');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  const seed = fs.readFileSync(seedPath, 'utf8');

  const schemaStatements = schema.split(';').filter(s => s.trim());
  for (const statement of schemaStatements) {
    if (statement.trim()) {
      await runAsync(statement);
    }
  }

  const existing = await queryOne('SELECT COUNT(*) as count FROM users', []);
  if (existing.count === 0) {
    const seedStatements = seed.split(';').filter(s => s.trim());
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await runAsync(statement);
      }
    }
  }

  console.log('Database initialized successfully');
};

export default db;
