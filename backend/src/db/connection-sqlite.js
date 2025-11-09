import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create database file in the backend directory
const dbPath = join(__dirname, '..', '..', 'event_feedback.db')

const db = new Database(dbPath, { verbose: console.log })

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('✓ SQLite database connected at:', dbPath)

// Wrapper to make SQLite API similar to pg
const pool = {
  query: (text, params = []) => {
    try {
      // Handle different query types
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = db.prepare(text)
        const rows = stmt.all(...params)
        return { rows }
      } else if (text.trim().toUpperCase().startsWith('INSERT') && text.includes('RETURNING')) {
        // Handle INSERT with RETURNING
        const cleanQuery = text.replace(/RETURNING .+$/i, '')
        const stmt = db.prepare(cleanQuery)
        const info = stmt.run(...params)
        return { rows: [{ id: info.lastInsertRowid }] }
      } else {
        // UPDATE, DELETE, etc.
        const stmt = db.prepare(text)
        const info = stmt.run(...params)
        return { rows: info.changes > 0 ? [{}] : [] }
      }
    } catch (error) {
      console.error('Query error:', error)
      console.error('Query:', text)
      console.error('Params:', params)
      throw error
    }
  },

  connect: () => Promise.resolve({
    query: pool.query,
    release: () => {}
  }),

  end: () => {
    db.close()
    return Promise.resolve()
  }
}

export default pool
