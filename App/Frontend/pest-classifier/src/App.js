import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import ListPage from './pages/ListPage';
import UploadPage from './pages/UploadPage';
import Footer from './components/Footer';
import Header from './components/Header';
import HelpPage from './pages/HelpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route
          path="/*"
          element={
            <>
              <Header /> {/* Add the Header */}
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/list" element={<ListPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;