import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faCode,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">CS Club</h3>
          <p className="footer-description">
            Empowering students through coding, collaboration, and creativity.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/QAD6675"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:contact@csclub.com" aria-label="Email">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a
              href="https://discord.gg/csclub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FontAwesomeIcon icon={faDiscord} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 CS Club. All rights reserved.</p>
        <p>Last updated: 2025-03-02</p>
      </div>
    </footer>
  );
}

export default Footer;
