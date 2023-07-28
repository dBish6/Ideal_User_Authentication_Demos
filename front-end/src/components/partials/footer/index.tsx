import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./footer.css";
import backArrow from "../../../assets/icons/BackArrow.svg";
import linkedinLogo from "../../../assets/icons/LinkedIn.svg";
import githubLogo from "../../../assets/icons/GitHub.svg";
import info from "../../../assets/icons/Info.svg";
import email from "../../../assets/icons/Email.svg";

import Button from "../../button";

import useKeyboardHelper from "../../../hooks/useKeyboardHelper";

const Footer = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const location = useLocation(),
    navigate = useNavigate(),
    handleKeyDown = useKeyboardHelper();

  const openExternal = (path: string) =>
    path.slice(0, 5) === "mailto"
      ? window.open(path)
      : window.open(path, "_blank", "noopener,noreferrer");

  return (
    <footer>
      <button
        aria-label="Back to Previous Page"
        tabIndex={0}
        ref={btnRef}
        {...(location.pathname === "/select" && {
          style: { visibility: "hidden", pointerEvents: "none" },
        })}
        onClick={() => navigate(-1)}
        onKeyDown={(e) => handleKeyDown(e, btnRef)}
      >
        <img src={backArrow} alt="Back Arrow" />
        Go Back
      </button>

      <div>
        <Button
          icon={linkedinLogo}
          alt="My Linkedin"
          isIconBtn={true}
          style={{ width: "2.5rem", height: "2.5rem" }}
          onClick={() =>
            openExternal("https://www.linkedin.com/in/david-bishop-34a76b237/")
          }
        />
        <Button
          icon={githubLogo}
          alt="My Github"
          isIconBtn={true}
          style={{ maxWidth: "2.5rem", height: "2.5rem" }}
          onClick={() => openExternal("https://github.com/dBish6")}
        />
        <Button
          icon={info}
          alt="More Information"
          isIconBtn={true}
          style={{ maxWidth: "2.5rem", height: "2.5rem" }}
          onClick={() => openExternal("https://davidbishop.info/")}
        />
        <Button
          icon={email}
          alt="Contact Me"
          isIconBtn={true}
          style={{ maxWidth: "2.5rem", height: "2.5rem" }}
          onClick={() => openExternal("mailto:davidbish2002@hotmail.com")}
        />
      </div>
    </footer>
  );
};

export default Footer;
