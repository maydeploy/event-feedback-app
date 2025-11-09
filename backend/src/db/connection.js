// Use SQLite for local development (no PostgreSQL setup needed)
// To use PostgreSQL in production, swap this import
import pool from './connection-sqlite.js'

export default pool
