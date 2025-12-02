import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../Component/SearchBar";
import "./NAV.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import useClickOutside from "../Component/hooks/useClickoutside";

library.add(faBars, faTimes);

const NAV = ({ onSelectGenre, handleClickSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownGenre, setDropDown] = useState(false);
  const [isSearchBarOpen, setIsSBOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const accountRef = useRef(null);
  const genreDropdownRef = useRef(null); // Cho desktop dropdown
  const mobileMenuRef = useRef(null); // Cho mobile menu

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

  useClickOutside(accountRef, () => setShowPopup(false));
  useClickOutside(mobileMenuRef, () => setIsMenuOpen(false));
  useClickOutside(genreDropdownRef, () => setDropDown(false));
  const toggleSearchBar = () => {
    setIsSBOpen(!isSearchBarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toogleGenre = () => {
    setDropDown(!dropdownGenre);
    console.log("drop down genre");
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
    setDropDown(false);
  };
  const handleGenreClick = (genreID, genreName) => {
    console.log("pick genre");
    onSelectGenre(genreID, genreName);
    const movieListElement = document.querySelector(".movie-list");
    if (movieListElement)
      movieListElement.scrollIntoView({ behavior: "smooth" });

    setIsMenuOpen(false); // Đóng mobile menu
    setDropDown(false); // Đóng dropdown genre
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-left">
            <h1 className="logo">PHIM</h1>

            {/* Desktop Links - Hidden on Mobile */}
            <div className="desktop-links">
              <NavLink to="/" end>
                HOME
              </NavLink>
              <NavLink to="/phim_le">Phim lẻ</NavLink>
              <NavLink to="/phim_bo">Phim bộ</NavLink>

              {/* Genre Dropdown for Desktop */}
              <div className="genre-dropdown" ref={genreDropdownRef}>
                <button className="genre-trigger" onClick={toogleGenre}>
                  Thể loại
                </button>
                {dropdownGenre && (
                  <div className="dropdown-menu">
                    {genres.map((genre) => (
                      <Link
                        to={`/the_loai/${genre.id}`}
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.id, genre.name)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="nav-right" ref={accountRef}>
            {!isSearchBarOpen ? (
              <>
                <button className="search-btn" onClick={toggleSearchBar}>
                  <SearchIcon className="searchicon" />
                </button>

                <div className="account-container">
                  <button
                    className="account-btn"
                    onClick={() => {
                      if (user) setShowPopup(!showPopup);
                      else navigate("/auth");
                    }}
                  >
                    <AccountCircleIcon />
                  </button>

                  {showPopup && user && (
                    <div className="account-popup">
                      <p className="username">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <NavLink to="/user">Thành viên</NavLink>
                      <div className="divider" />
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setShowPopup(false);
                          navigate("/");
                        }}
                        className="logout-btn"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Hamburger */}
                <button className="hamburger-mobile" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>
              </>
            ) : (
              <>
                <SearchBar OnSearch={handleClickSearch} />
                <button className="close-search" onClick={toggleSearchBar}>
                  <ClearIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="nav-overlay" />}

      {/* Mobile Slide-in Menu */}
      <div
        className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
        ref={mobileMenuRef}
      >
        <div className="mobile-menu-content">
          <NavLink to="/" end onClick={handleMobileLinkClick}>
            HOME
          </NavLink>
          <NavLink to="/phim_le" onClick={handleMobileLinkClick}>
            Phim lẻ
          </NavLink>
          <NavLink to="/phim_bo" onClick={handleMobileLinkClick}>
            Phim bộ
          </NavLink>

          <div className="mobile-genres" ref={genreDropdownRef}>
            <button className="genre-trigger" onClick={toogleGenre}>
              Thể loại
            </button>
            {dropdownGenre && (
              <div className="dropdown-menu" style={{ position: "relative" }}>
                {genres.map((genre) => (
                  <Link
                    to={`/the_loai/${genre.id}`}
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NAV;
