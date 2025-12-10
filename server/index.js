// File: server/index.js (Code mới hoàn chỉnh)
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Phải chạy dotenv.config() đầu tiên để load biến MONGO_URI
require("dotenv").config({ path: "./.env" });
/*
các hàm require(paht) là gì? có giống import không?
tìm hiểu 1 số syntax, logic cơ bản trong file index.js này
Vai trò của index.js trong mô hình "khách hàng - phục vụ - đầu bếp - món ăn" mà bạn từng mô tả là gì?
Hiểu code:
  Tạo hàm app với middleware express, trong express có các hàm có sẵn như ".use()"
  note: giải thích dòng này ( từ syntax đến logic) :app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  Sau đó sử dụng mongoose kết nối database
  */
const app = express();
//check
console.log("----- DEBUG -----");
console.log("PORT đang đọc là:", process.env.PORT);
console.log("MONGO_URI đang đọc là:", process.env.MONGO_URI);
console.log("-----------------");

app.use(express.json()); // Middleware cho phép đọc body dạng JSON
app.use(cors()); // Cho phép React gọi API (Cross-Origin)
// --- CHO PHÉP TRUY CẬP STATIC FILES ---
// Nếu ai đó truy cập http://localhost:5000/uploads/abc.mp4 -> Server trả về file trong thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Kết nối Database ---
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
    process.exit(1); // Thoát ứng dụng nếu lỗi kết nối
  });

// --- Khai báo các Routes ---
const movieRoutes = require("./routes/movieRoutes");
// --- Sử dụng Routes ---
app.use("/api/movies", movieRoutes);

// --- Khởi động Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
