// server/seed.js
const mongoose = require("mongoose");
require("dotenv").config();
const Movie = require("./models/Movie"); // Đảm bảo đúng đường dẫn

// Kết nối DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected for seeding...");
    seedData();
  })
  .catch((err) => console.log(err));

const seedData = async () => {
  const movies = [];
  // Tạo 20.000 bộ phim giả
  for (let i = 0; i < 20000; i++) {
    movies.push({
      title: `Movie Spam Test #${i}`,
      plot: "Đây là dữ liệu rác để test hiệu năng trang web. " + i,
      videoUrl: "/videos/sample.mp4",
      poster: "https://via.placeholder.com/150", // Ảnh giả nhẹ
      year: 2024,
      genres: ["Test", "Spam"],
      imdb: { rating: 5.0, votes: 0 },
    });
  }

  try {
    // Xóa hết phim cũ (nếu muốn)
    // await Movie.deleteMany({});

    // Insert 1 cục 20.000 phim
    await Movie.insertMany(movies);
    console.log("✅ Đã bơm xong 20.000 phim!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};
