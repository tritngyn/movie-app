import React, { useState } from "react";
import "./Comment.scss"; // lát nữa mình tạo file này

const CommentSection = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const newComment = {
      id: Date.now(),
      user: "Triet Nguyen",
      text: comment,
      time: new Date().toLocaleString(),
    };

    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <div className="comment-section">
      <h2>Bình luận</h2>

      {/* Ô nhập */}
      <div className="comment-input">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          maxLength={500}
        />
        <button onClick={handleAddComment}>Gửi</button>
      </div>

      {/* Danh sách bình luận */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comment">Chưa có bình luận nào</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="avatar">{c.user[0]}</div>
              <div className="content">
                <div className="info">
                  <span className="name">{c.user}</span>
                  <span className="time">{c.time}</span>
                </div>
                <p>{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
