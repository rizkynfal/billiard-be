const { ErrorHandler } = require("../handler/error");
const { apiConstants, util } = require("../utils");
const jwt = require("jsonwebtoken");
require("express-session");

exports.authenticateToken = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new ErrorHandler.ForbiddenError();
    } else {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token == null) throw new ErrorHandler.UnauthorizedError();

      jwt.verify(token, apiConstants.TOKEN_SECRET.ACCESS_TOKEN, (err, user) => {
        console.log(user.user.role)
        if (err) {
          throw new ErrorHandler.UnauthorizedError(err);
        } else if (
         !( user.user.role === 1 ||
          user.user.role === 2 ||
          user.user.role === 3)
        ) {
          throw new ErrorHandler.ForbiddenError("Access Denied");
        } else {
          next();
        }
      });
    }
  } catch (error) {
    util.handleError(req, res, error);
  }
};

exports.authenticateTokenAdmin = (req, res, next) => {
  if (!req.headers["authorization"]) {
    util.handleError(req, res, new ErrorHandler.ForbiddenError());
  } else {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      util.handleError(req, res, new ErrorHandler.UnauthorizedError());
    }

    jwt.verify(token, apiConstants.TOKEN_SECRET.ACCESS_TOKEN, (err, user) => {
      if (err) {
        util.handleError(req, res, new ErrorHandler.UnauthorizedError(err));
      } else if (user.user.role === 1 || user.user.role === 2) {
        util.handleError(
          req,
          res,
          new ErrorHandler.ForbiddenError("Access denied, Admins only")
        );
      } else {
        next();
      }
    });
  }
};
exports.authenticateTokenCustomer = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new ErrorHandler.UnauthorizedError();
    } else {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token == null) {
        throw new ErrorHandler.UnauthorizedError();
      }

      jwt.verify(token, apiConstants.TOKEN_SECRET.ACCESS_TOKEN, (err, user) => {
        if (err) {
          throw new ErrorHandler.UnauthorizedError(err);
        } else if (user.user.role === 1 || user.user.role === 3) {
          throw new ErrorHandler.ForbiddenError("Access denied");
        }
        next();
      });
    }
  } catch (error) {
    util.handleError(req, res, error);
  }
};
