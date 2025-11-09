import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '..', '..', 'event_feedback.db')
const db = new Database(dbPath)

const migrations = `
-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('feedback', 'idea')),
  text TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  related_event_id INTEGER,
  submitter_name TEXT,
  submitter_email TEXT,
  email_optin INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'exploring', 'lets-do-this', 'done', 'maybe-later', 'rejected')),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT,
  admin_notes TEXT
);

-- Create admin_responses table
CREATE TABLE IF NOT EXISTS admin_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  admin_name TEXT DEFAULT 'Event Organizer',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  offerings TEXT NOT NULL,
  other_offering TEXT,
  budget_range TEXT,
  venue_capacity INTEGER,
  location TEXT,
  preferred_event_types TEXT,
  availability TEXT,
  collaboration_type TEXT CHECK (collaboration_type IN ('one-time', 'ongoing')),
  additional_details TEXT,
  email_optin INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'confirmed', 'passed')),
  admin_notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  event_type TEXT NOT NULL,
  topic_tags TEXT DEFAULT '[]',
  food_drinks TEXT,
  description TEXT,
  links TEXT DEFAULT '[]',
  speakers TEXT DEFAULT '[]',
  sponsors TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_admin_responses_submission ON admin_responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_session ON rate_limits(session_id, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_timestamp ON rate_limits(timestamp);
`

function migrate() {
  try {
    console.log('Running database migrations...')
    db.exec(migrations)
    console.log('✓ Migrations completed successfully')
    console.log('✓ Database created at:', dbPath)
    db.close()
  } catch (error) {
    console.error('Migration error:', error)
    db.close()
    process.exit(1)
  }
}

migrate()
