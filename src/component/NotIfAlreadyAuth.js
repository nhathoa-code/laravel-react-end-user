import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";
const NotIfAlreadyAuth = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  return !user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
export default NotIfAlreadyAuth;
