import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import MovieDetail from "./MovieDetail";
import { Link, useParams } from "react-router-dom";

const Favorite = ({ results, favmovie, fetchUrl, DeleteFav }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        if (!fetchUrl) return;
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
  // tìm phim, chỉ được gọi khi click tìm kiếm
  // const handleSelectedClick = async (movieId) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar,external_ids`
  //     );
  //     setSelectedMovie(response.data);
  //     document.body.style.overflow = "hidden";
  //   } catch (error) {
  //     console.error("Error fetching movie details:", error);
  //   }
  // };
  const handleCloseModal = () => {
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
  };
  return (
    <>
      <h1>FAVORITE:</h1>
      {loading ? (
        <p>Loading movies...</p>
      ) : favmovie.length === 0 ? (
        <p>No movies available</p>
      ) : (
        <div className="movies-grid">
          {favmovie.map((movie) => (
            <Link
              key={movie.id}
              className="movie-item"
              to={`/movie/${movie.id}`}
              // onClick={() => handleSelectedClick(movie.id)}
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
                  DeleteFav(movie);
                }}
              >
                {" "}
                X{" "}
              </button>
            </Link>
          ))}
        </div>
      )}
      {selectedMovie && (
        <div className="movie-popup">
          <div className="movie-popup-overlay" onClick={handleCloseModal} />
          <div className="movie-popup-content">
            <button className="popup-close-btn" onClick={handleCloseModal}>
              ×
            </button>
            <MovieDetail movie={selectedMovie} />
          </div>
        </div>
      )}
    </>
  );
};
export default Favorite;
