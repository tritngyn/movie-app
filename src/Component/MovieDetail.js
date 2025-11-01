import React, { useEffect, useState } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import {
  supabase,
  toggleFavorite,
  toggleWatchlist,
  isInFavorites,
  isInWatchlist,
} from "../supabaseClient";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
const MovieDetail = ({ handleAddFav }) => {
  const { id, category } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trailer");

  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState({});
  const [videos, setVideos] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInList, setIsInList] = useState(false);

  console.log(id, category);
  // const [comment, setComment] = useState("");
  // const [comments, setComments] = useState([]);
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

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Không có dữ liệu phim.</p>;

  console.log("fetch:", category);
  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(movie);
    if (result.success) {
      setIsFavorite(!isFavorite);
    } else {
      console.log(result.message, "error");
    }
  };

  const handleToggleWatchlist = async () => {
    const result = await toggleWatchlist(movie);
    if (result.success) {
      setIsInList(!isInList);
    } else {
      console.log(result.message, "error");
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

            <button
              onClick={handleToggleWatchlist}
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
          <Comment />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
