import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";
const RequireAuth = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/login?next=${encodeURI(window.location.pathname)}`}
      state={{ from: location }}
      replace
    />
  );
};

export default RequireAuth;
