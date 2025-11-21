# ChefMyKLove Portfolio Backend

Backend server for the portfolio site with Patreon OAuth authentication and members-only blog access.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env` to `.env.local` and update with your values:
```
PATREON_CLIENT_ID=your_client_id
PATREON_CLIENT_SECRET=your_client_secret
DATABASE_URL=postgresql://user:password@localhost/chefmyklove_blog
```

### 3. Set Up Database
Make sure PostgreSQL is running, then:
```bash
npm run setup-db
```

This creates the `users` and `blog_posts` tables.

### 4. Start the Server
**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3001`

## API Routes

### Authentication
- `GET /auth/patreon` - Redirect to Patreon login
- `GET /auth/patreon/callback` - Patreon OAuth callback (automatic redirect)
- `GET /auth/verify` - Check current session
- `GET /auth/logout` - Logout user

### Members Content
- `GET /api/members/content` - Get members-only content (requires authentication & patron status)
- `GET /api/members/status` - Get current user status

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for redirects | `http://localhost:3000` |
| `PATREON_CLIENT_ID` | Patreon OAuth client ID | `xxx...` |
| `PATREON_CLIENT_SECRET` | Patreon OAuth secret | `xxx...` (KEEP SECRET!) |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SESSION_SECRET` | Express session secret | Any random string |

## Flow

1. User clicks "Access Members-Only Blog"
2. Frontend redirects to `/auth/patreon`
3. User logs in with Patreon
4. Patreon redirects to `/auth/patreon/callback`
5. Backend verifies membership and creates session
6. Backend redirects to frontend with token
7. Frontend stores token and shows members content

## Deployment

### On Railway or Vercel

1. Push repo to GitHub
2. Connect Railway/Vercel to GitHub
3. Set environment variables in deployment settings
4. Deploy!

**Important:** Never commit `.env` file - use deployment platform's secret management.

## Database Schema

### Users Table
```sql
id | patreon_id | email | first_name | last_name | is_patron | access_token | created_at | updated_at
```

### Blog Posts Table
```sql
id | title | content | excerpt | author_id | is_published | created_at | updated_at
```

## Troubleshooting

**"No authorization code received"**
- Check redirect URI matches in Patreon app settings

**Database connection error**
- Ensure PostgreSQL is running
- Check DATABASE_URL format

**Session not persisting**
- Check cookies are not blocked
- Verify SESSION_SECRET is set

## Next Steps

- Add blog post routes (`POST /api/posts`, `GET /api/posts`)
- Add pagination for blog posts
- Add image upload for posts
- Add admin dashboard
