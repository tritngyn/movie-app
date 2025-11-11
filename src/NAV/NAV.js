import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../Component/SearchBar";
import "./NAV.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../assets/hqh.jfif";
import { supabase } from "../supabaseClient";
library.add(faBars);
import { useNavigate } from "react-router-dom";
import useClickOutside from "../Component/hooks/useClickoutside";

const NAV = ({ onSelectGenre, handleClickSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSBOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  // 🔸 Ref cho dropdown và popup
  const menuRef = useRef(null);
  const accountRef = useRef(null);

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

  // Dùng hook click outside
  useClickOutside(menuRef, () => setIsMenuOpen(false));
  useClickOutside(accountRef, () => setShowPopup(false));

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
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Lấy user hiện tại
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Theo dõi sự thay đổi session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  return (
    <div className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        {!isSearchBarOpen && (
          <>
            <div className="nav-left" ref={menuRef}>
              <div className="navbarlinks">
                <button className="hamburger" onClick={toggleMenu}>
                  <FontAwesomeIcon icon="fa-solid fa-bars" />
                </button>
                {isMenuOpen && (
                  <ul className="dropdown-menu">
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
              <h1 className="logo">PHIM</h1>
              <NavLink to="/" end>
                HOME
              </NavLink>
              <NavLink to="/phim_le">Phim lẻ</NavLink>
              <NavLink to="/phim_bo">Phim bộ</NavLink>
            </div>
          </>
        )}

        <div className="nav-right" ref={accountRef}>
          <button className="search-btn">
            <SearchIcon className="searchicon" onClick={toggleSearchBar} />
          </button>
          {isSearchBarOpen && (
            <>
              <SearchBar OnSearch={handleClickSearch} />
              <ClearIcon onClick={() => setIsSBOpen(!isSearchBarOpen)} />
            </>
          )}
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
        </div>
      </div>
    </div>
  );
};
export default NAV;
