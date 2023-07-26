import { useLocation } from "react-router-dom";
import "./header.css";

import SpringLogo from "../../../assets/SpringLogo.png";
import NodeLogo from "../../../assets/Node.jsLogo.png";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const Header = () => {
  const location = useLocation();
  const { selectedBackEnd } = useGlobalContext();

  return (
    <header>
      <h1>User Authentication Demo</h1>
      {location.pathname !== "/select" && selectedBackEnd && (
        <img
          src={selectedBackEnd === "spring" ? SpringLogo : NodeLogo}
          alt={selectedBackEnd === "spring" ? "Spring Logo" : "Node Logo"}
          className={selectedBackEnd === "spring" ? "springLogo" : "nodeLogo"}
        />
      )}
      <h2>
        By: <span>David Bishop</span>
      </h2>
    </header>
  );
};

export default Header;
