// File: server/middlewares/authMiddleware.js
// Xác thực Supabase JWT Token bằng JWKS (ECC P-256 keys)
const { createRemoteJWKSet, jwtVerify } = require("jose");

// ⚠️ Thay bằng URL project Supabase của bạn trong .env
// Ví dụ: SUPABASE_URL=https://abcdef.supabase.co
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;

// JWKS Endpoint: Supabase public keys để xác thực JWT
// Lazy init: chỉ tạo JWKS khi SUPABASE_URL có giá trị, tránh crash khi server start
let _jwks = null;
const getJWKS = () => {
  if (!_jwks && SUPABASE_URL) {
    _jwks = createRemoteJWKSet(
      new URL(`${SUPABASE_URL}/.well-known/jwks.json`)
    );
  }
  return _jwks;
};

/**
 * Middleware: Kiểm tra người dùng đã đăng nhập chưa
 * Client gửi Header: Authorization: Bearer <access_token>
 * Server giải mã token bằng Supabase public key (JWKS) và gắn thông tin user vào req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!SUPABASE_URL) {
      console.error("❌ SUPABASE_URL chưa được cấu hình trong .env");
      return res.status(500).json({
        success: false,
        message: "Lỗi cấu hình server: thiếu SUPABASE_URL.",
      });
    }

    const JWKS = getJWKS();

    // Giải mã và xác thực token bằng public key từ JWKS
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${SUPABASE_URL}/auth/v1`, // Kiểm tra issuer
    });

    // Gắn thông tin user vào request để controller sử dụng
    req.user = {
      id: payload.sub,       // Supabase user UUID
      email: payload.email,
      role: payload.role || "authenticated",
    };

    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.code || error.message);

    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn. Vui lòng đăng nhập lại.",
      });
    }
    if (
      error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED" ||
      error.code === "ERR_JWT_INVALID"
    ) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    return res.status(401).json({
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
