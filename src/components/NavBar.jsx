import { NavLink, useNavigate } from "react-router-dom";

import { removeToken } from "../utils/token";
import Logo from "./Logo";
import "./styles/NavBar.css";

import { useContext } from "react";
import AppContext from "../contexts/AppContext"; // to set up context subscription

function NavBar() {
  // use state setIsLoggedIn as prop from App.js
  const navigate = useNavigate(); // invoke hook that enables naviation between routes / use to navigate user
  const { setIsLoggedIn } = useContext(AppContext);

  function signOut() {
    removeToken();
    navigate("/login");
    setIsLoggedIn(false);
  }

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Ducks
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            My Profile
          </NavLink>
        </li>
        <li>
          <button onClick={signOut} className="navbar__link navbar__button">
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
