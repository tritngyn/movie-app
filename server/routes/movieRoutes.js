// File: server/routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  validate,
  createMovieSchema,
  updateMovieSchema,
  paginationSchema,
} = require("../middlewares/validate");

// --- PUBLIC ROUTES (Không cần đăng nhập) ---

// Health check
router.get("/health", movieController.healthCheck);

// Lấy danh sách phim (có phân trang + tìm kiếm)
router.get("/", validate(paginationSchema, "query"), movieController.getAllMovies);

// Lấy chi tiết 1 phim
router.get("/:id", movieController.getMovieById);

// --- PROTECTED ROUTES (Cần đăng nhập) ---

// Upload/Tạo phim mới
router.post(
  "/upload",
  authMiddleware,
  validate(createMovieSchema),
  movieController.uploadMovie
);

// Cập nhật phim
router.put(
  "/:id",
  authMiddleware,
  validate(updateMovieSchema),
  movieController.updateMovie
);

// Xóa phim
router.delete("/:id", authMiddleware, movieController.deleteMovie);

module.exports = router;
