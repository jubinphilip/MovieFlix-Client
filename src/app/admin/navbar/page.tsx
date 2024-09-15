import React from 'react';
import './navbar.css'; // Import the CSS file

function Navbar() {
  return (
    <div className="navbar-container">
      <h1 className="navbar-header">MovieFlix Admin Panel</h1>
      <ul className="navbar-menu">
        <li><a href="/admin/addmovies">Add Movies</a></li>
        <li><a href="/admin/addtheatres">Add Theatres</a></li>
        <li><a href="/admin/view">View Data</a></li>
        <li><a href="/admin/manageshows">Manage Shows</a></li>
      </ul>
    </div>
  );
}

export default Navbar;
