import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import "./header.css";
import SpringLogo from "../../../assets/SpringLogo.png";
import NodeLogo from "../../../assets/Node.jsLogo.png";

import OverlayLoader from "../../loaders/OverlayLoader";

import { useGlobalContext } from "../../../contexts/GlobalContext";
import { useAuthContext } from "../../../contexts/AuthContext";

import PostLogout from "../../../api_services/PostLogout";

const Header = () => {
  const [loading, toggleLoading] = useState(false),
    location = useLocation(),
    { selectedBackEnd } = useGlobalContext(),
    { currentUser } = useAuthContext(),
    handleLogout = PostLogout();

  return (
    <>
      <header>
        <Link tabIndex={1} to="/select" className="title">
          <h1>User Authentication Demo</h1>
        </Link>
        {location.pathname !== "/select" && selectedBackEnd && (
          <img
            src={selectedBackEnd === "spring" ? SpringLogo : NodeLogo}
            alt={selectedBackEnd === "spring" ? "Spring Logo" : "Node Logo"}
            className={selectedBackEnd === "spring" ? "springLogo" : "nodeLogo"}
          />
        )}
        <div>
          {!currentUser.sessionStatus ? (
            <h2>
              By: <span>David Bishop</span>
            </h2>
          ) : (
            <button
              tabIndex={1}
              className="logoutBtn"
              onClick={() => {
                toggleLoading(true);
                handleLogout().finally(() => toggleLoading(false));
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>
      {loading && <OverlayLoader />}
    </>
  );
};

export default Header;
