// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { FaBug, FaUpload } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Bug Icon - Navigate to List Page */}
      <div className="home-option" onClick={() => navigate('/list')}>
        <FaBug size={80} className="home-icon" />
        <p>List of Pests in Our Database</p>
      </div>

      {/* Upload Icon - Navigate to Upload Page */}
      <div className="home-option" onClick={() => navigate('/upload')}>
        <FaUpload size={80} className="home-icon" />
        <p>Upload Your Pest Image</p>
      </div>
    </div>
  );
}
