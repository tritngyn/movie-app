import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./FilterBar.module.scss";

export default function FilterBar({ categoryName }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    country: "all",
    category: "all",
    rating: "all",
    genre: "all",
    year: "all",
    sort: "latest",
  });

  // Danh sách quốc gia
  const countries = [
    { value: "all", label: "Tất cả" },
    { value: "US", label: "Mỹ" },
    { value: "GB", label: "Anh" },
    { value: "KR", label: "Hàn Quốc" },
    { value: "JP", label: "Nhật Bản" },
    { value: "CN", label: "Trung Quốc" },
    { value: "TH", label: "Thái Lan" },
    { value: "IN", label: "Ấn Độ" },
    { value: "FR", label: "Pháp" },
    { value: "DE", label: "Đức" },
    { value: "CA", label: "Canada" },
    { value: "HK", label: "Hồng Kông" },
    { value: "TW", label: "Đài Loan" },
    { value: "ES", label: "Tây Ban Nha" },
    { value: "IT", label: "Ý" },
    { value: "AU", label: "Úc" },
  ];

  // Danh sách xếp hạng (Rating/Age)
  const ratings = [
    { value: "all", label: "Tất cả" },
    { value: "P", label: "P (Mọi lứa tuổi)" },
    { value: "K", label: "K (Dưới 13 tuổi)" },
    { value: "T13", label: "T13 (13 tuổi trở lên)" },
    { value: "T16", label: "T16 (16 tuổi trở lên)" },
    { value: "T18", label: "T18 (18 tuổi trở lên)" },
  ];

  // Danh sách năm
  const years = [
    { value: "all", label: "Tất cả" },
    ...Array.from({ length: 15 }, (_, i) => {
      const year = 2025 - i;
      return { value: year.toString(), label: year.toString() };
    }),
  ];

  // Danh sách sắp xếp
  const sortOptions = [
    { value: "latest", label: "Mới nhất" },
    { value: "oldest", label: "Mới cập nhật" },
    { value: "imdb", label: "Điểm IMDb" },
  ];

  // Fetch thể loại từ TMDB API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const type = categoryName === "TV" ? "tv" : "movie";
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=vi`
        );
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [categoryName]);

  // Xử lý thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      country: "all",
      category: "all",
      rating: "all",
      genre: "all",
      year: "all",
      sort: "latest",
    });
    setIsExpanded(false);
  };

  // Xử lý submit và chuyển trang
  const handleSubmit = () => {
    // Build query string từ filters
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "all") {
        params.append(key, value);
      }
    });

    // Chuyển sang trang FilterResults với params
    navigate(`/filter-results?${params.toString()}`);
  };

  return (
    <div className={styles["filter-container"]}>
      {/* Toggle Button */}
      <button
        className={styles["toggle-btn"]}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>⭐ Bộ lọc</span>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className={styles["filter-content"]}>
          {/* Quốc gia */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Quốc gia:</label>
            <div className={styles["filter-options"]}>
              {countries.map((country) => (
                <button
                  key={country.value}
                  className={`${styles["filter-btn"]} ${
                    filters.country === country.value ? styles["active"] : ""
                  }`}
                  onClick={() => handleFilterChange("country", country.value)}
                >
                  {country.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loại phim */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Loại phim:</label>
            <div className={styles["filter-options"]}>
              <button
                className={`${styles["filter-btn"]} ${
                  filters.category === "all" ? styles["active"] : ""
                }`}
                onClick={() => handleFilterChange("category", "all")}
              >
                Tất cả
              </button>
              <button
                className={`${styles["filter-btn"]} ${
                  filters.category === "movie" ? styles["active"] : ""
                }`}
                onClick={() => handleFilterChange("category", "movie")}
              >
                Phim lẻ
              </button>
              <button
                className={`${styles["filter-btn"]} ${
                  filters.category === "tv" ? styles["active"] : ""
                }`}
                onClick={() => handleFilterChange("category", "tv")}
              >
                Phim bộ
              </button>
            </div>
          </div>

          {/* Xếp hạng */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Xếp hạng:</label>
            <div className={styles["filter-options"]}>
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  className={`${styles["filter-btn"]} ${
                    filters.rating === rating.value ? styles["active"] : ""
                  }`}
                  onClick={() => handleFilterChange("rating", rating.value)}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thể loại */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Thể loại:</label>
            <div className={styles["filter-options"]}>
              <button
                className={`${styles["filter-btn"]} ${
                  filters.genre === "all" ? styles["active"] : ""
                }`}
                onClick={() => handleFilterChange("genre", "all")}
              >
                Tất cả
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`${styles["filter-btn"]} ${
                    filters.genre === genre.id.toString()
                      ? styles["active"]
                      : ""
                  }`}
                  onClick={() =>
                    handleFilterChange("genre", genre.id.toString())
                  }
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Năm sản xuất */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Năm sản xuất:</label>
            <div className={styles["filter-options"]}>
              {years.map((year) => (
                <button
                  key={year.value}
                  className={`${styles["filter-btn"]} ${
                    filters.year === year.value ? styles["active"] : ""
                  }`}
                  onClick={() => handleFilterChange("year", year.value)}
                >
                  {year.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sắp xếp */}
          <div className={styles["filter-row"]}>
            <label className={styles["filter-label"]}>Sắp xếp:</label>
            <div className={styles["filter-options"]}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles["filter-btn"]} ${
                    filters.sort === option.value ? styles["active"] : ""
                  }`}
                  onClick={() => handleFilterChange("sort", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles["filter-actions"]}>
            <button className={styles["filter-submit"]} onClick={handleSubmit}>
              Lọc kết quả →
            </button>
            <button className={styles["filter-reset"]} onClick={handleReset}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
