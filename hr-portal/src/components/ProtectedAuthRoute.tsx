import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


const ProtectedAuthRoute= () => {
  const { accessToken, user } = useSelector((state:RootState) => state.auth);

  if (accessToken && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuthRoute;
