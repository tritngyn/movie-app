import { useEffect, useState } from "react";
import CommentIcon from "@mui/icons-material/Comment";
import "./Comment.scss";
import hqh from "../assets/hqh.jfif";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { addComment, getCommentsByMovie, supabase } from "../supabaseClient";
import SendIcon from "@mui/icons-material/Send";
const Comment = ({ movieId }) => {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // lấy user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // load comment
  useEffect(() => {
    const loadComments = async () => {
      const data = await getCommentsByMovie(movieId);
      setComments(data);
    };
    console.log("movieId in Comment:", movieId);
    if (movieId) loadComments();
  }, [movieId]);

  // gửi bình luận
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const result = await addComment(movieId, content);
    setLoading(false);
    console.log(loading);
    if (result.success) {
      setComments((prev) => [result.data, ...prev]);
      setContent("");
      Toastify({
        text: "Bình luận đã được đăng!",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
      }).showToast();
    } else {
      Toastify({
        text: result.message || "Không thể đăng bình luận.",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: "red" },
      }).showToast();
    }
  };
  return (
    <div className="comment-section">
      {user ? (
        <>
          {/* Comment Stats */}
          <div className="comment-header">
            <CommentIcon />
            <h3>Bình luận </h3>
          </div>

          {/* Comment Input */}
          <div className="comment-input">
            <form className="input-wrapper" onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết bình luận"
                className="input-textarea"
                required
              />
              <div className="input-footer">
                <div className="submit-group">
                  <button className="btn-send">
                    Gửi{" "}
                    <span>
                      <SendIcon />{" "}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <p className="login-notice">
          Vui lòng <span>đăng nhập</span> để tham gia bình luận.
        </p>
      )}
      {/* Comments List */}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="card-top">
              <avatar className="avatar">
                <img src={hqh} />
              </avatar>
              <div className="card-body">
                <div className="card-header">
                  <span className="author">{comment.username}</span>

                  <span className="time">{comment.created_at}</span>
                </div>
                <p className="content">{comment.content}</p>
                <div className="card-actions">
                  <button className="btn-action">
                    <ThumbsUp className="icon-sm" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="btn-action">
                    <ThumbsDown className="icon-sm" />
                    <span>{comment.dislikes}</span>
                  </button>
                  <button className="btn-reply">
                    <CommentIcon /> Trả lời
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Comment;
