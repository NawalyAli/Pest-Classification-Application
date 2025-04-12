import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaBug } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* Left Side: Bug Icon */}
      <div className="header-icon">
        <FaBug size={60} />
      </div>

      {/* Center: Title */}
      <h1 className="header-title">The Pest Portal</h1>

      {/* Right Side: Help Button */}
      <button className="header-help" onClick={() => navigate('/help')}>
        HELP
      </button>
    </header>
  );
}
