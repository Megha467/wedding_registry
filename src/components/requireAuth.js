import { Navigate } from "react-router-dom";
import { getToken } from "../apis/service";

function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

export default RequireAuth;
