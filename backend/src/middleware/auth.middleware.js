import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    //Get token from cookie
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    //Attach user to request
    req.user = decoded; 
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default protect;