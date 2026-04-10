// File: server/controllers/movieController.js
const Movie = require("../models/Movie");
const { AppError } = require("../middlewares/errorHandler");

/**
 * GET /api/movies
 * Lấy danh sách phim với phân trang và tìm kiếm
 */
exports.getAllMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // Hỗ trợ tìm kiếm theo title (text search)
    const filter = {};
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [movies, totalMovies] = await Promise.all([
      Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMovies / limit),
        totalCount: totalMovies,
        limit,
      },
    });
  } catch (error) {
    next(error); // Chuyển lỗi cho Global Error Handler
  }
};

/**
 * GET /api/movies/:id
 * Lấy chi tiết 1 phim theo ID
 */
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      throw new AppError("Không tìm thấy phim này trong hệ thống.", 404);
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/movies/upload
 * Tạo phim mới (Cần đăng nhập)
 */
exports.uploadMovie = async (req, res, next) => {
  try {
    const newMovie = new Movie({
      title: req.body.title,
      description: req.body.description,
      plot: req.body.plot,
      videoUrl: req.body.videoUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      genre: req.body.genre,
      releaseYear: req.body.releaseYear,
      createdBy: req.user?.id, // Gắn user ID từ auth middleware
    });

    await newMovie.save();

    res.status(201).json({
      success: true,
      message: "Lưu thông tin phim thành công!",
      data: newMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/movies/:id
 * Cập nhật thông tin phim (Cần đăng nhập)
 */
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      throw new AppError("Không tìm thấy phim để cập nhật.", 404);
    }

    // Chỉ cập nhật các field được gửi lên
    const allowedFields = [
      "title",
      "description",
      "plot",
      "videoUrl",
      "thumbnailUrl",
      "genre",
      "releaseYear",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        movie[field] = req.body[field];
      }
    });

    const updatedMovie = await movie.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật phim thành công!",
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/movies/:id
 * Xóa phim (Cần đăng nhập)
 */
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      throw new AppError("Không tìm thấy phim để xóa.", 404);
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa phim thành công!",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/movies/health
 * Health check endpoint
 */
exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movie API is running",
    timestamp: new Date().toISOString(),
  });
};
