// Export core components for consumers to use
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
export { protect, authorize } from "./src/middleware/authMiddleware.js";
export { generateToken, verifyToken } from "./src/utils/jwt.js";
export { authRoutes };
export { profileRoutes };
export { userRoutes };
export { connectDB } from "./src/config/db.js";
