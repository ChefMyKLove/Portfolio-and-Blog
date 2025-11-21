# Chef My K Love - Patreon Members Blog

A full-stack portfolio + members-only blog with Patreon OAuth authentication. Features animated backgrounds, dynamic blog posts, and secure member access.

## Project Structure

```
chefmyklove-portfolio/
├── frontend/                 # Portfolio + Blog (Port 8000)
│   ├── portfolio.html       # Landing page with Patreon login
│   ├── carousel.css         # Shared styling for animations
│   ├── interactivity.js     # Portfolio interactions
│   ├── blog/
│   │   ├── blook.html       # Members-only blog page
│   │   ├── carousel.css     # Blog-specific styling
│   │   └── images/          # Background images for animations
│   ├── images/              # Portfolio images
│   └── members.html         # Members page (future)
│
├── backend/                  # Express API (Port 3002)
│   ├── server.js            # Main server file
│   ├── routes/
│   │   ├── auth.js          # Patreon OAuth flow
│   │   └── members.js       # Protected routes
│   ├── middleware/
│   │   └── auth.js          # Authentication verification
│   ├── db/
│   │   ├── db.js            # PostgreSQL connection
│   │   └── init.js          # Database schema setup
│   ├── .env                 # Environment variables (not committed)
│   ├── package.json
│   └── node_modules/        # Dependencies
│
└── docs/                     # Documentation
    └── SETUP.md             # Setup instructions
```

## Features

✅ **Patreon OAuth 2.0 Integration** - Secure member authentication
✅ **Animated Backgrounds** - 17-image carousel with smooth transitions
✅ **Dynamic Blog Posts** - Create, edit, delete posts (members only)
✅ **Info Pages** - Additional content management
✅ **Password Protection** - Create modal requires password verification
✅ **Responsive Design** - Works on mobile and desktop
✅ **External CSS** - Consolidated stylesheet for easy maintenance

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5.3.8 (CDN)
- http-server for local development

**Backend:**
- Node.js v24.11.0
- Express.js 4.18.2
- PostgreSQL 18
- Patreon API (OAuth 2.0)
- express-session (server-side sessions)

## Quick Start

### Prerequisites
- Node.js v24+
- PostgreSQL 18+
- Patreon Developer Account (for credentials)

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your Patreon credentials:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env`:
```
PORT=3002
FRONTEND_URL=http://localhost:8000
PATREON_REDIRECT_URI=http://localhost:3002/auth/patreon/callback
PATREON_CLIENT_ID=your_client_id
PATREON_CLIENT_SECRET=your_client_secret
DATABASE_URL=postgresql://postgres:password@localhost/chefmyklove_blog
```

### 2. Database Setup

```bash
cd backend
npm run setup-db
```

This creates the PostgreSQL database and tables.

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (no dependencies required, uses CDN)
```

### 4. Start Servers

**Terminal 1 - Backend (Port 3002):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 8000):**
```bash
cd frontend
npx http-server -p 8000
```

### 5. Access the App

- Portfolio: `http://localhost:8000/portfolio.html`
- Blog (after auth): `http://localhost:8000/blog/blook.html`

## Patreon OAuth Flow

1. User visits portfolio.html
2. Clicks "Log In with Patreon" button
3. Redirected to Patreon authorization endpoint
4. User logs in and grants access to Patreon
5. Patreon redirects back to `http://localhost:3002/auth/patreon/callback`
6. Backend verifies membership and creates session
7. Backend redirects to blog with authentication token
8. Blog page verifies session before showing content

## API Endpoints

### Authentication
- `GET /auth/patreon` - Initiate Patreon OAuth
- `GET /auth/patreon/callback` - OAuth callback (handled by backend)
- `GET /auth/verify` - Check if user is authenticated patron
- `GET /auth/logout` - Destroy session and logout

### Blog
- `GET /blog/posts` - Get all blog posts
- `POST /blog/posts` - Create new post (authenticated)
- `PUT /blog/posts/:id` - Edit post (authenticated)
- `DELETE /blog/posts/:id` - Delete post (authenticated)

## Blog Features

### Create/Edit Posts
1. Click "+ Write Post or Info" in the Further Information section
2. Enter password: `mystic`
3. Choose "Blog Post" or "Info Page"
4. Write your content
5. Click Publish/Save

### Default Content
- "about me" post automatically added on first load
- Displays in Latest Installment section
- Fully editable once page loads

## Animation Details

Background images cycle through 17 images with different animation speeds:
- **Container**: 104s cycle (darker overlay)
- **Blog posts**: 104s cycle (linear, no glitches)
- **Latest section**: 120s cycle
- **Further info**: 135s cycle
- **Contents section**: 165s cycle

All animations use the same @keyframes but with staggered timings for visual depth.

## Deployment

### Railway / Vercel

1. Update Patreon redirect URI in developer portal to production domain
2. Update `FRONTEND_URL` and `PATREON_REDIRECT_URI` in production .env
3. Deploy backend to Railway or similar
4. Deploy frontend to Vercel or similar
5. Update database to production PostgreSQL

## Database Schema

### Users Table
```sql
id (SERIAL PRIMARY KEY)
patreon_id (VARCHAR UNIQUE)
email (VARCHAR)
first_name (VARCHAR)
last_name (VARCHAR)
is_patron (BOOLEAN)
access_token (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Blog Posts Table
```sql
id (SERIAL PRIMARY KEY)
user_id (INT FK -> users.id)
title (VARCHAR)
content (TEXT)
created_at (TIMESTAMP)
```

## Security Notes

⚠️ **Environment Variables**: Never commit `.env` files
⚠️ **Password**: Change 'mystic' to a secure password in production
⚠️ **CORS**: Currently disabled - enable for production cross-origin requests
⚠️ **Sessions**: Set secure=true for HTTPS in production

## Troubleshooting

### Images not loading
- Check that `/blog/images/` directory exists with IMG_*.jpg files
- Verify paths are absolute from server root: `/blog/images/IMG_4570.jpg`

### OAuth not working
- Verify both servers are running (3002 and 8000)
- Check Patreon redirect URI is registered in developer portal
- Ensure .env has correct credentials

### Blog not loading after login
- Check browser console for authentication errors
- Verify backend is running and responding to `/auth/verify`
- Clear browser cache and localStorage

## Future Enhancements

- [ ] MongoDB backend alternative (learning goal)
- [ ] Database blog post storage (currently localStorage)
- [ ] Member profile pages
- [ ] Post categories/tags
- [ ] Comment system
- [ ] Email notifications
- [ ] Production deployment

## License

MIT

## Contact

- Portfolio: https://chefmyklove.com
- Patreon: https://patreon.com/chefmyklove
