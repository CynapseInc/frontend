import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const storedUser = localStorage.getItem("encanto_user") || sessionStorage.getItem("encanto_user");
  
  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log(user, 'PROTECTED ROUTE USER');
  console.log(allowedRoles, 'PROTECTED ROUTE ALLOWED ROLES');

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.cargo)) {

    if(user.cargo !== "Administrador" && user.cargo !== "Manufatura" && user.cargo !== "Social Media"){
      return <Navigate to="/login" />;
    } 
    return <Navigate to="/home" />; 
  }

  return <Outlet />;
}