// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated. Please log in with Patreon.' });
  }
  next();
};

module.exports = authMiddleware;
