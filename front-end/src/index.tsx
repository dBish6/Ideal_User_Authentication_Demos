import ReactDOM from "react-dom/client";
import "./index.css";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { ToastContextProvider } from "./contexts/ToastContext";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GlobalContextProvider>
    <ToastContextProvider>
      <App />
    </ToastContextProvider>
  </GlobalContextProvider>
);
