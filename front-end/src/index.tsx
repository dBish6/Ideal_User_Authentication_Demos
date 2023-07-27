import ReactDOM from "react-dom/client";
import "./index.css";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GlobalContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </GlobalContextProvider>
);
