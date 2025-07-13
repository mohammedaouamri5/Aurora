import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { routePermissions } from "./routePermissions";

const PortectedRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1]; // Get the base route

  const requiredPermission = routePermissions[currentPath];
  const hasPermission = requiredPermission
    ? user?.permissions.includes(requiredPermission)
    : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PortectedRoutes;
