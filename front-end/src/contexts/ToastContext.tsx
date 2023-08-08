import {
  ToastContextValues,
  ToastState,
  ToastStatuses,
} from "../@types/contexts/ToastTypes";

import { createContext, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { nanoid } from "nanoid";

import Toast from "../components/toast";

export const ToastContext = createContext<ToastContextValues>(() => {});

export const ToastContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = (msg: string, type: ToastStatuses) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: nanoid(), message: msg, type: type },
    ]);

  const close = (id: string) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {createPortal(
        <div
          className="toastsWrapper"
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "1rem",
            zIndex: "10",
          }}
        >
          {toasts &&
            toasts.map((toast) => (
              <div role="none" key={toast.id}>
                <Toast close={() => close(toast.id)} state={toast} />
              </div>
            ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error(
      "useToastContext must be used within a ToastContextProvider."
    );

  return context;
};
