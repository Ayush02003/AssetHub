import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authUser } = useAuthContext();

  if (!authUser || !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
