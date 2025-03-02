import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptopCode,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Header({ user, handleLogout }) {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <FontAwesomeIcon icon={faLaptopCode} className="logo-icon" />
          <h1>CS Club</h1>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/activities">Activities</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            {user ? (
              <>
                <li className="admin-link">
                  <Link to="/admin-panel">Admin Panel</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-logout">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/admin-login" className="btn btn-login">
                  <FontAwesomeIcon icon={faUser} /> Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
