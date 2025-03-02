import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLaptopCode,
  faCalendarAlt,
  faUserCog,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="./icon.png" alt="CS Club Logo" />
          CS Club
        </Link>
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li>
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li>
          <Link
            to="/activities"
            className={isActive("/activities") ? "active" : ""}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faCalendarAlt} /> Activities
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={isActive("/projects") ? "active" : ""}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faLaptopCode} /> Projects
          </Link>
        </li>
        <li>
          <Link
            to="/admin-panel"
            className={isActive("/admin-panel") ? "active" : ""}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faUserCog} /> Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
