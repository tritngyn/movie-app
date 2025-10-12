import React, { useEffect, useState } from "react";
import "./App.css";
import MovieList from "./Component/MovieList";
import SearchResults from "./Component/SearchResults";
import Favorite from "./Component/Favortite";
import axios from "axios";
import NAV from "./NAV/NAV";
import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HeroSection from "./Component/HeroSection";
import "./Component/HeroSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import MList from "./Component/MList";
import Footer from "./Component/Footer";
import MovieDetail from "./Component/MovieDetail";
import GenreList from "./Component/GenreList";
function App() {
  const [searchterm, setSearchTerm] = useState("");
  const [searchresults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favmovie, setFavmovies] = useState([]);
  const [categoryName, setCategoryName] = useState("Popular");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const savedFavHistory = localStorage.getItem("searchFavHistory");
    if (savedFavHistory) {
      setFavmovies(JSON.parse(savedFavHistory));
    }
  }, []);
  const handleClickSearch = async (term) => {
    console.log("search movie:", term);
    setSearchTerm(term);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${term}`
      );
      setSearchResults(response.data.results || []);
      const moviesGrid = document.querySelector(".movies-grid");
      if (moviesGrid) {
        moviesGrid.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  //hàm cập nhập Favorite Movie
  const handleAddFav = (movie) => {
    toast("Add success!", movie.title);
    const updatedFavHistory = [
      movie,
      ...favmovie.filter((item) => item.id !== movie.id),
    ].slice(0, 10);
    setFavmovies(updatedFavHistory);
    localStorage.setItem("searchFavHistory", JSON.stringify(updatedFavHistory));
    console.log("add movie:", movie.title || movie.name);
  };
  const DeleteFav = (movie) => {
    const newFav = favmovie.filter((item) => item !== movie);
    setFavmovies(newFav);
    localStorage.setItem(`searchFavHistory`, JSON.stringify(newFav));
  };
  const handleSelectGenre = (genreID, genreName) => {
    setSelectedGenre(genreID);
    setCategoryName(genreName);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <NAV
          onSelectGenre={handleSelectGenre}
          handleClickSearch={handleClickSearch}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection categoryName={"Movie"} />
                <Swiper />
                <MList categoryName={"Horror"} handleAddFav={handleAddFav} />
                <MList categoryName={"Action"} handleAddFav={handleAddFav} />
                <MList categoryName={"Comedy"} hasndleAddFav={handleAddFav} />
                <MList categoryName={"TV"} handleAddFav={handleAddFav} />
                <MList categoryName={"Movie"} handleAddFav={handleAddFav} />
              </>
            }
          />
          <Route
            path="/searchresult"
            element={
              <SearchResults
                results={searchresults}
                searchTerm={searchterm}
                handleAddFav={handleAddFav}
              />
            }
          />
          <Route
            path="/user"
            element={
              <>
                <Favorite
                  results={searchresults}
                  favmovie={favmovie.filter(
                    (movie) => movie && movie.poster_path
                  )}
                  DeleteFav={DeleteFav}
                />
              </>
            }
          />
          <Route
            path="/phim_le"
            element={
              <MovieList categoryName={"Movie"} handleAddFav={handleAddFav} />
            }
          />

          <Route
            path="/phim_bo"
            element={
              <MovieList categoryName={"TV"} handleAddFav={handleAddFav} />
            }
          />
          {/* Danh mục thể loại */}
          <Route
            path="/the_loai/:genre"
            element={
              <GenreList
                categoryName={categoryName}
                handleAddFav={handleAddFav}
              />
            }
          />
          {/* Chi tiết phim */}
          <Route path="/:category/:id" element={<MovieDetail />} />

          {/* Quốc gia (tùy chọn) */}
          <Route path="/quoc_gia" element={<div>Hello</div>} />
        </Routes>
      </BrowserRouter>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;
// NOTE : đặt hàm handleSearch từ file MovieList vào SearchBar
// tạo useState ở App.js, nó là kết quả Search, tạo 1 file để List ra kết quả Search
