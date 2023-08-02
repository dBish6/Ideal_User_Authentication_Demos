import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

// For routes that you need to be logged in for.
const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const { currentUser } = useAuthContext();
  // TODO: const toast = useToast();
  !currentUser && console.log("You must log in to enter this page!");

  return currentUser ? children : <Navigate to="/select" replace={true} />;
};

export default PrivateRoute;
