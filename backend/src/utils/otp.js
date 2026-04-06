import bcrypt from "bcrypt";

export const generateOTPWithHash = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpHash = await bcrypt.hash(otp, 10);

  return {
    otp,       // send to user (email)
    otpHash    // store in DB
  };
};