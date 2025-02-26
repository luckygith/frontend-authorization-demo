import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children, anonymous = false }) {
  // Invoke the useLocation hook and access the value of the
  // 'from' property from its state object. If there is no 'from'
  // property we default to "/".
  const location = useLocation();
  const from = location.state?.from || "/";

  // If the user is logged in we redirect them away from our
  // anonymous routes.
  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  // If a user is not logged in and tries to access a route that
  // requires authorization, we redirect them to the /login route./
  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ form: location }} />; // was "replace"
  }
  // While redirecting to /login we set the location objects
  // state.from property to store the current location value.
  // This allows us to redirect them appropriately after they
  // log in.
  return children;
}
// ^ While redirecting to /login we set the location objects
// state.from property to store the current location value.
// This allows us to redirect them appropriately after they
// log in.

export default ProtectedRoute;
