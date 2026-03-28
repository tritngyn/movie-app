// File: server/models/Movie.js
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    // Lưu đường dẫn URL/Path đến video (để streaming)
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String, // Ảnh bìa
    genre: String,
    releaseYear: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "movies" }
);

// Đánh index để tối ưu tìm kiếm theo tiêu đề
MovieSchema.index({ title: "text" });

module.exports = mongoose.model("Movie", MovieSchema);
