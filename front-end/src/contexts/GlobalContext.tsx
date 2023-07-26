import { GlobalContextValues } from "../@types/GlobalContextValues";
import { createContext, useState, useContext, useEffect } from "react";

const GlobalContextContext = createContext<GlobalContextValues | undefined>(
  undefined
);

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
    <GlobalContextContext.Provider
      value={{
        selectedBackEnd,
        setSelectedBackEnd,
      }}
    >
      {children}
    </GlobalContextContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextValues => {
  const context = useContext(GlobalContextContext);
  if (!context)
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider."
    );

  return context;
};
