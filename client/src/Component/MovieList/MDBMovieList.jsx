import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./MovieList.module.scss";
import MovieCard from "./MovieCard";
import UploadMovie from "../Upload/UploadMovie";

export default function MDBMovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //fetch tu MongoDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Gọi API với phân trang (lấy trang 1, 10 phim/trang)
        const response = await axios.get(
          "http://localhost:5000/api/movies?limit=20"
        );

        // Dữ liệu phim nằm trong response.data.data (theo cấu trúc controller)
        setMovies(response.data.data);
        setLoading(false);
      } catch (err) {
        // In lỗi ra console để debug
        console.error("Fetch Error:", err);
        setError("Không thể tải dữ liệu phim từ Server.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []); // [] đảm bảo chỉ chạy 1 lần khi component mount

  if (loading) return <h2>Đang tải phim từ MongoDB Atlas...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Lỗi: {error}</h2>;

  return (
    <>
      <section className="upload_movie">
        <UploadMovie />
      </section>
      <section className={styles["movie-section"]}>
        <div className={styles["movie-section-header"]}></div>
        {loading ? (
          <p className={styles["loading-text"]}>Đang tải phim...</p>
        ) : movies.length === 0 ? (
          <p className={styles["no-movie"]}>Không có phim nào</p>
        ) : (
          <div className={styles["movies-grid"]}>
            {movies.slice(0, 20).map((movie) => (
              <div className={styles["movie-card"]} key={movie._id}>
                <Link
                  to={`/user_film/${movie._id}`}
                  className={styles["movie-link"]}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MovieCard
                    image={
                      "https://image.tmdb.org/t/p/w500/bjUWGw0Ao0qVWxagN3VCwBJHVo6.jpg" ||
                      `${movie.poster}`
                    }
                    title={movie.title}
                    rating={movie.imdb_rating?.toFixed(1)}
                    quality="HD"
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
