import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./MovieList.module.scss";
import MovieCard from "./MovieCard";
import FilterBar from "./FilterBar";

export default function MovieList({ categoryName }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch movies từ TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const type = categoryName === "TV" ? "tv" : "movie";
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/discover/${type}?api_key=${process.env.REACT_APP_API_KEY}&language=vi`
        );
        setMovies(response.data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [categoryName]);

  return (
    <section className={styles["movie-section"]}>
      <div className={styles["movie-section-header"]}>
        <h2 className={styles["movie-section-title"]}>{categoryName}</h2>
        <Link
          to={`/category/${categoryName.toLowerCase()}`}
          className={styles["view-all"]}
        >
          Xem tất cả →
        </Link>
      </div>

      {/* FilterBar Component - Khi submit sẽ chuyển sang trang FilterResults */}
      <FilterBar categoryName={categoryName} />

      {loading ? (
        <p className={styles["loading-text"]}>Đang tải phim...</p>
      ) : movies.length === 0 ? (
        <p className={styles["no-movie"]}>Không có phim nào</p>
      ) : (
        <div className={styles["movies-grid"]}>
          {movies.slice(0, 20).map((movie) => (
            <div className={styles["movie-card"]} key={movie.id}>
              <Link
                to={`/${categoryName.toLowerCase()}/${movie.id}`}
                className={styles["movie-link"]}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  title={movie.title || movie.name}
                  rating={movie.vote_average?.toFixed(1)}
                  episode={
                    categoryName === "TV" && movie.number_of_episodes
                      ? `Tập: ${movie.number_of_episodes}`
                      : null
                  }
                  quality="HD"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
