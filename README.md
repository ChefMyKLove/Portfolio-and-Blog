# Chef MyKLove Portfolio with Blog & Print Store

A full-stack portfolio + members-only blog with Patreon OAuth authentication and Printify Pop-Up Store integration. Features glassmorphism design, animated cycling backgrounds, dynamic blog posts, secure member access, and print-on-demand artwork sales.


## Project Structure

**Backend Documentation:**
See [backend/README.md](backend/README.md) for backend API, environment, and deployment details.

```
chefmyklove-portfolio/
├── index.html               # Main portfolio landing page
├── carousel.css             # Glassmorphism styling + animations
├── interactivity.js         # Portfolio interactions + modals
├── members.html             # Members redirect page
├── PRINTIFY-SETUP.md        # Print store setup guide
│
├── images/                   # Artwork + background images
│   ├── HummingBow.jpg       # Primary background image
│   ├── TunnelBow.JPEG       # Featured artwork
│   └── IMG_*.JPEG           # Carousel backgrounds (13 images)
│
├── blog/                     # Members-only blog
│   ├── blook.html           # Blog interface
│   ├── blook.js             # Blog logic
│   ├── carousel.css         # Blog-specific styling
│   └── images/              # Blog background images
│
├── backend/                  # Express API (Railway)
│   ├── server.js            # Main server file
│   ├── routes/
│   │   ├── auth.js          # Patreon OAuth flow
│   │   ├── members.js       # Protected routes
│   │   └── printful.js      # Printful API (deprecated)
│   ├── middleware/
│   │   └── auth.js          # Authentication verification
│   ├── db/
│   │   ├── db.js            # PostgreSQL connection
│   │   └── init.js          # Database schema setup
│   ├── package.json
│   └── .env                 # Environment variables (not committed)
│
└── docs/
    └── SETUP.md             # Setup instructions
```

## Features

✅ **Glassmorphism Design** - Frosted glass aesthetic with `backdrop-filter: blur()` effects  
✅ **Animated Cycling Backgrounds** - 13-image rainbow carousel with 104s smooth transitions  
✅ **Printify Pop-Up Store Integration** - Print-on-demand artwork sales via modal embed  
✅ **Patreon OAuth 2.0** - Secure member authentication for blog access  
✅ **Dynamic Blog Posts** - Create, edit, delete posts (admin only)  
✅ **Weather Widget** - Real-time weather with geolocation + random cities  
✅ **SoundCloud Music Player** - Embedded playlist with shuffle functionality  
✅ **Email Contact Form** - FormSpark integration with topic selection  
✅ **Responsive Design** - Mobile-friendly with optimized image lazy-loading  
✅ **Art Portfolio Carousel** - 12 artworks with "Order Print" + "Coming Soon" labels

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Glassmorphism effects with animated backgrounds
- Bootstrap 5.3.8 (CDN)
- Lazy-loading optimization for 11MB background images

**Backend:**
- Node.js v24.11.0 + Express.js 4.18.2
- PostgreSQL 18 (Railway hosted)
- Patreon API (OAuth 2.0)
- express-session (server-side sessions)
- Deployed: `https://portfolio-and-blog-production.up.railway.app`

**Print Store:**
- Printify Pop-Up Store (free tier)
- Stripe payment processing (via Printify)
- Modal embed with glassmorphism styling
- Store: `https://ordinalrainbows.printify.me/`

**APIs:**
- OpenWeatherMap (weather widget)
- FormSpark (contact form)
- SoundCloud (embedded player)

## Glassmorphism Design System

The site features a consistent **glassmorphism aesthetic**:

**Core Elements:**
- Frosted glass: `background: rgba(0, 0, 0, 0.5)` + `backdrop-filter: blur(200px)`
- Animated backgrounds: 13 rainbow images cycling @ 104s
- Purple glow: `box-shadow: 0 0 20px rgba(102, 126, 234, 0.3)`
- Text shadows: `2px 2px 4px rgba(0, 0, 0, 0.8)` for readability
- Smooth transitions: `0.3s ease` on all interactions

**Applied To:** Header, sections, modals, widgets, carousel cards, buttons

## Print Store (Printify Pop-Up)

**Setup:** See `PRINTIFY-SETUP.md`

**Flow:**
1. Customer clicks artwork → Modal opens with Printify store
2. Customer shops + pays via Stripe (on Printify platform)
3. Printify deducts production cost → You keep profit
4. Printify prints, ships, handles support

**No fees, no credit card needed!**

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

```

### 4. Start Servers


**Start Backend (Port 3002):**
```bash
cd backend
npm run dev
```

**Serve Frontend (Port 8000):**
You can use a simple static server (such as [http-server](https://www.npmjs.com/package/http-server)) from the project root:
```bash
npx http-server -p 8000
```

### 5. Access the App

- Portfolio: `http://localhost:8000/index.html`
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


### Create/Edit Posts (Admin Only)
1. Click "+ Write Post or Info" in the Further Information section
2. Enter the blog admin password (see below)
3. Choose "Blog Post" or "Info Page"
4. Write your content
5. Click Publish/Save

**Blog Admin Password Security:**
- The blog admin password is set via the `MYSTIC_PASSWORD` environment variable in `backend/.env` (see `.env.example`).
- For frontend security, the password is injected at build/deploy time into `blog/blook.js` (replacing `__MYSTIC_PASSWORD__`).
- Never hardcode your real password in the repo. Use a build script or CI/CD step to inject the value before deployment.

### Default Content
- "about me" post automatically added on first load
- Displays in Latest Installment section
- Fully editable once page loads

## Animation Details

Background images cycle through 13 images with different animation speeds:
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
⚠️ **Password**: Never hardcode your admin password. Use environment variables and build-time injection for frontend-only logic.
⚠️ **CORS**: Currently disabled - enable for production cross-origin requests
⚠️ **Sessions**: Set secure=true for HTTPS in production

## Troubleshooting

### Images not loading
- Check that `/images/` and `/blog/images/` directories exist with the required image files
- Verify paths are correct and match the references in your HTML/CSS/JS

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
