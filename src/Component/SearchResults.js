import React, { useState, useEffect } from "react";
import styles from "./SearchResults.module.css";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${query}`
        );
        setResults(res.data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}

      {!loading && query && results.length > 0 && (
        <div className={styles.moviesList}>
          <h2 className={styles.categoryTitle}>Search Results for {query}</h2>

          <div className={styles.moviesGrid}>
            {results.map((movie) => (
              <Link
                key={movie.id}
                className={styles.movieCard}
                to={`/movie/${movie.id}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className={styles.moviePoster}
                />
                <span className={styles.searchResultsGridTitle}>
                  {movie.title || movie.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p>Không tìm thấy kết quả cho {query}.</p>
      )}
    </div>
  );
};

export default SearchResults;
