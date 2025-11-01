import React, { useState } from "react";
import "./Comment.scss";
import hqh from "../assets/hqh.jfif";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import CommentIcon from "@mui/icons-material/Comment";
const mockComments = [
  {
    id: 1,
    author: "Duyen Hong",
    avatar: "",
    isVIP: true,
    likes: 0,
    dislikes: 0,
    time: "4 giờ trước",
    comment: "love this one",
  },
];

export default function CommentSection() {
  const [comment, setComment] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setComment(text);
      setCharCount(text.length);
    }
  };

  return (
    <div className="comment-section">
      {/* Comment Stats */}
      <div className="comment-header">
        <span className="icon">💬</span>
        <h3>Bình luận (84)</h3>
        <div className="button-group">
          <button size="sm" className="btn-outline">
            Bình luận
          </button>
          <button size="sm" className="btn-outline">
            Đánh giá
          </button>
        </div>
      </div>

      {/* Comment Input */}
      <div className="comment-input">
        <p className="login-notice">
          Vui lòng <span>đăng nhập</span> để tham gia bình luận.
        </p>
        <div className="input-wrapper">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Viết bình luận"
            className="input-textarea"
          />
          <div className="input-footer">
            <div className="spoiler">
              <input type="checkbox" id="spoiler" />
              <label htmlFor="spoiler">Tiết lộ?</label>
            </div>
            <div className="submit-group">
              <span className="char-count">
                {charCount} / {maxChars}
              </span>
              <button className="btn-send">
                Gửi <span>✈️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="comment-list">
        {mockComments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="card-top">
              <avatar className="avatar">
                <img src={hqh} />
              </avatar>
              <div className="card-body">
                <div className="card-header">
                  <span className="author">{comment.author}</span>

                  <span className="time">{comment.time}</span>
                  <badge className="episode-badge">0.4 - Tập 3</badge>
                </div>
                <p className="content">{comment.comment}</p>
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
}
