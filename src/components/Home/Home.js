import React from 'react';
import { Link } from 'react-router-dom';
import { FaGg as FaGate, FaCode, FaTrophy, FaChalkboardTeacher } from 'react-icons/fa';
import './Home.css';

function Home() {
  return (
    <>
      <div className="home-container">
        {/* --- Hero Section --- */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Welcome to ScoreCraft</h1>
              <p className="hero-subtitle">
                ScoreCraft is your dedicated platform for GATE preparation, mastering hackathons, and excelling in technical exams. Join our community to build skills and achieve your goals.
              </p>
              <Link to="/events" className="hero-button">View Upcoming Events</Link>
            </div>
            <div className="hero-image">
              <img src="https://res.cloudinary.com/dbroxheos/image/upload/v1741861300/DALL_E_2025-03-13_15.49.04_-_A_modern_sleek_logo_for_GATE_Preparation_._The_design_should_be_professional_and_academic_incorporating_elements_like_a_graduation_cap_books_or_a_wb2rzb.webp" alt="ScoreCraft Community" />
            </div>
          </div>
        </section>

        {/* --- What We Offer Section --- */}
        <section className="offer-section">
          <div className="offer-content">
            <h2 className="section-title">What We Offer</h2>
            <div className="offer-cards">
              <div className="offer-card">
                <FaGate className="offer-icon" />
                <h3 className="offer-card-title">GATE Preparation</h3>
                <p>Structured guidance and resources to help you ace the GATE exam.</p>
              </div>
              <div className="offer-card">
                <FaCode className="offer-icon" />
                <h3 className="offer-card-title">Hackathon Training</h3>
                <p>From ideation to execution, we prepare you to win competitive hackathons.</p>
              </div>
              <div className="offer-card">
                <FaTrophy className="offer-icon" />
                <h3 className="offer-card-title">Competitive Exams</h3>
                <p>Sharpen your problem-solving skills for various technical and coding exams.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Meet Our Mentors Section --- */}
        <section className="mentors-intro-section">
          <div className="mentors-intro-content">
            <FaChalkboardTeacher className="mentors-intro-icon" />
            <h2 className="section-title">Guidance from Experts</h2>
            <p className="mentors-intro-text">
              Our experienced mentors are here to provide personalized guidance for your academic and career goals, helping you navigate the challenges of exams and competitions.
            </p>
            <Link to="/mentors" className="hero-button">Meet Our Mentors</Link>
          </div>
        </section>
      </div>
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} ScoreCraft. All rights reserved.</p>
        <p>Follow us on <a href="https://www.linkedin.com/in/scorecraftkare/" target="_blank" rel="noopener noreferrer">LinkedIn</a> for updates.</p>
      </div>
    </>
  );
}

export default Home;
