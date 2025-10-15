import React, { useState } from "react";
import "./SearchResults.css";
import { Link } from "react-router-dom";

const SearchResults = ({ searchTerm, results }) => {
  const [loading, setLoading] = useState(false);
  console.log("selected movie:", searchTerm);
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
                <>
                  <Link
                    key={movie.id}
                    className="movie-card"
                    to={`/movie/${movie.id}`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <span className="movie-title" style={{}}>
                      {" "}
                      {movie.title || movie.name}
                    </span>
                  </Link>
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default SearchResults;
