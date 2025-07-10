import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Favorite = ({results, favmovie, handleSelectedClick, fetchUrl}) =>{
  const [loading ,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
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
        <h1>
            FAVORITE:
        </h1>
            {loading ? (
             <p>Loading movies...</p>
            ) : favmovie.length === 0 ? (
            <p>No movies available</p>
            ) : (
            <div className="movies-grid">
                {favmovie.map((movie) => (
                <div
                    key={movie.id}
                    className="movie-item"
                    onClick={() => handleSelectedClick(movie.id)}
                >
                    <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="movie-poster"
                    />
                    <h4 className="movie-title">{movie.title || movie.name}</h4>
                </div>
                ))}
            </div>
            )}
     </>
    );
}
export default Favorite ;
