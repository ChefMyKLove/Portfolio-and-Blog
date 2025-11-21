# Setup Instructions

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/chefmyklove-portfolio.git
cd chefmyklove-portfolio
```

### 2. Get Patreon Credentials

1. Go to https://www.patreon.com/portal/registration/register-clients
2. Create a new OAuth client
3. Set redirect URI to: `http://localhost:3002/auth/patreon/callback`
4. Copy your Client ID and Client Secret

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=3002
FRONTEND_URL=http://localhost:8000
PATREON_REDIRECT_URI=http://localhost:3002/auth/patreon/callback
PATREON_CLIENT_ID=your_client_id_here
PATREON_CLIENT_SECRET=your_client_secret_here
DATABASE_URL=postgresql://postgres:your_password@localhost/chefmyklove_blog
```

### 4. Setup PostgreSQL Database

```bash
# Create database and user
psql -U postgres
CREATE DATABASE chefmyklove_blog;
CREATE USER chefmyklove WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chefmyklove_blog TO chefmyklove;
\q
```

Or run the setup script:
```bash
cd backend
npm run setup-db
```

### 5. Start Backend

```bash
cd backend
npm run dev
# Should see: 🚀 Server running on http://localhost:3002
```

### 6. Start Frontend

```bash
cd frontend
npx http-server -p 8000
# Should see: Available on: http://127.0.0.1:8000
```

### 7. Test the App

1. Open http://localhost:8000/portfolio.html
2. Click "Log In with Patreon"
3. Authorize with your Patreon account
4. Should redirect to http://localhost:8000/blog/blook.html
5. You should see the blog with the "about me" post

## Troubleshooting

### "localhost refused to connect"
- Check both servers are running
- Backend: `npm run dev` in /backend
- Frontend: `npx http-server -p 8000` in /frontend

### "Error connecting to database"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Make sure chefmyklove_blog database exists

### "OAuth callback error"
- Verify Patreon credentials in .env
- Check redirect URI is registered in Patreon portal
- Must match exactly: `http://localhost:3002/auth/patreon/callback`

### "Images not animating"
- Check /frontend/blog/images/ contains IMG_*.jpg files
- Verify carousel.css has correct image paths
- Clear browser cache

### "Blog not showing after login"
- Open browser DevTools → Console
- Check for authentication errors
- Verify backend is responding to /auth/verify endpoint

## File Structure Guide

```
frontend/
├── portfolio.html        # Main landing page
├── carousel.css          # Shared animations & styling
├── interactivity.js      # Portfolio interactions
├── blog/
│   ├── blook.html       # Blog page (members only)
│   ├── carousel.css     # Blog styling
│   └── images/          # 17 background images
└── images/              # Portfolio images

backend/
├── server.js            # Express app
├── routes/auth.js       # Patreon OAuth logic
├── db/
│   ├── db.js           # PostgreSQL connection
│   └── init.js         # Schema creation
└── .env                # Secrets (don't commit!)
```

## Environment Variables Explanation

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Backend server port | 3002 |
| FRONTEND_URL | Frontend URL for redirects | http://localhost:8000 |
| PATREON_REDIRECT_URI | OAuth callback URL | http://localhost:3002/auth/patreon/callback |
| PATREON_CLIENT_ID | From Patreon developer portal | abc123... |
| PATREON_CLIENT_SECRET | From Patreon developer portal | secret123... |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost/db |

## Production Deployment

### Update Patreon Portal

1. Register new redirect URI for production domain
2. Example: `https://yourdomain.com/auth/patreon/callback`

### Update Environment Variables

```
FRONTEND_URL=https://yourdomain.com
PATREON_REDIRECT_URI=https://yourdomain.com/auth/patreon/callback
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/prod_db
```

### Deploy Backend

Options:
- Railway.app (recommended for Node.js)
- Heroku
- AWS EC2
- DigitalOcean

### Deploy Frontend

Options:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Testing OAuth Flow

1. Use a test Patreon account that's not a patron
2. Verify you're redirected back to portfolio
3. Use a patron account
4. Verify you're redirected to blog

## MongoDB Alternative

To use MongoDB instead of PostgreSQL:

1. Install mongoose: `npm install mongoose`
2. Update db/db.js to use Mongoose connection
3. Update schema in db/init.js
4. Update routes to use Mongoose models

(Future enhancement - currently uses PostgreSQL)

## Questions?

- Check browser console for errors
- Review server logs in terminal
- Check .env variables are set correctly
- Verify database connection
