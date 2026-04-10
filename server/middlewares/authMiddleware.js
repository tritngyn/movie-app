// File: server/middlewares/authMiddleware.js
// Xác thực Supabase JWT Token từ Header Authorization
const jwt = require("jsonwebtoken");

// ⚠️ Supabase JWT Secret - lấy từ Dashboard > Settings > API > JWT Secret
// Cần thêm biến SUPABASE_JWT_SECRET vào file .env
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

/**
 * Middleware: Kiểm tra người dùng đã đăng nhập chưa
 * Client gửi Header: Authorization: Bearer <access_token>
 * Server giải mã token và gắn thông tin user vào req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
      console.error("❌ SUPABASE_JWT_SECRET chưa được cấu hình trong .env");
      return res.status(500).json({
        success: false,
        message: "Lỗi cấu hình server: thiếu JWT secret.",
      });
    }

    // Giải mã và xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gắn thông tin user vào request để controller sử dụng
    req.user = {
      id: decoded.sub, // Supabase dùng 'sub' cho user id
      email: decoded.email,
      role: decoded.role || "authenticated",
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn. Vui lòng đăng nhập lại.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực: " + error.message,
    });
  }
};

/**
 * Middleware: Kiểm tra quyền Admin (tùy chọn)
 * Sử dụng sau authMiddleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "service_role") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Bạn không có quyền thực hiện hành động này.",
  });
};

module.exports = { authMiddleware, adminOnly };
