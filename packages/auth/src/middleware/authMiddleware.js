import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Temporary check to help debug Postman environment variable issues
      if (token === "{{token}}") {
        return res
          .status(401)
          .json({
            message:
              "Postman variable {{token}} was not resolved. Make sure to run 'Login User' first, or use a Postman environment!",
          });
      }

      const decoded = verifyToken(token);
      req.user = decoded; // add user basic info from token
      return next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res
        .status(401)
        .json({
          message: "Not authorized, token failed",
          error: error.message,
        });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `User role ${req.user?.role} is not authorized` });
    }
    next();
  };
};
