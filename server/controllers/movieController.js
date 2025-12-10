// File: server/controllers/movieController.js
const Movie = require("../models/Movie");

// Chức năng lấy tất cả phim với Phân trang
exports.getAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Mặc định trang 1
  const limit = parseInt(req.query.limit) || 10; // Mặc định 10 phim/trang
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find().skip(skip).limit(limit);

    // Lấy tổng số lượng phim (để tính số trang)
    const totalMovies = await Movie.countDocuments();

    res.status(200).json({
      success: true,
      data: movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      totalCount: totalMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadMovie = async (req, res) => {
  try {
    // 1. Kiểm tra xem có file gửi lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng chọn file video!" });
    }

    // 2. Tạo đường dẫn URL (Server sẽ phục vụ file này)
    // Ví dụ: http://localhost:5000/uploads/171500-spiderman.mp4
    const videoUrl = `/uploads/${req.file.filename}`;

    // 3. Tạo data phim mới
    const newMovie = new Movie({
      title: req.body.title || "Phim chưa đặt tên",
      plot: req.body.plot,
      videoUrl: videoUrl, // Quan trọng: Lưu đường dẫn vào DB
      // Các trường khác tùy ý...
    });

    await newMovie.save();

    res.status(201).json({
      success: true,
      message: "Upload thành công!",
      data: newMovie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
