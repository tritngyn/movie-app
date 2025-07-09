import React, { useState } from "react";
import axios from "axios";
//import "./SearchBar.css";



function SearchBar({OnSearch}){
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }
    const handleSubmit =(event) =>{
        event.preventDefault();
        OnSearch(searchTerm);
        console.log("-> send movie title", searchTerm);
    }
    return (
        <>
        <form className="search_bar" onSubmit={handleSubmit} >
            <input
                type="text"
                value={searchTerm}
                placeholder="Nhap ten phim"
                onChange={handleInputChange}
                className="search-input" 
                />
            <button type="submit" className="submit_button" >Tìm</button>
        </form>
        
        </>
    );
}export default SearchBar;