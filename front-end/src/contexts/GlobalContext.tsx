import { GlobalContextValues } from "../@types/contexts/GlobalContextValues";
import { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext<GlobalContextValues | undefined>(undefined);

export const GlobalContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [selectedBackEnd, setSelectedBackEnd] = useState<
    "spring" | "express"
  >();

  useEffect(() => {
    console.log("selectedBackEnd", selectedBackEnd);
  }, [selectedBackEnd]);

  return (
    <GlobalContext.Provider
      value={{
        selectedBackEnd,
        setSelectedBackEnd,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider."
    );

  return context;
};
