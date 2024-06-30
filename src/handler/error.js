const { apiConstants, Utils } = require("../utils/index");

class ErrorHandler extends Error {
  constructor(msg, statusCode) {
    super(msg,statusCode);
    this.statusCode = statusCode;
  }
}

class UnauthorizedError extends ErrorHandler {
  constructor(msg = "Unauthorized") {
    super(msg, apiConstants.RESPONSE_CODES.UNAUTHORIZED);
  }
}
class BadRequestError extends ErrorHandler {
  constructor(msg = "Bad Request",) {
    super(msg, apiConstants.RESPONSE_CODES.BAD_REQUEST);
  }
}
class NotFoundError extends ErrorHandler {
  constructor(msg = "Not Found") {
    super(msg, apiConstants.RESPONSE_CODES.NOT_FOUND);
  }
}
class ForbiddenError extends ErrorHandler {
  constructor(msg = "Forbidden") {
    super(msg, apiConstants.RESPONSE_CODES.FORBIDDEN);
  }
}
class ServerError extends ErrorHandler {
  constructor(msg = "Server Error") {
    super(msg, apiConstants.RESPONSE_CODES.SERVER_ERROR);
  }
}
class TooManyRequestError extends ErrorHandler {
  constructor(msg = "Too Many Request") {
    super(msg, apiConstants.RESPONSE_CODES.TOO_MANY_REQUEST);
  }
}

module.exports = {
  ErrorHandler: {
    ErrorHandler,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    TooManyRequestError,
    BadRequestError,
  },
};
