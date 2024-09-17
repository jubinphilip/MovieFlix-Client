import React, { useState } from 'react';
import { TiThMenu } from "react-icons/ti";
import { RiCloseLargeFill } from "react-icons/ri";
import './navbar.css';
import { useRouter } from 'next/navigation';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const router=useRouter()
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <div className="navbar-container">
      {/* Desktop Navbar */}
      <nav className="navbar">
        <h1 className="navbar-header">MovieFlix Admin Panel</h1>
        <ul className="navbar-menu">
          <li><a href="/admin/addmovies">Add Movies</a></li>
          <li><a href="/admin/addtheatres">Add Theatres</a></li>
          <li><a href="/admin/view">View Data</a></li>
          <li><a href="/admin/manageshows">Manage Shows</a></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="mobile-nav">
        <div className="mobile-nav-header">
          <h1 className="navbar-header">MovieFlix Admin</h1>
          <button className="menu-toggle" onClick={toggleMenu}>
            <TiThMenu />
          </button>
        </div>
        <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="responsive-navbar-menu">
            <li className="close-menu">
              <button onClick={toggleMenu}>
                <RiCloseLargeFill />
              </button>
            </li>
            <li><a href="/admin/addmovies" onClick={toggleMenu}>Add Movies</a></li>
            <li><a href="/admin/addtheatres" onClick={toggleMenu}>Add Theatres</a></li>
            <li><a href="/admin/view" onClick={toggleMenu}>View Data</a></li>
            <li><a href="/admin/manageshows" onClick={toggleMenu}>Manage Shows</a></li>
            <li><button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;