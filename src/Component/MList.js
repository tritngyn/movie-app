import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./MList.module.scss";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

const MList = ({ categoryName }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null);

  const categoryMap = {
    Popular: { type: "category", value: "popular" },
    Horror: { type: "genre", value: 27 },
    Action: { type: "genre", value: 28 },
    Comedy: { type: "genre", value: 35 },
    Movie: { type: "discover", value: "movie" },
    TV: { type: "discover", value: "tv" },
  };

  useEffect(() => {
    const constructFetchUrl = (categoryName) => {
      const category = categoryMap[categoryName];
      if (!category) return "";
      if (category.type === "genre") {
        return `${process.env.REACT_APP_BASE_URL}/discover/movie?with_genres=${category.value}&api_key=${process.env.REACT_APP_API_KEY}`;
      }
      if (category.type === "category") {
        return `${process.env.REACT_APP_BASE_URL}/movie/${category.value}?api_key=${process.env.REACT_APP_API_KEY}`;
      }
      if (category.type === "discover") {
        if (category.value === "tv")
          return `${process.env.REACT_APP_BASE_URL}/discover/tv?api_key=${process.env.REACT_APP_API_KEY}`;
        if (category.value === "movie")
          return `${process.env.REACT_APP_BASE_URL}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}`;
      }
    };

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(constructFetchUrl(categoryName));
        setMovies(response.data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [categoryName]);

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {categoryName}
          <span className={styles.viewAll}>Xem toàn bộ</span>
          <ChevronRight className={styles.chevronIcon} />
        </h2>

        <div className={styles.controls}></div>
      </div>

      {/* Swiper Slider */}
      {loading ? (
        <p className={styles.loading}>Đang tải...</p>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView="auto"
          grabCursor={true}
          navigation
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1440: { slidesPerView: 6 },
          }}
          style={{
            width: "100%",
            paddingBottom: "10px",
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide
              className={styles["movie-item"]}
              key={movie.id}
              style={{
                flex: "0 0 auto",
                width: "calc(100% / 5)", // chia đều 6 ô
                maxWidth: "220px", // nhưng không vượt quá 220px
                flexDirection: "column",
                alignItems: "flex-start",
                background: "transparent",
              }}
            >
              <Link
                to={`/${categoryName === "TV" ? "tv" : "movie"}/${movie.id}`}
                className={styles["movie-card"]}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  title={movie.title || movie.name}
                  rating={movie.vote_average?.toFixed(1)}
                  episode={
                    categoryName === "TV" && movie.episode_count
                      ? `Tập: ${movie.episode_count}`
                      : null
                  }
                  quality="HD"
                  rank={index + 1}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MList;
