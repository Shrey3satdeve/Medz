// Database initialization
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'labdash.db');
const schemaPath = path.join(__dirname, 'schema.sql');

function initDatabase() {
  console.log('Initializing database...');
  
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Read and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  
  console.log('Database initialized successfully at:', dbPath);
  
  return db;
}

module.exports = { initDatabase };
