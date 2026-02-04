const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/customError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new ForbiddenError());
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };