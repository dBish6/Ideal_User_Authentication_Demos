import { AuthContextValues } from "../@types/contexts/AuthContextValues";
import { CurrentUser } from "../@types/CurrentUser";
import { createContext, useState, useContext, useEffect } from "react";

import GetSessionStatus from "../api_services/GetSessionStatus";
import PostSessionRefresh from "../api_services/PostSessionRefresh";
import PostLogout from "../api_services/PostLogout";

import { useToastContext } from "./ToastContext";

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export const AuthContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
      user: null,
      sessionStatus: localStorage.getItem("loggedIn") ? true : null,
    }),
    handleLogout = PostLogout(),
    addToast = useToastContext();

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

  const logOutUser = async () => {
    const res = await handleLogout();
    if (res && res.status === 200) {
      setCurrentUser({ user: null, sessionStatus: null });
      localStorage.removeItem("loggedIn");
      addToast("User session timed out.", "success");
    }
  };

  // Persists the session on refreshes.
  GetSessionStatus(currentUser, setCurrentUser, logOutUser);
  // Refreshes user session in the background if access token is expired.
  PostSessionRefresh(currentUser, setCurrentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuthContext must be used within a AuthContextProvider."
    );

  return context;
};
