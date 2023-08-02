import { AuthContextValues } from "../@types/contexts/AuthContextValues";
import { User } from "../@types/User";
import { createContext, useState, useContext, useEffect } from "react";

import GetSessionStatus from "../api_services/GetSessionStatus";

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export const AuthContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

  // Persists the session on refreshes.
  GetSessionStatus(setCurrentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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
