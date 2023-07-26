import { useLayoutEffect } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

const ColorPropertiesOnBackendType = () => {
  const { selectedBackEnd } = useGlobalContext();

  useLayoutEffect(() => {
    const rootStyle = document.getElementById("root")!.style;

    if (selectedBackEnd === "spring") {
      rootStyle.setProperty("--g100", "#CDE9BF");
      rootStyle.setProperty("--g400", "#7FC65B");
      rootStyle.setProperty("--g500", "#5FB832");
      rootStyle.setProperty("--g600", "#56A72E");
    } else if (selectedBackEnd === "express") {
      rootStyle.setProperty("--g100", "#D0E2CF");
      rootStyle.setProperty("--g400", "#86B382");
      rootStyle.setProperty("--g500", "#68A063");
      rootStyle.setProperty("--g600", "#5F925A");
    }
  }, [selectedBackEnd]);
};

export default ColorPropertiesOnBackendType;
