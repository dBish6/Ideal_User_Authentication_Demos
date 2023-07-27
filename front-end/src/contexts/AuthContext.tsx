import { AuthContextValues } from "../@types/contexts/AuthContextValues";
import { CurrentUser } from "../@types/CurrentUser";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export const AuthContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

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
