// Triggering a redeploy to fetch updated environment variables
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const db = require('./db/db');

const app = express();
app.set('trust proxy', 1); // Trust the first proxy
const PORT = process.env.PORT || 3002;

const corsOptions = {
  origin: 'https://portfolio-and-blog-tau.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/auth', authRoutes);
app.use('/api/members', membersRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend server running', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error('Express error:', err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PORTS] PORT env var: ${process.env.PORT}`);
  console.log(`[PORTS] Listening on: ${PORT}`);
  console.log(`[${new Date().toISOString()}] Server listening on port ${PORT}`);
  
  // Check database connection but don't crash if it fails
  if (process.env.DATABASE_URL) {
    db.pool.query('SELECT NOW()').then(() => {
      console.log('[OK] Database connected');
    }).catch(err => {
      console.error('[DB_ERROR] Connection check failed:', err.message);
    });
  } else {
    console.warn('[DB_WARN] DATABASE_URL not set - database features will fail');
  }
});

// Add keepalive configuration
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // Must be greater than keepAliveTimeout

server.on('error', (err) => {
  console.error('[SERVER_ERROR]', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
