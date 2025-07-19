import React from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './NAV.css'
     library.add(faBars);

const NAV = ({onSelectGenre}) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

    const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
  ];
    const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
    const handleGenreClick = (genreID, genreName) => {
    onSelectGenre(genreID, genreName);  
    setIsMenuOpen(false);
    const movieListElement = document.querySelector('.movie-list');
    movieListElement.scrollIntoView({ behavior: 'smooth' });
  };


    return (
        <div className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} 
            end 
            onClick={(e) => {
              e.preventDefault(); // Ngăn NavLink xử lý mặc định
    window.location.href = "/"; // Chuyển về trang chủ và refresh
            }
              
             } 
            > HOME</NavLink>
            <NavLink to="/user" className={({ isActive }) => isActive ? "active" : ""}> USER</NavLink>
            <div className="navbarlinks">
                <button className="hamburger" onClick={toggleMenu}>
                     <FontAwesomeIcon icon="fa-solid fa-bars" />
                </button>
                {isMenuOpen && (
                    <ul className="dropdown-menu">
                    <li onClick={() => {onSelectGenre("", "Popular"); setIsMenuOpen(false)}}>Popular</li>
                    {genres.map((genre) => (
                        <li key={genre.id} onClick={() => handleGenreClick(genre.id, genre.name)}>
                        {genre.name}
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        </div>
       
    );
}
export default NAV;