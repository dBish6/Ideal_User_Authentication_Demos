import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./selector.css";

import { useGlobalContext } from "../../contexts/GlobalContext";
import staticBackends from "../../constants/staticBackends";

import SelectBox from "./SelectBox";
import Button from "../button";

import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const Selector = () => {
  const linkRef = useRef<HTMLAnchorElement>(null),
    { selectedBackEnd, setSelectedBackEnd } = useGlobalContext(),
    navigate = useNavigate(),
    handleKeyDown = useKeyboardHelper();

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
      <Button
        text="Proceed to Form"
        style={{ maxWidth: "524px" }}
        onClick={() => selectedBackEnd && navigate("/login-register")}
      />
      <Link
        to="/users"
        className="usersLink"
        ref={linkRef}
        onKeyDown={(e) => handleKeyDown(e, linkRef)}
      >
        View Register Users
      </Link>
    </>
  );
};

export default Selector;
