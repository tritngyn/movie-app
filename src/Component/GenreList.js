import { useState, useEffect } from "react";
import axios from "axios";
import "./MovieList.css";
import MovieDetail from "./MovieDetail";
import "swiper/css";
import "swiper/css/navigation";
import { useParams, Link } from "react-router-dom";
const GenreList = ({ categoryName, handleAddFav }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { genre } = useParams();

  const constructFetchUrl = () => {
    if (genre)
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?with_genres=${genre}&api_key=${process.env.REACT_APP_API_KEY}`;
  };

  // lấy địa chỉ URL từ hàm bên trên
  const fetchUrl = constructFetchUrl();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchUrl]);

  const handleCloseModal = () => {
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <div className="movie-list">
        <h2 className="category-name">{categoryName}</h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies available</p>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <Link
                onClick={() => console.log("to page:", movie.id)}
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movie-card"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="movie-poster"
                />
                <h4 className="movie-title">{movie.title || movie.name}</h4>
                <button
                  className="movie-badges"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click lan lên div cha
                    handleAddFav(movie);
                  }}
                >
                  {" "}
                  +{" "}
                </button>
              </Link>
            ))}
          </div>
        )}
        {selectedMovie && (
          <div className="movie-popup">
            <div className="movie-popup-overlay" onClick={handleCloseModal} />
            <div className="movie-popup-content">
              <MovieDetail />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenreList;
