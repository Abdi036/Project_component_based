// Export core components for consumers to use
import authRoutes from "./src/routes/authRoutes.js";
export { protect, authorize } from "./src/middleware/authMiddleware.js";
export { generateToken, verifyToken } from "./src/utils/jwt.js";
export { authRoutes };
export { connectDB } from './src/config/db.js';
