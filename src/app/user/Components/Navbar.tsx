import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store'
import { resetTicketDetails } from '../Redux/Feautures/user/ticketSlice';
import { clearUser } from '../Redux/Feautures/user/userslice';
import { TiThMenu } from "react-icons/ti";
import { RiCloseLargeFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import './styles/navbar.css';

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const userProfile = useSelector((state: RootState) => state.user)
  const[userid,setUserid]=useState('')
  useEffect(()=>
    {
         const userid = userProfile.userid
      setUserid(userid)
    })
   

//when pressing logout redux session and localsorage needs to be cleared
  const handleLogout = () => {
    localStorage.clear();
    dispatch(resetTicketDetails());
    sessionStorage.clear();
    dispatch(clearUser());
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <p>{userProfile?.name ? userProfile.name : "User"}</p>
        </div>
        <ul className="navbar-links">
          <li><a href="/user/userhome">Home</a></li>
          <li><a href="/user/theatres">Theatres</a></li>
          <li><a href="/user/history">History</a></li>
          {userid ? <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>:   <li><a href="/user/signin">History</a></li>}
        </ul>
      </nav>
      {/* Navbar for Mobile device */}
      <nav className="mobile-nav">
        <div className="mobile-nav-header">
          <div className="navbar-brand">
            <p>{userProfile?.name ? userProfile.name : "User"}</p>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            <TiThMenu />
          </button>
        </div>
        <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="responsive-navbar-links">
            <li className="close-menu">
              <button onClick={toggleMenu}>
                <RiCloseLargeFill />
              </button>
            </li>
            <li><a href="/user/userhome" onClick={toggleMenu}>Home</a></li>
            <li><a href="/user/theatres" onClick={toggleMenu}>Theatres</a></li>
            <li><a href="/user/history" onClick={toggleMenu}>History</a></li>
            <li><button className="logout-btn" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
