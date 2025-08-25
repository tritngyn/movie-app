import React from "react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState("");
  const [movies, setMovies] = useState([]);
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

  const currentMovie = movies[currentIndex];
  const bgImage = currentMovie
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
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

  return (
    <>
      <section className="hero" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          {currentMovie && (
            <>
              <h1 className="hero-title">{currentMovie.title}</h1>
              <p className="hero-subtitle">{currentMovie.overview}</p>
            </>
          )}
          <a href="#signup" className="btn-primary">
            Get Started
          </a>
        </div>
      </section>
    </>
  );
};
export default Hero;
