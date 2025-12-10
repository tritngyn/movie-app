// client/src/components/UploadMovie.js
import React, { useState } from "react";
import axios from "axios";

function UploadMovie() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Lấy file đầu tiên user chọn
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn video!");

    const formData = new FormData();
    // Key 'video' này phải khớp với upload.single('video') ở Backend
    formData.append("video", file);
    formData.append("title", title);
    formData.append("plot", "Mô tả phim tự upload");

    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:5000/api/movies/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Bắt buộc cho file upload
          },
        }
      );
      alert("Upload thành công!");
      console.log(res.data);
    } catch (err) {
      alert("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20, border: "1px dashed blue", margin: 20 }}>
      <h3>Upload Phim Mới</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên phim: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Chọn Video: </label>
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Đang tải lên..." : "Upload Ngay"}
        </button>
      </form>
    </div>
  );
}

export default UploadMovie;
