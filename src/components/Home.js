import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faLaptopCode } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to CS Club</h1>
        <p className="hero-text">
          Empowering students through coding, collaboration, and innovation
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <FontAwesomeIcon icon={faCalendarAlt} className="feature-icon" />
          <h2>Club Activities</h2>
          <p>Join our workshops, hackathons, and learning sessions.</p>
          <Link to="/activities" className="feature-link">View Activities</Link>
        </div>

        <div className="feature-card">
          <FontAwesomeIcon icon={faLaptopCode} className="feature-icon" />
          <h2>Our Projects</h2>
          <p>Explore the amazing projects built by our members.</p>
          <Link to="/projects" className="feature-link">View Projects</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
