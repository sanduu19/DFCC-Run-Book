import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import logoN from '../assets/logo.svg'
import '../css/Navbar.css';


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

    return (
        <header className="Navbar">
            <nav>
                <NavLink to="/user">
                    Run Book
                </NavLink>
                <NavLink to="/user/sheet">
                    Summary
                </NavLink>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <img src={logoN} alt="Company Logo" className='logo_c' />
        </header>
    )
}
