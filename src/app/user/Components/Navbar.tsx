import React from 'react';
import { useDispatch } from 'react-redux';
import { resetTicketDetails } from '../Redux/Feautures/user/ticketSlice';
import{clearUser} from '../Redux/Feautures/user/userslice'

import { useRouter } from 'next/navigation';
import './styles/navbar.css'; // Link to the CSS file

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(resetTicketDetails());
    dispatch(clearUser())
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>User Navbar</h1>
      </div>
      <ul className="navbar-links">
        <li><a href="/user/userhome">Home</a></li>
        <li><a href="/user/theatres">Theatres</a></li>
        <li><a href="/user/history">History</a></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
