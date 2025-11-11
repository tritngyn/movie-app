import React, { useEffect, useState } from "react";
import "./App.css";
import MovieList from "./Component/MovieList/MovieList";
import SearchResults from "./Component/SearchResults";
import User from "./Component/User/User";
import axios from "axios";
import NAV from "./NAV/NAV";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./Component/HeroSection";
import MList from "./Component/MovieList/MList";
import Footer from "./Component/Footer";
import MovieDetail from "./Component/MovieList/MovieDetail";
import GenreList from "./Component/MovieList/GenreList";
import Auth from "./Component/User/Auth";
import { supabase } from "./supabaseClient";
import FilterResults from "./Component/FilterResults";

function App() {
  const [searchterm, setSearchTerm] = useState("");
  const [searchresults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favmovie, setFavmovies] = useState([]);
  const [categoryName, setCategoryName] = useState("Popular");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.subscription.unsubscribe();
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

  const DeleteFav = (movie) => {
    const newFav = favmovie.filter((item) => item !== movie);
    setFavmovies(newFav);
    localStorage.setItem("searchFavHistory", JSON.stringify(newFav));
  };
  const handleSelectGenre = (genreID, genreName) => {
    setSelectedGenre(genreID);
    setCategoryName(genreName);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <NAV
          user={user}
          onSelectGenre={handleSelectGenre}
          handleClickSearch={handleClickSearch}
        />
        <Routes>
          <Route path="/auth" element={<Auth />}></Route>
          <Route
            path="/"
            element={
              <>
                <HeroSection categoryName={"Movie"} />
                <div
                  className="movie-section"
                  style={{
                    padding: "20px",
                    borderTop: "1px solid #222",
                    borderBottom: "1px solid #222",
                    borderRadius: "12px",
                  }}
                >
                  <MList categoryName={"Horror"} />
                  <MList categoryName={"Action"} />
                  <MList categoryName={"Comedy"} />
                  <MList categoryName={"TV"} />
                  <MList categoryName={"Movie"} />
                </div>
              </>
            }
          />
          <Route path="/searchresult" element={<SearchResults />} />

          <Route
            path="/user"
            element={
              <>
                <User
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
            element={<MovieList categoryName={"Movie"} />}
          />
          <Route path="/phim_bo" element={<MovieList categoryName={"TV"} />} />
          {/* Danh mục thể loại */}
          <Route
            path="/the_loai/:genre"
            element={<GenreList categoryName={categoryName} />}
          />
          {/* Chi tiết phim */}
          <Route path="/:category/:id" element={<MovieDetail />} />
          <Route path="/filter-results" element={<FilterResults />} />
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
