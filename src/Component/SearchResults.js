import React, { useState } from "react";
import axios from "axios";
import MovieDetail from "./MovieDetail";
import './MovieDetail.css';

const SearchResults = ({searchTerm,results}) =>{
    const [movies, setSearchmovies] = useState([]);
    const [loading ,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    
   const handleSelectedClick = async (movieId) =>{
    try{
        const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar,external_ids`
      );
      setSelectedMovie(response.data);
       document.body.style.overflow = 'hidden';
    }catch(error) {
      console.error("Error fetching movie details:", error);
    } 

  }  ;
    console.log('search results find:',searchTerm);

     const handleCloseModal = () =>{
      setSelectedMovie(null);
        document.body.style.overflow = 'unset';
    };
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
                  onClick={() => handleSelectedClick(movie.id)}
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

      {selectedMovie && (
          <div className='movie-popup'>
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