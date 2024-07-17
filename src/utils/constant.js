require("dotenv").config();
const apiConstants = {
  GMAIL_OTP :{
    GMAIL : process.env.GMAIL_SENDER,
    PASS: process.env.GMAIL_APP_PASS
  },
  MIDTRANS_KEY: {
    MERCHANT_ID: process.env.MIDTRANS_MERCHANT_ID,
    SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
    CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
    API_URL: process.env.MIDTRANS_SANDBOX_API,
    SERVER_KEY_ENCODED: process.env.MIDTRANS_SERVER_KEY_ENCODED,
  },
  TOKEN_SECRET: {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
  METHOD_TYPE: {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
  },
  HEADER_TYPE: {
    URL_ENCODED: "application/x-www-form-urlencoded",
    APPLICATION_JSON: "application/json",
  },
  HEADER_KEYS: {
    DEVICE_TYPE: "device-type",
    DEVICE_ID: "device-id",
    SESSION_TOKEN: "session-token",
    PUSH_TOKEN: "push-token",
  },
  DEVICE_TYPE: {
    ANDROID: "android",
    IOS: "ios",
    WEB: "web",
  },
  CONTENT_TYPE: {
    URL_ENCODE: "application/x-www-form-urlencoded",
  },

  RESPONSE_STATUS: {
    SUCCESS: true,
    FAILURE: false,
  },
  RESPONSE_CODES: {
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    OK: 200,
    CREATED: 201,
    NO_CONTENT_FOUND: 204,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    GONE: 410,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUEST: 429,
  },
  SUCCESS_MESSAGE: {
    FETCH_SUCCESS: "Information fetched successfully",
  },
  FAILED_MESSAGE: {
    INVALID_PARAMS: "Invalid Parameters",
    INVALID_REQUEST: "Invalid Request",
    INVALID_SESSION_TOKEN: "Invalid session token",
    INTERNAL_SERVER_ERROR: "Internal server Error",
    BAD_REQUEST: "Bad Request!",
    DEVICE_ID_OR_SESSION_TOKEN_EMPTY:
      "Device id or session token can't be empty or null",
    SESSION_GENERATION: "Unable to generate session!",
    SESSION_EXPIRED: "Session Expired!",
  },
};
const DB_ENVIRONMENT = {
  DB_USER: process.env.POSTGRE_USER,
  DB_HOST: process.env.POSTGRE_HOST,
  DB_PASS: process.env.POSTGRE_PASSWORD,
  DB_DATABASE: process.env.POSTGRE_DATABASE,
  DB_PORT: process.env.POSTGRE_PORT,
};
module.exports = {
  apiConstants,
  DB_ENVIRONMENT,
};
