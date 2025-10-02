import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "Swiper.css"
// import required modules
import { Pagination } from "swiper/modules";

const Swiper = () => {
    const [movies, setMovies] = useState([]);

useEffect(() => {
  fetch("https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY")
    .then(res => res.json())
    .then(data => setMovies(data.results));
}, []);

  return (
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000 }}
    loop={true}
    spaceBetween={20}
    slidesPerView={1}
  >
    {movies.map(movie => (
      <SwiperSlide key={movie.id}>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
        />
      </SwiperSlide>
    ))}
  </Swiper>
);
export default Swiper;


