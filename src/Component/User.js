import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./User.scss";
import { Link } from "react-router-dom";

const User = ({ favmovie, fetchUrl, DeleteFav }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  // const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        if (!fetchUrl) return;
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
  // const handleSelectedClick = async (movieId) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar,external_ids`
  //     );
  //     setSelectedMovie(response.data);
  //     document.body.style.overflow = "hidden";
  //   } catch (error) {
  //     console.error("Error fetching movie details:", error);
  //   }
  // };
  // const handleCloseModal = () => {
  //   setSelectedMovie(null);
  //   document.body.style.overflow = "unset";
  // };
  return (
    <div className="favorite-page">
      {/* SIDEBAR */}
      <aside style={{ minWidth: "240px" }} className="sidebar">
        <h2>Quản lý tài khoản</h2>
        <ul>
          <li className="active">
            <i className="fa fa-heart"></i> Yêu thích
          </li>
          <li>
            <i className="fa fa-list"></i> Danh sách
          </li>
          <li>
            <i className="fa fa-user"></i> Tài khoản
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <section className="favorite-content">
        <h2>Yêu thích</h2>

        {favmovie.length === 0 ? (
          <div className="empty-fav">
            <p>Bạn chưa có phim yêu thích nào</p>
          </div>
        ) : (
          <div className="movies-grid">
            {favmovie.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                  />
                </Link>
                <div className="movie-info">
                  <h4>{movie.title || movie.name}</h4>
                  <button
                    className="delete-btn"
                    onClick={() => DeleteFav(movie)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default User;
