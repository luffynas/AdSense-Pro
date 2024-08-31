import Database from 'better-sqlite3';
import path from 'path';

// Define the database file path
const dbPath = path.resolve(process.cwd(), 'database.sqlite');

// Create a new database instance
const db = new Database(dbPath, { verbose: console.log });

// Initialize the database and the analytics table if it doesn't exist
// db.exec(`
//   CREATE TABLE IF NOT EXISTS analytics (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     total_visits INTEGER DEFAULT 0,
//     total_clicks INTEGER DEFAULT 0
//   );

//   CREATE TABLE IF NOT EXISTS proxies (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     proxy TEXT UNIQUE,
//     used INTEGER DEFAULT 0,
//     fail INTEGER DEFAULT 0  -- Kolom baru untuk menandai proxy yang gagal
//   );
  
//   CREATE TABLE IF NOT EXISTS fingerprints (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     userAgent TEXT UNIQUE,
//     viewportWidth INTEGER,
//     viewportHeight INTEGER,
//     deviceScaleFactor INTEGER,
//     isMobile INTEGER,
//     hasTouch INTEGER,
//     isLandscape INTEGER,
//     used INTEGER DEFAULT 0
//   );
// `);

// Initialize the first row if it doesn't exist
const row = db.prepare('SELECT COUNT(*) as count FROM analytics').get();
if (row.count === 0) {
  db.prepare('INSERT INTO analytics (total_visits, total_clicks) VALUES (0, 0)').run();
}

export default db;
