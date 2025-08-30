import React, { useState } from "react";
import axios from "axios";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

function SearchBar({ OnSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    OnSearch(searchTerm);
    console.log("-> send movie title", searchTerm);
    navigate("/searchresult");
  };
  return (
    <>
      <form className="search_bar" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Tìm kiếm phim, diễn viên"
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Tìm
        </button>
      </form>
    </>
  );
}
export default SearchBar;
