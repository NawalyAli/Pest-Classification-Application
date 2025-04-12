// SplashScreen.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css'; // Ensure you create a CSS file for styling

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to Home page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img 
        src="/LogoPest.png"
        alt="Pest Portal Logo"
        className="splash-logo"
      />
    </div>
  );
}
