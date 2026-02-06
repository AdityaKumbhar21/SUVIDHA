const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
  ForbiddenError,
} = require('../utils/customError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization token missing'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return next(new UnauthorizedError('Malformed authorization header'));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate payload
    if (!decoded.id || !decoded.role) {
      return next(new UnauthorizedError('Invalid token payload'));
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      mobile: decoded.mobile, // optional but useful
    };

    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
