import React, { useEffect, useState } from 'react';
import SearchBar from './Component/SearchBar';
import './App.css';
import MovieList from './Component/MovieList';
import SearchResults from './Component/SearchResults';
import Favorite from './Component/Favortite';
import axios from 'axios';
import NAV from './NAV/NAV';

import {
  BrowserRouter,
  Routes,
  Route,
  
} from "react-router-dom";

//import './NAV/NAV.css'

function App() {
  const [searchterm, setSearchTerm] = useState('');
  const [searchresults, setSearchResults] = useState([]);
  const [movies, setSearchmovies] = useState([]);
  const [loading ,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favmovie, setFavmovies] = useState([]);
  const [categoryName, setCategoryName] = useState('Popular');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
      const savedFavHistory = localStorage.getItem('searchFavHistory');
       if (savedFavHistory) {
        setFavmovies(JSON.parse(savedFavHistory));
      }
  },[]);

  //   const handleSearch = async (searchTerm) => {
  //   const searchUrl = `${process.env.REACT_APP_BASE_URL}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${searchTerm}`;
  //   try {
  //     const response = await fetch(searchUrl);
  //     const data = await response.json();
  //     setSearchResults(data.results);
  //     setCategoryName(`Search Results: ${searchTerm}`);
  //   } catch (error) {
  //     console.error("Search error:", error);
  //   }
  // };
      const handleClickSearch = async (term) => {
        setSearchTerm(term)
        setLoading(true);
        try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${term}`
        );
        setSearchResults(response.data.results || []);
        const moviesGrid = document.querySelector('.movies-grid');
        if (moviesGrid) {
            moviesGrid.scrollIntoView({ behavior: 'smooth' });
        }
        } catch (error) {
        console.error("Error fetching search results:", error);
        } finally {
        setLoading(false);
        }
  }; 

  const constructFetchUrl = (genreID) => {
    if (genreID) {
      return `${process.env.REACT_APP_BASE_URL}/discover/movie?with_genres=${genreID}&api_key=${process.env.REACT_APP_API_KEY}`;
    }
    return `${process.env.REACT_APP_BASE_URL}/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`;
  };

  // lấy địa chỉ URL từ hàm bên trên
  const fetchUrl = constructFetchUrl(selectedGenre);

  //hàm cập nhập Favorite Movie
   const handleAddFav = (movie) => {
      const updatedFavHistory = [movie, ...favmovie.filter(item => item.id !== movie.id)].slice(0, 10);
      setFavmovies(updatedFavHistory);
      localStorage.setItem('searchFavHistory', JSON.stringify(updatedFavHistory));
      console.log('add movie:', movie.title || movie.name)
    };
    const DeleteFav = (movie) => {
      const newFav = favmovie.filter(item => item !== movie) ;
      setFavmovies(newFav);
      localStorage.setItem(`searchFavHistory`, JSON.stringify(newFav));
    };
  const handleSelectGenre = (genreID, genreName ) => {
      setSelectedGenre(genreID);
      setCategoryName(genreName);
    };
  return (
    <div className="App">
      <BrowserRouter>
        <NAV onSelectGenre = {handleSelectGenre} />
        <Routes>
          <Route path='/' element={
          <>
              <SearchBar OnSearch = {handleClickSearch} />
              <SearchResults results = {searchresults} searchTerm= {searchterm} handleAddFav ={handleAddFav}/>
              <MovieList  fetchUrl = {fetchUrl} categoryName={categoryName} handleAddFav ={handleAddFav}/>
          </>
            }/>
           <Route path="/user" element={
            <>
            <Favorite results = {searchresults}  favmovie = {favmovie.filter(movie => movie && movie.poster_path)}  />
            </>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
// NOTE : đặt hàm handleSearch từ file MovieList vào SearchBar
// tạo useState ở App.js, nó là kết quả Search, tạo 1 file để List ra kết quả Search