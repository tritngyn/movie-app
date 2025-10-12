import React, { useState } from "react";
import axios from "axios";
import MovieDetail from "./MovieDetail";
import "./SearchResults.css";
const SearchResults = ({ searchTerm, results, handleAddFav }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const handleSelectedClick = async (movieId) => {
    try {
      if (!movieId) return;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar,external_ids`
      );
      setSelectedMovie(response.data);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  console.log("selected movie:", searchTerm);

  const handleCloseModal = () => {
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
  };
  return (
    <>
      <div className="container">
        {searchTerm && results.length > 0 && (
          <div className="movies-list">
            <h2 className="category-title">
              Search Results for "{searchTerm}"
            </h2>
            <div className="movies-grid">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => handleSelectedClick(movie.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <button
                    className="movie-badges"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFav(movie);
                    }}
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
export default SearchResults;
