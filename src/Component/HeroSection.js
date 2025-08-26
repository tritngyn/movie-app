import React from "react";
import { useState, useEffect } from "react";
import MovieDetail from "./MovieDetail";
import axios from "axios";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ClearIcon from "@mui/icons-material/Clear";
const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    // Gọi API popular movies
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovies(data.results);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Auto slide
  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 5000); // đổi ảnh mỗi 5 giây

      return () => clearInterval(interval);
    }
  }, [movies]);

  const movie = movies[currentIndex];
  const bgImage = movie
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const heroStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // full màn hình
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    transition: "background-image 1s ease-in-out", // hiệu ứng mượt
  };
  // tìm phim, chỉ được gọi khi click tìm kiếm
  const handleSelectedClick = async (movieId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar,external_ids`
      );
      setSelectedMovie(response.data);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
  };
  return (
    <>
      <section className="hero" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          {movie && (
            <>
              <div className="hero-content">
                <h1>{movie.title}</h1>
                {movie.tagline && (
                  <p className="movie-tagline">"{movie.tagline}"</p>
                )}
                <div className="hero-stats">
                  <span className="rating">★ {movie.vote_average}/10</span>
                  <span className="runtime">{movie.runtime} min</span>
                  <span className="release-year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                <div className="genres">
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>{movie.overview}</div>
            </>
          )}
          <a
            className="btn-primary"
            onClick={() => {
              handleSelectedClick(movie.id);
              console.log("pop up:", movie.title);
            }}
          >
            <PlayCircleIcon />
          </a>
        </div>
      </section>
      {selectedMovie && (
        <div className="movie-popup">
          <div className="movie-popup-overlay" onClick={handleCloseModal} />
          <div className="movie-popup-content">
            <button className="popup-close-btn" onClick={handleCloseModal}>
              <ClearIcon />
            </button>
            <MovieDetail movie={selectedMovie} />
          </div>
        </div>
      )}
    </>
  );
};
export default Hero;
