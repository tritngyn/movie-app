import { useState, useEffect, use } from "react";
import axios from "axios";
import "./MovieList.css";
import MovieDetail from "./MovieDetail";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const MovieList = ({ fetchUrl, categoryName, handleAddFav }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
      <div className="movie-list">
        <h2 className="category-name">{categoryName}</h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView="auto"
          navigation
          loop={true}
          grabCursor={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {loading ? (
            <p>Loading movies...</p>
          ) : movies.length === 0 ? (
            <p>No movies available</p>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <SwiperSlide
                  key={movie.id}
                  className="movie-item"
                  onClick={() => handleSelectedClick(movie.id)}
                  style={{ width: "200px" }} // hoặc chiều rộng bạn muốn
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
                      handleAddFav(movie);
                    }}
                  >
                    {" "}
                    +{" "}
                  </button>
                </SwiperSlide>
              ))}
            </div>
          )}
        </Swiper>
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
      </div>
    </>
  );
};

export default MovieList;
