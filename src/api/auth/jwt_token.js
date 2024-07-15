const jwt = require("jsonwebtoken");
const { apiConstants } = require("../../utils/index");
class TokenGenerator {
  constructor(user) {
    this.user = user;
  }
  async generateAccessToken() {
    return jwt.sign(this.user, apiConstants.TOKEN_SECRET.ACCESS_TOKEN, {
      expiresIn: "1h",
      header: { kid: "sim1" },
    });
  }
  async generateRefreshToken() {
    return jwt.sign(this.user, apiConstants.TOKEN_SECRET.REFRESH_TOKEN, {
      expiresIn: "3h",
    });
  }
  async getAuthToken() {
    const accessToken = await this.generateAccessToken();
    const refreshToken = await this.generateRefreshToken();

    const accessTokenExpDate = new Date();
    accessTokenExpDate.setHours(
      accessTokenExpDate.getHours() + 1,
      accessTokenExpDate.getMinutes(),
      accessTokenExpDate.getSeconds()
    );
    const refreshTokenExpDate = new Date();
    refreshTokenExpDate.setHours(
      refreshTokenExpDate.getHours() + 3,
      refreshTokenExpDate.getMinutes(),
      refreshTokenExpDate.getSeconds()
    );

    const response = {
      tokenType: "Bearer",
      accessToken: accessToken,
      accessTokenExpDate: accessTokenExpDate.toString(),
      refreshToken: refreshToken,
      refreshTokenExpDate: refreshTokenExpDate.toString(),
    };

    return response;
  }
}
module.exports = TokenGenerator;
