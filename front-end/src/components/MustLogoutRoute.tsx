/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import { useAuthContext } from "../contexts/AuthContext";

// For routes that the user needs to be logged out; for the forms.
const MustLogoutRoute = ({ children }: { children: React.JSX.Element }) => {
  const { currentUser } = useAuthContext(),
    addToast = useToastContext();

  useEffect(() => {
    if (currentUser.sessionStatus)
      addToast("Log out to enter the register page.", "error");
  }, [currentUser.sessionStatus]);

  return !currentUser.sessionStatus ? (
    children
  ) : (
    <Navigate to=".." replace={true} />
  );
};

export default MustLogoutRoute;
