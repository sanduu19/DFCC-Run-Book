import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import logoN from '../assets/logo.svg'
import '../css/Navbar.css';
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


export default function UserHeader() {
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        localStorage.setItem("user", "");
        navigate("/");
    }
    const userEmail=localStorage.getItem('user');
    const loginName=localStorage.getItem('loginName');
    const[loading,setLoading]=useState(false);
    useEffect(()=>{
       setLoading(true)
       setTimeout(()=>{
           setLoading(false)

       },8000)

    },[])

    return (
        <header className="Navbar">
            <nav>
                <NavLink onClick={()=>  {loading} } to="/user">
                    Run Book
                </NavLink>
                <NavLink to="/user/sheet">
                    Summary
                </NavLink>
                <NavLink to="/user/analytics">
                    Analytics
                </NavLink>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <div className="NavbarUser">
                Welcome , <b>{loginName} - {userEmail}</b>
            </div>
            <img src={logoN} alt="Company Logo" className='logo_c' />
        </header>
    )
}
