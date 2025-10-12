import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { faAlignRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../Component/SearchBar";
import "./NAV.css";

library.add(faBars);

const NAV = ({ onSelectGenre, handleClickSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSBOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 878, name: "Science Fiction" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 10752, name: "War" },
  ];
  const toggleSearchBar = () => {
    setIsSBOpen(!isSearchBarOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleGenreClick = (genreID, genreName) => {
    onSelectGenre(genreID, genreName);
    setIsMenuOpen(false);
    const movieListElement = document.querySelector(".movie-list");
    if (movieListElement)
      movieListElement.scrollIntoView({ behavior: "smooth" });
  };
  // fade-in
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`nav ${scrolled ? "scrolled" : ""}`}>
      {!isSearchBarOpen && (
        <>
          <div className="nav-left">
            <div className="navbarlinks">
              <button className="hamburger" onClick={toggleMenu}>
                <FontAwesomeIcon icon="fa-solid fa-bars" />
              </button>
              {isMenuOpen && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() => {
                      onSelectGenre("", "Popular");
                      setIsMenuOpen(false);
                    }}
                  >
                    Popular
                  </li>
                  {genres.map((genre) => (
                    <Link
                      to={`/the_loai/${genre.id}`}
                      key={genre.id}
                      onClick={() => handleGenreClick(genre.id, genre.name)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </ul>
              )}
            </div>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
              onClick={(e) => {
                e.preventDefault(); // Ngăn NavLink xử lý mặc định
                window.location.href = "/"; // Chuyển về trang chủ và refresh
              }}
            >
              {" "}
              HOME
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {" "}
              Thành Viên
            </NavLink>
            <NavLink
              to="/phim_le"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Phim lẻ
            </NavLink>
            <NavLink
              to="/phim_bo"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Phim bộ
            </NavLink>
            <NavLink
              to="/quoc_gia"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Quốc gia
            </NavLink>
          </div>
        </>
      )}

      <div className="nav-right">
        <button>
          <SearchIcon className="searchicon" onClick={toggleSearchBar} />
        </button>
        {isSearchBarOpen && (
          <>
            <SearchBar OnSearch={handleClickSearch} />
            <ClearIcon onClick={() => setIsSBOpen(!isSearchBarOpen)} />
          </>
        )}
      </div>
    </div>
  );
};
export default NAV;
