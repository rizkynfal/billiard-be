const bcrypt = require("bcryptjs");

const hashPassword = async (pass) => {
  const hashedPassword = await bcrypt.hash(pass, 10);
  return hashedPassword;
};
const generateRandomNumber = () => {
  let randomNumber = Math.random()
    .toString(20)
    .substring(2, 2 + 10);

  return randomNumber;
};
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};
module.exports = { hashPassword, generateRandomNumber, generateOTP };
