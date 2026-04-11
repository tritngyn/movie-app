// File: server/index.js
// ═══════════════════════════════════════════════════════════════
//  Movie App Backend - Production-Ready Server
// ═══════════════════════════════════════════════════════════════


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load biến môi trường (.env) đầu tiên
require("dotenv").config({ path: "./.env" });

// Import Middlewares
const { errorHandler, notFound } = require("./middlewares/errorHandler");

// ─── Khởi tạo Express App ──────────────────────────────────────
const app = express();

// ─── Security Middlewares ───────────────────────────────────────
// Helmet: Bảo vệ HTTP headers (chống XSS, clickjacking, v.v.)
app.use(helmet());

// Rate Limiter: Giới hạn 100 request / 15 phút / IP (chống DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Quá nhiều request. Vui lòng thử lại sau 15 phút.",
  },
});
app.use("/api", limiter);

// ─── Standard Middlewares ───────────────────────────────────────
// Cho phép đọc body dạng JSON (giới hạn 10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS: Cho phép React gọi API (Cross-Origin)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Morgan: Log mọi request HTTP ra terminal
// Dùng 'dev' cho development (có màu), 'combined' cho production
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Kết nối Database ───────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    tls: true,
    tlsInsecure: false,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() =>
    console.log("✅ MongoDB Atlas connected successfully using Mongoose!")
  )
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ─── Health Check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ─────────────────────────────────────────────────
const movieRoutes = require("./routes/movieRoutes");
app.use("/api/movies", movieRoutes);

// ─── Error Handling (PHẢI đặt sau tất cả routes) ───────────────
app.use(notFound); // Bắt route không tồn tại -> 404
app.use(errorHandler); // Bắt mọi lỗi từ controller/route

// ─── Khởi động Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown - Tắt server sạch sẽ
const gracefulShutdown = (signal) => {
  console.log(`🔄 ${signal} received. Shutting down gracefully...`);
  mongoose.connection.close(false).then(() => {
    console.log("📦 MongoDB connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
