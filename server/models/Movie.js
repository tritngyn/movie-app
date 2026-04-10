// File: server/models/Movie.js
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề phim là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Mô tả không được vượt quá 2000 ký tự"],
    },
    plot: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "URL video là bắt buộc"],
    },
    thumbnailUrl: String,
    genre: {
      type: String,
      trim: true,
    },
    releaseYear: {
      type: Number,
      min: [1888, "Năm phát hành không hợp lệ"],
    },
    createdBy: {
      type: String, // Supabase user UUID
      default: null,
    },
  },
  {
    collection: "movies",
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Đánh index để tối ưu tìm kiếm theo tiêu đề
MovieSchema.index({ title: "text" });
// Index cho phân trang hiệu quả
MovieSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Movie", MovieSchema);
