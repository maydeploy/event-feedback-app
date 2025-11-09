import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import session from 'express-session'
import dotenv from 'dotenv'
import submissionsRouter from './routes/submissions.js'
import collaborationsRouter from './routes/collaborations.js'
import eventsRouter from './routes/events.js'
import adminRouter from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 minutes
    },
  })
)

// Routes
app.use('/api/submissions', submissionsRouter)
app.use('/api/collaborations', collaborationsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/admin', adminRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`  CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})
