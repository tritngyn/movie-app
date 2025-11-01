import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MovieList.module.scss";
import MovieCard from "./MovieCard";

export default function MovieList({ categoryName }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const constructFetchUrl = () => {
    if (categoryName === "TV")
      return `${process.env.REACT_APP_BASE_URL}/discover/tv?api_key=${process.env.REACT_APP_API_KEY}`;
    if (categoryName === "Movie")
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(constructFetchUrl());
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
    <section className="movie-section">
      <div className="movie-section-header">
        <h2 className="movie-section-title">{categoryName}</h2>
        <Link
          to={`/category/${categoryName.toLowerCase()}`}
          className="view-all"
        >
          Xem toàn bộ →
        </Link>
      </div>

      {loading ? (
        <p className="loading-text">Đang tải phim...</p>
      ) : movies.length === 0 ? (
        <p className="no-movie">Không có phim nào</p>
      ) : (
        <div className="movies-grid">
          {movies.slice(0, 12).map((movie, index) => (
            <div className="movie-card" key={movie.id}>
              <Link
                to={`/${categoryName.toLowerCase()}/${movie.id}`}
                className="movie-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  title={movie.title || movie.name}
                  rating={movie.vote_average?.toFixed(1)}
                  episode={
                    categoryName === "TV" && movie.episode_count
                      ? `Tập: ${movie.episode_count}`
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
