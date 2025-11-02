import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./FilterResults.module.scss";
import MovieCard from "./MovieCard";

export default function FilterResults() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Lấy filter params từ URL
  const filters = {
    country: searchParams.get("country") || "all",
    category: searchParams.get("category") || "all",
    rating: searchParams.get("rating") || "all",
    genre: searchParams.get("genre") || "all",
    year: searchParams.get("year") || "all",
    sort: searchParams.get("sort") || "latest",
  };

  // Fetch movies với filters
  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);
      try {
        // Xác định type (movie hoặc tv)
        const type = filters.category === "tv" ? "tv" : "movie";

        // Build query parameters
        const params = new URLSearchParams({
          api_key: process.env.REACT_APP_API_KEY,
          language: "vi",
          page: currentPage.toString(),
        });

        // Thêm filters vào params
        if (filters.country !== "all") {
          params.append("with_origin_country", filters.country);
        }

        if (filters.genre !== "all") {
          params.append("with_genres", filters.genre);
        }

        if (filters.year !== "all") {
          const dateKey =
            type === "movie" ? "primary_release_year" : "first_air_date_year";
          params.append(dateKey, filters.year);
        }

        // Sắp xếp
        if (filters.sort === "latest") {
          params.append("sort_by", "release_date.desc");
        } else if (filters.sort === "oldest") {
          params.append("sort_by", "release_date.asc");
        } else if (filters.sort === "imdb") {
          params.append("sort_by", "vote_average.desc");
          params.append("vote_count.gte", "100");
        } else if (filters.sort === "views") {
          params.append("sort_by", "popularity.desc");
        }

        const response = await axios.get(
          `${
            process.env.REACT_APP_BASE_URL
          }/discover/${type}?${params.toString()}`
        );

        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 0);
      } catch (error) {
        console.error("Error fetching filtered movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [searchParams, currentPage]);

  // Hiển thị filter tags
  const getFilterLabel = (key, value) => {
    const labels = {
      country: {
        US: "Mỹ",
        GB: "Anh",
        KR: "Hàn Quốc",
        JP: "Nhật Bản",
        CN: "Trung Quốc",
        TH: "Thái Lan",
      },
      category: { movie: "Phim lẻ", tv: "Phim bộ" },
      sort: {
        latest: "Mới nhất",
        oldest: "Mới cập nhật",
        imdb: "Điểm IMDb",
        views: "Lượt xem",
      },
    };
    return labels[key]?.[value] || value;
  };

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) range.push("...");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push("...");

    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className={styles["filter-results"]}>
      {/* Filter Tags */}
      <div className={styles["filter-tags"]}>
        <h2>Đang lọc:</h2>
        <div className={styles["tags"]}>
          {Object.entries(filters).map(([key, value]) => {
            if (value !== "all" && value !== "latest") {
              return (
                <span key={key} className={styles["tag"]}>
                  {getFilterLabel(key, value)}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className={styles["results-info"]}>
        <p>
          Tìm thấy <strong>{movies.length}</strong> kết quả
          {totalPages > 0 && ` - Trang ${currentPage}/${totalPages}`}
        </p>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className={styles["loading"]}>
          <div className={styles["spinner"]}></div>
          <p>Đang tải...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className={styles["no-results"]}>
          <p>😞 Không tìm thấy phim nào phù hợp với bộ lọc</p>
          <Link to="/" className={styles["back-home"]}>
            Về trang chủ
          </Link>
        </div>
      ) : (
        <>
          <div className={styles["movies-grid"]}>
            {movies.map((movie) => (
              <div className={styles["movie-card"]} key={movie.id}>
                <Link
                  to={`/${filters.category === "tv" ? "tv" : "movie"}/${
                    movie.id
                  }`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MovieCard
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    title={movie.title || movie.name}
                    rating={movie.vote_average?.toFixed(1)}
                    episode={
                      filters.category === "tv" && movie.number_of_episodes
                        ? `Tập: ${movie.number_of_episodes}`
                        : null
                    }
                    quality="HD"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles["pagination"]}>
              <button
                className={styles["page-btn"]}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  className={`${styles["page-btn"]} ${
                    page === currentPage ? styles["active"] : ""
                  } ${page === "..." ? styles["dots"] : ""}`}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className={styles["page-btn"]}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
