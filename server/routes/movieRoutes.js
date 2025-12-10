// server/routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const multer = require("multer");
const path = require("path");

// --- CẤU HÌNH MULTER (Nơi lưu và Tên file) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Lưu vào thư mục uploads ở server
  },
  filename: (req, file, cb) => {
    // Đặt tên file: timestamp-tenfilegoc (để tránh trùng tên)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- CÁC ROUTES ---

// Route cũ (Lấy danh sách)
router.get("/", movieController.getAllMovies);

// Route MỚI: Upload phim
// 'video' là tên key mà Frontend phải gửi đúng y hệt
router.post("/upload", upload.single("video"), movieController.uploadMovie);

module.exports = router;
