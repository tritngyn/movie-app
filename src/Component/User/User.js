import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.scss";
import hqh from "../../assets/hqh.jfif";
import {
  supabase,
  removeFromWatchlist,
  removeFromFavorites,
} from "../../supabaseClient";
import WatchlistDropdown from "./WatchList";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { red } from "@mui/material/colors";
// TMDB API
const TMDB_API_KEY = "b13aa17feb96ef0ae039e6c0531f586a";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const User = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  //state của 2 loại list
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUserProfile({
          email: user.email,
          created_at: user.created_at,
          id: user.id,
        });
      }
    };
    getUser();
  }, []);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=vi-VN`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };
  //fetch những WatchList
  useEffect(() => {
    if (!user) return;

    const fetchWatchlists = async () => {
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (!error) setWatchlists(data);
    };

    fetchWatchlists();
  }, [user]);
  //fetch phim trong list được chọn
  useEffect(() => {
    if (!selectedList) return;

    const fetchMovies = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("watchlist_movies")
        .select("*")
        .eq("watchlist_id", selectedList.id)
        .order("added_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const detailed = await Promise.all(
        data.map(async (item) => {
          const detail = await fetchMovieDetails(item.movie_id);
          return { ...item, ...detail };
        })
      );
      setWatchlistMovies(detailed);
      setMovies(detailed);
      setLoading(false);
    };

    fetchMovies();
  }, [selectedList]);
  //fetch list phim từ favorite
  useEffect(() => {
    if (!user || activeTab === "account") return;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const moviesWithDetails = await Promise.all(
          (data || []).map(async (item) => {
            const movieDetails = await fetchMovieDetails(item.movie_id);
            return {
              ...item,
              ...movieDetails,
            };
          })
        );
        setFavoriteMovies(moviesWithDetails);
        setMovies(moviesWithDetails);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab, user]);

  const handleDelete = async (movie) => {
    try {
      if (activeTab === "favorites") {
        // Nếu tab hiện tại là favorites -> xóa trực tiếp từ bảng favorites
        const result = await removeFromFavorites(movie.movie_id);
        if (!result.success) throw new Error(result.message);
      } else {
        // Nếu là watchlist -> dùng helper removeFromWatchlist
        const result = await removeFromWatchlist(
          movie.watchlist_id,
          movie.movie_id
        );
        if (!result.success) throw new Error(result.message);
      }

      // Cập nhật lại state UI
      setMovies((prev) => prev.filter((m) => m.id !== movie.id));

      alert("Đã xóa phim khỏi danh sách");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Không thể xóa phim: " + error.message);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      setPasswordSuccess("Đổi mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);

      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      setPasswordError(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleMovieClick = (movieId) => {
    window.location.href = `/movie/${movieId}`;
  };

  if (!user) {
    return (
      <div className="login-required">
        <div className="login-content">
          <h2>Vui lòng đăng nhập</h2>
          <button onClick={() => (window.location.href = "/login")}>
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar">
            <img src={hqh} />
          </div>
          <div className="user-details">
            <p className="greeting">Xin chào</p>
            <p className="username">{user?.email?.split("@")[0]}</p>
          </div>
        </div>

        <h2 className="sidebar-title">Quản lý tài khoản</h2>
        <ul className="sidebar-menu">
          <li>
            <button
              onClick={() => setActiveTab("favorites")}
              className={activeTab === "favorites" ? "active" : ""}
            >
              <span className="icon">
                <FavoriteIcon sx={{ color: red[500] }} />{" "}
              </span>{" "}
              Yêu thích
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("watchlist")}
              className={activeTab === "watchlist" ? "active" : ""}
            >
              <span className="icon">
                <FormatListBulletedIcon />
              </span>{" "}
              Danh sách
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("account")}
              className={activeTab === "account" ? "active" : ""}
            >
              <span className="icon">
                <PersonIcon />{" "}
              </span>{" "}
              Tài khoản
            </button>
          </li>
          <li>
            <button onClick={handleSignOut} className="signout-btn">
              <span className="icon">
                <LogoutIcon />
              </span>{" "}
              Đăng xuất
            </button>
          </li>
        </ul>
      </aside>

      <section className="main-content">
        {activeTab === "account" && userProfile && (
          <div className="account-section">
            <h2 className="page-title">Thông tin tài khoản</h2>

            <div className="info-card">
              <h3>Thông tin cá nhân</h3>
              <div className="info-group">
                <div className="info-item">
                  <label>Email</label>
                  <p>{userProfile.email}</p>
                </div>
                <div className="info-item">
                  <label>Ngày đăng ký</label>
                  <p>
                    {new Date(userProfile.created_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div className="info-item">
                  <label>ID tài khoản</label>
                  <p className="user-id">{userProfile.id}</p>
                </div>
              </div>
            </div>

            <div className="security-card">
              <h3>Bảo mật</h3>

              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="change-password-btn"
                >
                  Đổi mật khẩu
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {passwordError && (
                    <div className="alert alert-error">{passwordError}</div>
                  )}

                  {passwordSuccess && (
                    <div className="alert alert-success">{passwordSuccess}</div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      Xác nhận
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordError("");
                      }}
                      className="btn-cancel"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        {/* TAB YÊU THÍCH */}
        {activeTab === "favorites" && (
          <>
            <h2 className="page-title">Phim yêu thích</h2>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : favoriteMovies.length === 0 ? (
              <div className="empty-state">
                <p>Bạn chưa có phim yêu thích nào</p>
                <button onClick={() => (window.location.href = "/")}>
                  Khám phá phim
                </button>
              </div>
            ) : (
              <div className="movies-grid">
                {favoriteMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <div
                      className="movie-poster"
                      onClick={() => handleMovieClick(movie.movie_id)}
                    >
                      <img
                        src={
                          movie.poster
                            ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.movie_title}
                      />
                      <div className="movie-overlay">
                        <h4>{movie.movie_title}</h4>
                        <div className="movie-actions">
                          <button className="btn-detail">Xem chi tiết</button>
                          <button
                            className="btn-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(movie.movie_id);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB DANH SÁCH */}
        {activeTab === "watchlist" && (
          <>
            <h2 className="page-title">Danh sách của tôi</h2>
            <WatchlistDropdown
              user={user}
              watchlists={watchlists}
              setWatchlists={setWatchlists}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
            {selectedList ? (
              loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : watchlistMovies.length === 0 ? (
                <div className="empty-state">
                  <p>Danh sách này đang trống</p>
                </div>
              ) : (
                <div className="movies-grid">
                  {watchlistMovies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <div
                        className="movie-poster"
                        onClick={() => handleMovieClick(movie.movie_id)}
                      >
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : "https://via.placeholder.com/500x750?text=No+Image"
                          }
                          alt={movie.title}
                        />
                        <div className="movie-overlay">
                          <h4>{movie.title}</h4>
                          <div className="movie-actions">
                            <button className="btn-detail">Xem chi tiết</button>
                            <button
                              className="btn-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(movie);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="empty-state">
                <p>Chọn một danh sách để xem phim</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default User;
