import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MovieList.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
const MovieList = ({ categoryName, handleAddFav }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const constructFetchUrl = () => {
    if (categoryName === "TV")
      return `${process.env.REACT_APP_BASE_URL}/discover/tv?api_key=${process.env.REACT_APP_API_KEY}`;
    if (categoryName === "Movie")
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}`;
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
  return (
    <div className={styles["movie-list"]}>
      <h2 className={styles["category-name"]}>{categoryName}</h2>

      {loading ? (
        <p className={styles["loading-text"]}>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className={styles["no-movie"]}>No movies available</p>
      ) : (
        <div className={styles["movies-grid"]}>
          {movies.map((movie) => (
            <div className={styles["movie-item"]} key={movie.id}>
              <Link
                to={`/${categoryName.toLowerCase()}/${movie.id}`}
                className={styles["movie-card"]}
                onClick={() => console.log("to page:", movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className={styles["movie-poster"]}
                />
                <h4 className={styles["movie-title"]}>
                  {movie.title || movie.name}
                </h4>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
