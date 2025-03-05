import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import AppContext from "../contexts/AppContext";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import "./styles/App.css";
import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { setToken, getToken } from "../utils/token";
import { useEffect } from "react";
import "../utils/api";
import * as auth from "../utils/auth";
import * as api from "../utils/api";

function App() {
  // state variables
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // all logic depends onwhether or not use is logged in

  //  TO ENABLE NAVIGATION BETWEEN ROUTES
  const navigate = useNavigate();

  // // Invoke the hook. It's necessary to invoke the hook in both
  // components.
  const location = useLocation();

  // Single scan for JWT at first page load / jwt set from jwt.js helper function

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    // if token is present send getUserInfo api reqest to confirm user's authentic jwt from api.js
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        // If the response is successful, log the user in, save their
        // data to state, and navigate them to /ducks.
        setIsLoggedIn(true);
        setUserData({ username, email });
        //navigate("/ducks"); // REMOVED as authentication allows redirection to prev page or other instead
      })
      .catch(console.error);
  }, []);

  // handlers
  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }

    // We pass the username and password as positional arguments. The
    // authorize function is set up to rename `username` to `identifier`
    // before sending a request to the server, because that is what the
    // API is expecting.

    auth
      .authorize(username, password)
      .then((data) => {
        // Verify that a jwt is included before logging the user in.
        if (data.jwt) {
          setToken(data.jwt); // save token to local storage!
          setUserData(data.user); // save user's data to state
          setIsLoggedIn(true); // log the user in

          // After login, instead of navigating always to /ducks,
          // navigate to the location that is stored in state. If
          // there is no stored location, we default to
          // redirecting to /ducks.
          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath);
        }
      })
      .catch(console.error);
  };

  // if confirmed, goes to auth to fetch
  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          // TODO: handle succesful registration

          // Navigate user to login page.
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // wrapped in div, remember React expects a single root element!!!

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute>
              <Ducks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile userData={userData} />
            </ProtectedRoute>
          }
        />

        {/* Wrap our /login and /registration route in a ProtectedRoute. Make sure to 
      specify the anoymous prop, to redirect logged-in users 
      to "/". */}

        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous>
              <div className="loginContainer">
                <Login handleLogin={handleLogin} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute anonymous>
              <div className="registerContainer">
                <Register handleRegistration={handleRegistration} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/ducks" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
