import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const user = JSON.parse(sessionStorage.getItem("encanto_user"));
    console.log(user, 'PROTECTED ROUTE USER');
    console.log(allowedRoles, 'PROTECTED ROUTE ALLOWED ROLES');
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.cargo)) {
    return <Navigate to="/home" />; 
  }

  return <Outlet />;
}