/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import { useAuthContext } from "../contexts/AuthContext";

// For routes that you need to be logged in for.
const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const { currentUser } = useAuthContext(),
    addToast = useToastContext();

  useEffect(() => {
    if (currentUser.sessionStatus === null)
      addToast("You must log in to enter this page!", "error");
  }, [currentUser.sessionStatus]);

  return currentUser.sessionStatus ? (
    children
  ) : (
    <Navigate to="/select" replace={true} />
  );
};

export default PrivateRoute;
