import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const generateVerifyToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_VERIFY_SECRET, {
    expiresIn: "15m", // short expiry
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_VERIFY_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired verification token");
  }
};