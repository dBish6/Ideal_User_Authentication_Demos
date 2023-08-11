import { useLocation, Link } from "react-router-dom";

import "./header.css";
import SpringLogo from "../../../assets/SpringLogo.png";
import NodeLogo from "../../../assets/Node.jsLogo.png";

import Logout from "./Logout";

import { useGlobalContext } from "../../../contexts/GlobalContext";

const Header = () => {
  const location = useLocation(),
    { selectedBackEnd } = useGlobalContext();

  return (
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
      <Logout />
    </header>
  );
};

export default Header;
