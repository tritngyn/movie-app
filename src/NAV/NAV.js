import React from "react";
import { NavLink } from "react-router-dom";

function NAV(){
    return (
        <div className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>HOME</NavLink>
            <NavLink to="/user" className={({ isActive }) => isActive ? "active" : ""}> USER </NavLink>
        </div>
       
    );
}
export default NAV;