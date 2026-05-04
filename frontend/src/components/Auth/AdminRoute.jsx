import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

export default function AdminRoute() {
  const { user } = useAuth();
  const role = user?.roleName?.toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
