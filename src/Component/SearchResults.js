import React, { useState } from "react";
import axios from "axios";

const SearchResults = ({searchTerm,results}) =>{
    const [movies, setSearchmovies] = useState([]);
    const [loading ,setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log('search results fie:',searchTerm);

    return(
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
                  className="movie-list-item"
                  onClick={() => console.log('send film', movie.title)}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="movie-poster"
                  />
                  <h3 className="movie-title">{movie.title}</h3>
                </div>
              ))}
            </div>
          </div>
         )}
      </div>
        </>
    );
};
export default SearchResults;