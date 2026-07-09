const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if user is admin (you would need to fetch user role from database)
    // For now, this is a basic implementation
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
