import React from 'react';
import { useDispatch } from 'react-redux';
import { resetTicketDetails } from '../Redux/Feautures/user/ticketSlice';
import{clearUser} from '../Redux/Feautures/user/userslice'

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import './styles/navbar.css'; 
function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  //on clicking logout details regarding the user and his booking are all cleared from localstorage and redux
  const handleLogout = () => {
    localStorage.clear();
    dispatch(resetTicketDetails());
    sessionStorage.clear()
    dispatch(clearUser())
    router.push('/');
  };
  const userProfile = useSelector((state: RootState) => state.user)
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* if user is loginned then a name is stored in redux and it will be displayed and if no user is there then user is showed */}
      <p>{userProfile?.name ? userProfile.name : "user"}</p>
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
