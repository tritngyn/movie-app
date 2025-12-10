import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import "./GenreList.scss";
import FilterBar from "../FilterBar";

export default function GenreList({ categoryName }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { genre } = useParams();

  const constructFetchUrl = () => {
    if (genre)
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?with_genres=${genre}&api_key=${process.env.REACT_APP_API_KEY}`;
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
  }, [genre]);

  return (
    <section className="genre-section">
      <div className="genre-header">
        <h2 className="genre-title">{categoryName}</h2>
      </div>
      {/* FilterBar Component - Khi submit sẽ chuyển sang trang FilterResults */}
      <FilterBar categoryName={categoryName} />

      {loading ? (
        <p className="loading-text">Đang tải phim...</p>
      ) : movies.length === 0 ? (
        <p className="no-movie">Không có phim nào</p>
      ) : (
        <div className="genre-grid">
          {movies.slice(0, 20).map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="genre-card"
            >
              <MovieCard
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                title={movie.title || movie.name}
                rating={movie.vote_average?.toFixed(1)}
                episode={null}
                quality="HD"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
