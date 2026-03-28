import React, { useRef, useState } from "react";
import axios from "axios";
import styles from "./UploadMovie.module.scss";

function UploadMovie() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  const API_BASE_URL =
    process.env.REACT_APP_API_SERVER || "http://localhost:5000";

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatus({ type: "error", message: "Vui lòng nhập tên phim." });
      return;
    }

    if (!file) {
      setStatus({
        type: "error",
        message: "Vui lòng chọn file video trước khi upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title.trim());
    formData.append("plot", plot.trim() || "Mô tả phim tự upload");

    try {
      setUploading(true);
      setStatus({ type: "", message: "" });

      const res = await axios.post(
        `${API_BASE_URL}/api/movies/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setStatus({
        type: "success",
        message: "Upload thành công. Phim đã được thêm vào danh sách.",
      });
      setTitle("");
      setPlot("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log(res.data);
    } catch (err) {
      setStatus({
        type: "error",
        message: `Upload thất bại: ${err.response?.data?.message || err.message}`,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className={styles.uploadSection}>
      <div className={styles.uploadCard}>
        <div className={styles.header}>
          <p className={styles.kicker}>Kho phim cộng đồng</p>
          <h3>Upload Phim Mới</h3>
          <p className={styles.subtitle}>
            Thêm video mới vào kho phim nội bộ. Hỗ trợ các định dạng video phổ
            biến.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span>Tên phim</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: The Silent River"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Mô tả ngắn</span>
            <textarea
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              placeholder="Nhập mô tả ngắn cho phim (tùy chọn)"
              rows={3}
            />
          </label>

          <div className={styles.fileField}>
            <span className={styles.fileLabel}>Video</span>
            <div className={styles.filePicker}>
              <input
                ref={fileInputRef}
                id="upload-movie-video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              <label htmlFor="upload-movie-video" className={styles.fileButton}>
                Chọn file
              </label>
              <p className={styles.fileMeta}>
                {file
                  ? `${file.name} (${formatFileSize(file.size)})`
                  : "Chưa có file nào được chọn"}
              </p>
            </div>
          </div>

          {status.message && (
            <p
              className={`${styles.status} ${status.type === "success" ? styles.success : styles.error}`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={styles.submitButton}
          >
            {uploading ? "Đang tải lên..." : "Upload ngay"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UploadMovie;
