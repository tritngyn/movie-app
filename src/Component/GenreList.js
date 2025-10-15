import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MovieList.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { useParams, Link } from "react-router-dom";
const GenreList = ({ categoryName }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { genre } = useParams();

  const constructFetchUrl = () => {
    if (genre)
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?with_genres=${genre}&api_key=${process.env.REACT_APP_API_KEY}`;
  };

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
    <>
      <div className={styles["movie-list"]}>
        <h2 className={styles["category-name"]}>{categoryName}</h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies available</p>
        ) : (
          <div className={styles["movies-grid"]}>
            {movies.map((movie) => (
              <div className={styles["movie-item"]} key={movie.id}>
                <Link
                  onClick={() => console.log("to page:", movie.id)}
                  to={`/movie/${movie.id}`}
                  className={styles["movie-card"]}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className={styles["movie-poster"]}
                  />
                  <h4 className={styles["movie-title"]}>
                    {movie.title || movie.name}
                  </h4>
                  {/* <button
                    className={styles["movie-badges"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFav(movie);
                    }}
                  >
                    {" "}
                    +{" "}
                  </button> */}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GenreList;
