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
    console.error("❌ LỖI API GET MOVIES:", error); // <--- Thêm dòng này
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
// --- HÀM MỚI: Lấy chi tiết 1 phim ---
exports.getMovieById = async (req, res) => {
  try {
    // 1. Lấy ID từ đường dẫn URL
    // Ví dụ: Khách truy cập /api/movies/65c123... -> id sẽ là "65c123..."
    const { id } = req.params;

    // 2. Gọi Mongoose tìm trong Database theo ID
    const movie = await Movie.findById(id);

    // 3. Trường hợp 1: ID đúng định dạng nhưng không có phim nào (VD: phim bị xóa rồi)
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phim này trong hệ thống.",
      });
    }

    // 4. Trường hợp 2: Tìm thấy phim -> Trả về Client
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    // 5. In lỗi ra Terminal để debug (Quan trọng!)
    console.error("❌ LỖI GET DETAIL:", error);

    // Xử lý riêng lỗi ID sai định dạng (VD: gửi id là "abc" thay vì chuỗi hex 24 ký tự)
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "ID phim không hợp lệ." });
    }

    res.status(500).json({ success: false, message: "Lỗi Server nội bộ." });
  }
};
