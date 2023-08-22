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

import Header from "./components/partials/header";
import Footer from "./components/partials/footer";
import OverlayLoader from "./components/loaders/OverlayLoader";
import PrivateRoute from "./components/PrivateRoute";
import MustLogoutRoute from "./components/MustLogoutRoute";

import Select from "./pages/Select";
import Users from "./pages/Users";
import Error401 from "./pages/errors/Error401";
import Error403 from "./pages/errors/Error403";
import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

import { AuthContextProvider } from "./contexts/AuthContext";

import ColorPropertiesOnBackendType from "./utils/ColorPropertiesOnBackendType";

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
      <Suspense fallback={<OverlayLoader />}>
        <AuthContextProvider>
          <Routes>
            <Route element={<Structure />}>
              <Route path="/" element={<Navigate to="/select" />} />
              <Route
                path="/select"
                element={<Select title="Choose a Back-end" />}
              />
              <Route
                path="/login-register"
                element={
                  <MustLogoutRoute>
                    <LoginRegister title="Register" />
                  </MustLogoutRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <Users title="Users" />
                  </PrivateRoute>
                }
              />
              <Route path="/error-401" element={<Error401 title="ERROR" />} />
              <Route path="/error-403" element={<Error403 title="ERROR" />} />
              <Route path="/error-404" element={<Error404 title="ERROR" />} />
              <Route path="/error-500" element={<Error500 title="ERROR" />} />
              <Route path="*" element={<Navigate to="/error-404" />} />
            </Route>
          </Routes>
        </AuthContextProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
