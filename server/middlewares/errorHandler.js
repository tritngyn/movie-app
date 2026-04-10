// File: server/middlewares/errorHandler.js
// Global Error Handler - Xử lý lỗi tập trung cho toàn bộ ứng dụng

/**
 * Custom Error Class - Dùng để throw lỗi có status code
 * Ví dụ: throw new AppError("Không tìm thấy phim", 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Phân biệt lỗi do logic vs lỗi hệ thống
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware: Bắt mọi lỗi từ controller/route và trả response thống nhất
 * Đặt ở cuối cùng trong index.js, sau tất cả routes
 */
const errorHandler = (err, req, res, _next) => {
  // Log lỗi ra terminal để debug
  console.error(`❌ [${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Xử lý các loại lỗi phổ biến của Mongoose
  let statusCode = err.statusCode || 500;
  let message = err.message || "Lỗi Server nội bộ";

  // Lỗi Mongoose: ID không hợp lệ
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "ID không hợp lệ.";
  }

  // Lỗi Mongoose: Validation (VD: thiếu field required)
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = `Dữ liệu không hợp lệ: ${messages.join(", ")}`;
  }

  // Lỗi Mongoose: Duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Dữ liệu trùng lặp: ${field} đã tồn tại.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Middleware: Bắt route không tồn tại (404)
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

module.exports = { AppError, errorHandler, notFound };
