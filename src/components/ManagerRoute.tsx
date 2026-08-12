import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManagerRoute = () => {
  const { loading, isAuthenticated, isManager } = useAuth();
  const location = useLocation();

  // Wait until we know whether the user is logged in
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF9]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DDEFE7] border-t-[#0F5C4D]" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Logged in but not a manager
  if (!isManager) {
    return <Navigate to="/" replace />;
  }

  // Manager
  return <Outlet />;
};

export default ManagerRoute;