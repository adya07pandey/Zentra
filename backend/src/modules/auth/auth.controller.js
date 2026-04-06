import * as service from "./auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 24 * 7
};
export const signupInit = async (req, res, next) => {
  try {
    await service.signupInit(req.body);

    res.status(200).json({
      status: "OTP sent"
    });

  } catch (err) {
    next(err);
  }
};

export const signupVerify = async (req, res, next) => {
  try {
    
    const token = await service.signupVerify(req.body);

    res
      .cookie("jwt", token, cookieOptions)
      .status(200)
      .json({
        status: "Registered successfully"
      });

  } catch (err) {
    next(err);
  }
};
// auth.controller.js
export const login = async (req, res, next) => {
  try {
    const token = await service.login(req.body);
    
    res
      .cookie("jwt", token, cookieOptions)
      .status(200)
      .json({
        status: "Logged in successfully"
      });

  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  res.status(200).json({
    status: "Logged out successfully"
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await service.getMe(req.user.userId);

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (err) {
    next(err);
  }
};