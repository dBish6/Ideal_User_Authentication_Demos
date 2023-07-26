/* User Authentication Demo

   Author: David Bishop
   Creation Date: July 13, 2023
*/

import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import ColorPropertiesOnBackendType from "./utils/ColorPropertiesOnBackendType";

import Header from "./components/partials/header";
import Footer from "./components/partials/footer";
import Select from "./pages/Select";
const LoginRegister = lazy(() => import("./pages/LoginRegister"));

const Structure = () => {
  ColorPropertiesOnBackendType();

  return (
    <>
      <div role="presentation" className="contentWrapper">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Structure />}>
            <Route path="/" element={<Navigate to="/select" />} />
            <Route
              path="/select"
              element={<Select title="Choose a Back-end" />}
            />
            <Route
              path="/register"
              element={<LoginRegister title="Register" />}
            />
            <Route path="/users" element={<LoginRegister title="Register" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
