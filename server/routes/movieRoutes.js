// server/routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// --- CÁC ROUTES ---

// Route cũ (Lấy danh sách)
router.get("/", movieController.getAllMovies);

// Route MỚI: Upload phim
// Không còn dùng multer ở đây vì file được upload trực tiếp từ React -> Supabase
router.post("/upload", movieController.uploadMovie);

// Route lấy chi tiết phim (Đặt dòng này ở cuối cùng, sau route upload)
// :id là tham số động (VD: /api/movies/65a1b2c3d4e5...)
router.get("/:id", movieController.getMovieById);
module.exports = router;
