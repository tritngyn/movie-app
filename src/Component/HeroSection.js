import React from "react";
import { useState, useEffect } from "react";
import "./HeroSection.css";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ClearIcon from "@mui/icons-material/Clear";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import { Link } from "react-router-dom";
import { faL, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
const Hero = ({ categoryName }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={20}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        slidesPerView={1}
        className="hero-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <LazyLoadImage
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              effect="blur" // Có thể dùng "opacity" hoặc "black-and-white"
              wrapperProps={{
                // If you need to, you can tweak the effect transition using the wrapper style.
                style: { transitionDelay: "1s" },
              }}
              style={{
                width: "100%",
                height: "100vh",
                objectFit: "cover",
              }}
            />

            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">{movie.title}</h1>
              {movie && (
                <>
                  {movie.tagline && (
                    <p className="movie-tagline">{movie.tagline}</p>
                  )}
                  <div className="hero-stats">
                    <span className="hero-badge">
                      ★ {movie.vote_average.toFixed(1)}/10
                    </span>
                    {/* <span className="runtime">{movie.runtime} min</span> */}
                    <span className="release-year">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                  <div className="genres">
                    {movie.genres?.map((genre) => (
                      <span key={genre.id} className="genre-tag">
                        {movie.genre_ids}
                      </span>
                    ))}
                  </div>
                  <p className="hero-overview">{movie.overview}</p>
                </>
              )}
              <Link
                className="btn-primary"
                to={`/${categoryName.toLowerCase()}/${movie.id}`}
              >
                <PlayArrowIcon />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Carousel thumbnail */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs, Autoplay]}
        spaceBetween={10}
        slidesPerView={5}
        freeMode
        loop={true}
        watchSlidesProgress={true}
        sl
        ClickedSlide={true} // <-- cho click đổi slide chính
        autoplay={{ delay: 3000, disableOnInteraction: false }} // <-- auto-scroll thumbs
        className="hero-thumbs"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index} className="thumb-slide">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
              alt={movie.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default Hero;
