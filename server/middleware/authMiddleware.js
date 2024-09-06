const jwt = require('jsonwebtoken');
const JWT_SECRET = 'neerajverma';  // Use environment variable for security

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expect Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
