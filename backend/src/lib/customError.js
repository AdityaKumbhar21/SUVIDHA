class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(400, message);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

module.exports = { CustomError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError };