import React, { useEffect, useState } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
const MovieDetail = ({ handleAddFav }) => {
  const { id, category } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trailer");
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
          <div className="buttons">
            <button className="watch">▶ Xem Ngay</button>
            <div className="actions">
              <span
                onClick={() => {
                  handleAddFav(movie);
                }}
              >
                Yêu thích
              </span>
              <span>Thêm vào</span>
              <span>Chia sẻ</span>
              <span>Bình luận</span>
            </div>
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
          {/* COMMENT SECTION
          <div className="comment-section">
            <div className="comment-input">
              <h2>Bình luận</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
              />
              <button onClick={handleComment()}>Gửi bình luận</button>
            </div>
            <div className="comment-list">
              {comments.length === 0 ? (
                <p>Chưa có bình luận nào.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <p className="comment-text">{c.text}</p>
                    <small>{c.date}</small>
                    <button onClick={() => handleDeleteComment(c.id)}>
                      Xóa
                    </button>
                  </div>
                ))
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
