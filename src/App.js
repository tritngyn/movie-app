import React, { useState } from 'react';
import SearchBar from './Component/SearchBar';
import './App.css';
import MovieList from './Component/MovieList';
import SearchResults from './Component/SearchResults';
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
  //const [categoryname, setCategoryName] = useState('');


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
  const constructFetchUrl = () => {
    return `${process.env.REACT_APP_BASE_URL}/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`;
  };
  const fetchUrl = constructFetchUrl();
  
  return (
    <div className="App">
      <BrowserRouter>
        <NAV/>
        <Routes>
          <Route path='/' element={
          <>
              <SearchBar OnSearch = {handleClickSearch} />
              <SearchResults results = {searchresults} searchTerm= {searchterm}/>
              <MovieList  fetchUrl = {fetchUrl} />
          </>
            }/>
           <Route path="/user" element={<div>User Page</div>} />
        </Routes>
      </BrowserRouter>
    
    
    </div>
  );
}

export default App;
// NOTE : đặt hàm handleSearch từ file MovieList vào SearchBar
// tạo useState ở App.js, nó là kết quả Search, tạo 1 file để List ra kết quả Search