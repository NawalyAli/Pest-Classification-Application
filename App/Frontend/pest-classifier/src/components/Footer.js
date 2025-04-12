import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, } from 'react-icons/fa';
import { AiFillGithub, AiFillDiscord } from "react-icons/ai";
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Side: Logo */}
        <div className="footer-logo">
          <img src="/LogoPest.png" alt="LogoPest" />
        </div>

        {/* Center: Navigation Links */}
        <nav className="footer-nav">
          <Link to="/home">Home</Link>
          <Link to="/list">Pest Names</Link>
          <Link to="/upload">Upload Image</Link>
        </nav>

        {/* Right Side: Social Media Icons */}
        <div className="footer-social">
          <a href="https://github.com/NawalyAli/Pest-Classification-Application" target="_blank" rel="noopener noreferrer">
            <AiFillGithub />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://discord.com/servers" target="_blank" rel="noopener noreferrer">
            <AiFillDiscord />
          </a>
        </div>
      </div>

      {/* Bottom: Copyright Text */}
      <div className="footer-bottom">
        <p>Copyright &copy; 2025; Created by Nawal Ali</p>
      </div>
    </footer>
  );
}
