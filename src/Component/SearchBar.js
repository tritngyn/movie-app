import React, { useState } from "react";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

function SearchBar({ OnSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") return;
    OnSearch(searchTerm);
    navigate(`/searchresult?q=${encodeURIComponent(searchTerm)}`); // ✅ chỉ gọi 1 lần
  };

  return (
    <form className="search_bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        placeholder="Tìm kiếm phim, diễn viên"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Tìm
      </button>
    </form>
  );
}

export default SearchBar;
