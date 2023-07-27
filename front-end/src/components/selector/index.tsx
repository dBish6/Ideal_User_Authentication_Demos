import { useNavigate } from "react-router-dom";
import "./selector.css";

import { useGlobalContext } from "../../contexts/GlobalContext";
import staticBackends from "../../constants/staticBackends";

import SelectBox from "./SelectBox";
import Button from "../button";

const Selector = () => {
  const { selectedBackEnd, setSelectedBackEnd } = useGlobalContext(),
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
      <Button
        text="Proceed"
        style={{ maxWidth: "524px" }}
        onClick={() => selectedBackEnd && navigate("/login-register")}
      />
    </>
  );
};

export default Selector;
