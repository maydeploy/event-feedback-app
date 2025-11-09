# Event Hosting Feedback App

A mobile-first, community-driven web application that empowers event attendees to shape future events through feedback, ideas, and collaboration offers.

## Features

- **Submit Feedback**: Share thoughts about past events
- **Suggest Ideas**: Propose topics, speakers, or formats for future events
- **Offer Collaboration**: Provide speakers, venues, or support
- **Browse & Vote**: View and vote on community submissions
- **Past Events Archive**: Explore previous events
- **Admin Dashboard**: Manage submissions, responses, and events (password-protected)

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS (custom design system)
- React Router for navigation
- Axios for API calls
- Session-based voting and rate limiting

### Backend
- Node.js + Express
- PostgreSQL database
- Session-based authentication
- Rate limiting & XSS prevention
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**

```bash
cd claudecodetest
```

2. **Set up the database**

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_feedback;

# Exit psql
\q
```

3. **Backend setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Generate admin password hash
node src/utils/hashPassword.js your_admin_password
# Copy the output hash to .env as ADMIN_PASSWORD_HASH

# Edit .env with your database credentials and other settings

# Run database migrations
npm run db:migrate

# Start backend server
npm run dev
```

The backend will run on http://localhost:5000

4. **Frontend setup**

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, uses defaults)
cp .env.example .env

# Start frontend dev server
npm run dev
```

The frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_feedback
DB_USER=postgres
DB_PASSWORD=your_password

ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
SESSION_SECRET=your_random_secret_key

CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
event-feedback-app/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Button, Card, Tag, Input, etc.
│   │   │   └── layout/        # Layout, Navigation
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── utils/             # Helpers (validation, session, rate limit)
│   │   ├── App.jsx            # Main app component
│   │   └── index.css          # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js     # Custom design system
├── backend/
│   ├── src/
│   │   ├── db/                # Database connection & migrations
│   │   ├── middleware/        # Auth, rate limiting, validation
│   │   ├── routes/            # API routes
│   │   │   ├── submissions.js
│   │   │   ├── collaborations.js
│   │   │   ├── events.js
│   │   │   └── admin.js
│   │   ├── utils/             # Helper utilities
│   │   └── server.js          # Express server
│   └── package.json
└── README.md
```

## API Endpoints

### Public Endpoints

**Submissions**
- `POST /api/submissions` - Create feedback or idea
- `GET /api/submissions` - Get approved submissions (with filters)
- `GET /api/submissions/:id` - Get single submission with responses
- `POST /api/submissions/:id/vote` - Vote on submission

**Collaborations**
- `POST /api/collaborations` - Submit collaboration offer

**Events**
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event

### Admin Endpoints (require authentication)

**Auth**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

**Submission Management**
- `GET /api/admin/pending` - Get pending submissions
- `PUT /api/admin/submissions/:id/approve` - Approve submission
- `DELETE /api/admin/submissions/:id/reject` - Reject submission
- `GET /api/admin/published` - Get published submissions
- `PUT /api/admin/submissions/:id/status` - Update status
- `POST /api/admin/submissions/:id/response` - Add admin response
- `DELETE /api/admin/submissions/:id` - Delete submission

**Collaboration Management**
- `GET /api/admin/collaborations` - Get all collaboration offers
- `PUT /api/admin/collaborations/:id` - Update collaboration status/notes

**Event Management**
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event

## Design System

### Colors
- **Background**: Warm cream `#F5F3EF`
- **Accent**: Burnt orange `#E8573E`
- **Text Primary**: `#4A4A4A`
- **Pastel Colors**: Yellow, Pink, Sage, Blue, Lavender

### Typography
- **Serif**: Lora (headers, body)
- **Handwritten**: Caveat (labels, instructions)
- **Sans**: Inter (UI elements)

### Component Patterns
- Card/Stamp effect with slight rotation
- Grid paper background pattern
- Pastel tag chips
- Warm, approachable aesthetic

## Rate Limiting

- **Feedback/Ideas**: 3 submissions per hour per session
- **Collaborations**: 2 submissions per day per session

Rate limits are tracked by session ID stored in localStorage.

## Admin Access

Access the admin dashboard at: http://localhost:3000/admin

**Note**: There are no links to the admin page in the public UI. Bookmark the URL or type it directly.

## Development

### Frontend Development

```bash
cd frontend
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

### Backend Development

```bash
cd backend
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start without auto-reload
npm run db:migrate # Run database migrations
```

## Deployment

### Database
1. Set up PostgreSQL on your hosting platform (Railway, Render, etc.)
2. Run migrations: `npm run db:migrate`

### Backend
1. Deploy to Railway, Render, or similar
2. Set environment variables
3. Ensure CORS_ORIGIN points to your frontend URL

### Frontend
1. Deploy to Vercel or Netlify
2. Set VITE_API_URL to your backend URL
3. Build command: `npm run build`
4. Output directory: `dist`

## Security Features

- Session-based authentication for admin
- Bcrypt password hashing
- XSS prevention (input sanitization)
- SQL injection prevention (parameterized queries)
- Rate limiting per session
- HTTPS required in production
- Helmet.js for security headers

## Browser Support

- Modern mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Desktop browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
