import { useEffect, useState, useRef } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "../Comment";
import {
  supabase,
  toggleFavorite,
  toggleWatchlist,
  isInFavorites,
  isInWatchlist,
} from "../../supabaseClient";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import useClickOutside from "../hooks/useClickoutside";
const MovieDetail = () => {
  const { id, category } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trailer");
  const [user, setUser] = useState(null);
  //check trạng thái phim
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInList, setIsInList] = useState(false);
  //dropdown chỗ thêm phim
  const [showDropdown, setShowDropdown] = useState(false);
  const [watchlists, setWatchlists] = useState([]);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  //check user và lấy list phim
  useEffect(() => {
    const initUserAndWatchlists = async () => {
      //  Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      //  If user found, fetch their watchlists
      if (user) {
        const { data, error } = await supabase
          .from("watchlists")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (!error) setWatchlists(data);
      }
    };

    initUserAndWatchlists();
  }, []); // only once on mount
  //xử lí click out side

  // fetch MovieDetail
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${category}/${id}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos,images,credits,reviews,similar`
        );
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, category]);

  // Thêm đoạn này để khi reload trang, React biết phim đã có trong favorite/watchlist
  useEffect(() => {
    const fetchInitialStates = async () => {
      if (!movie) return;

      const favoriteStatus = await isInFavorites(movie.id);
      // nếu user có ít nhất 1 danh sách
      let watchlistStatus = false;
      if (watchlists.length > 0) {
        watchlistStatus = await isInWatchlist(movie.id, watchlists[0].id);
      }

      setIsFavorite(favoriteStatus);
      setIsInList(watchlistStatus);
    };

    fetchInitialStates();
  }, [movie, user, watchlists]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Không có dữ liệu phim.</p>;

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(movie);
    if (result.success) {
      setIsFavorite(!isFavorite);
      Toastify({
        text: !isFavorite
          ? "Đã thêm vào danh sách yêu thích!"
          : "Đã xóa khỏi danh sách yêu thích!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff512f, #dd2476)",
        },
      }).showToast();
    } else {
      Toastify({
        text: "Lỗi khi cập nhật yêu thích!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      console.log(result.message, "error");
    }
  };

  const handleToggleWatchlist = async (listId, listName) => {
    const result = await toggleWatchlist(movie, listId);

    if (result.success) {
      setIsInList(!isInList);
      Toastify({
        text: !isInList
          ? `Đã thêm vào "${listName}"!`
          : `Đã xóa khỏi "${listName}"!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff512f, #dd2476)",
        },
      }).showToast();
    } else {
      Toastify({
        text: result.message || "Lỗi khi cập nhật danh sách!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  };

  return (
    <div className="movie-detail-page">
      <div
        className="hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="overlay"></div>
      </div>
      {/* MAIN WRAPPER */}
      <div className="movie-container">
        {/* LEFT SECTION */}
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="poster"
          />

          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="subtitle">{movie.original_title}</p>

            <div className="tags">
              <span>IMDb {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.runtime} phút</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
            </div>

            <div className="overview">
              <h3>Giới thiệu</h3>
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <div className="action-buttons-group">
            <button className="btn-play" title="Phát">
              <PlayArrowIcon className="icon" />
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`btn-icon ${isFavorite ? "active" : ""}`}
              title="Yêu thích"
            >
              {isFavorite ? (
                <FavoriteIcon className="icon" />
              ) : (
                <FavoriteBorderIcon className="icon" />
              )}
              <span>Yêu Thích</span>
            </button>
            {/* Nút thêm phim vào customized list */}
            <div className="add-to-watchlist-container" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`btn-icon ${isInList ? "active" : ""}`}
                title="Thêm vào danh sách"
              >
                {isInList ? (
                  <DoneIcon className="icon" />
                ) : (
                  <AddIcon className="icon" />
                )}
                <span>Thêm Vào</span>
              </button>

              {showDropdown && (
                <div className="dropdown-list">
                  {watchlists.length === 0 ? (
                    <p className="empty">Bạn chưa có danh sách nào</p>
                  ) : (
                    watchlists.map((list) => (
                      <button
                        key={list.id}
                        className="dropdown-item"
                        onClick={() =>
                          handleToggleWatchlist(list.id, list.name)
                        }
                      >
                        {list.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="btn-icon" title="Chia sẻ">
              <ShareIcon className="icon" />
              <span>Chia sẻ</span>
            </button>

            <button className="btn-icon" title="Đánh giá">
              <StarIcon className="icon" />
              <span>Đánh giá</span>
            </button>
          </div>
          {/* NAVIGATION TABS */}
          <div className="tab-nav">
            {["trailer", "gallery", "cast", "recommend"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {
                  {
                    trailer: "Trailer",
                    gallery: "Gallery",
                    cast: "Diễn viên",
                    recommend: "Đề xuất",
                  }[tab]
                }
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {activeTab === "trailer" && (
              <div className="tab-item">
                <h2>Trailer</h2>
                <div className="video-wrapper">
                  {movie.videos?.results?.find(
                    (v) => v.type === "Trailer" && v.site === "YouTube"
                  ) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        movie.videos.results.find(
                          (v) => v.type === "Trailer" && v.site === "YouTube"
                        ).key
                      }`}
                      title="Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <p>Không có trailer khả dụng</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <section className="gallery">
                <h2>Gallery</h2>
                <div className="img-grid">
                  {movie.images?.backdrops?.slice(0, 8).map((img, i) => (
                    <img
                      key={i}
                      src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                      alt=""
                    />
                  ))}
                </div>
              </section>
            )}

            {activeTab === "cast" && (
              <section className="cast">
                <h2>Diễn viên nổi bật</h2>
                <div className="cast-grid">
                  {movie.credits?.cast?.slice(0, 10).map((p) => (
                    <div key={p.id} className="cast-card">
                      <img
                        src={
                          p.profile_path
                            ? `https://image.tmdb.org/t/p/w200${p.profile_path}`
                            : "/placeholder.jpg"
                        }
                        alt={p.name}
                      />
                      <h3>{p.name}</h3>
                      <p>{p.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "recommend" && (
              <div className="tab-item">
                <h2>Đề xuất</h2>
                <p>Các phim tương tự...</p>
              </div>
            )}
          </div>
          <Comment movieId={movie.id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
