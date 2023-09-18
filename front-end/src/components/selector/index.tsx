import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./selector.css";

import { useGlobalContext } from "../../contexts/GlobalContext";
import staticBackends from "../../constants/staticBackends";

import SelectBox from "./SelectBox";

const Selector = () => {
  const linkRef = useRef<HTMLAnchorElement>(null),
    { selectedBackEnd, setSelectedBackEnd } = useGlobalContext(),
    navigate = useNavigate();

  return (
    <>
      {staticBackends.map((backend, i) => (
        <SelectBox
          name={backend.name}
          img={backend.logo}
          selectedBackEnd={selectedBackEnd}
          setSelectedBackEnd={setSelectedBackEnd}
          key={i}
        />
      ))}
      <button
        className="btnMain"
        style={{ maxWidth: "524px" }}
        onClick={() => selectedBackEnd && navigate("/login-register")}
      >
        <span className="btnTop">Proceed to Form</span>
      </button>
      <Link to="/users" className="usersLink" ref={linkRef}>
        View Register Users
      </Link>
    </>
  );
};

export default Selector;
