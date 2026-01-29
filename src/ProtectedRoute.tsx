// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext.tsx";
import Loader from './components/Loader';
import { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, authIsLoading } = useAuthContext();

  if (authIsLoading) {
    return <Loader />; // block until auth is known
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
