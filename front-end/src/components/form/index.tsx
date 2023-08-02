import { useState, useRef } from "react";

import "./form.css";
import springSwap from "../../assets/icons/SpringSwap.svg";
import nodeSwap from "../../assets/icons/NodeSwap.svg";
import googleLogo from "../../assets/icons/Google.svg";
import githubLogo from "../../assets/icons/GitHub.svg";

import Register from "./Register";
import Login from "./Login";
import Button from "../button";

import { useGlobalContext } from "../../contexts/GlobalContext";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const Form = () => {
  const [isLogin, setIsLogin] = useState(false),
    btnRef = useRef<HTMLButtonElement>(null),
    havAccountRef = useRef<HTMLParagraphElement>(null),
    footerLink1Ref = useRef<HTMLParagraphElement>(null),
    footerLink2Ref = useRef<HTMLParagraphElement>(null),
    { selectedBackEnd } = useGlobalContext(),
    handleKeyDown = useKeyboardHelper();

  return (
    <div className="formWrapper">
      <button
        ref={btnRef}
        onClick={() => setIsLogin(!isLogin)}
        onKeyDown={(e) => handleKeyDown(e, btnRef)}
      >
        <img
          src={selectedBackEnd === "spring" ? springSwap : nodeSwap}
          alt="Toggle login Overlay"
        />
      </button>

      {!isLogin ? (
        <div className="formContent">
          <div className="title">
            <h2>Register</h2>
            <h5>Welcome to my Auth Demo</h5>
            <hr aria-hidden="true" />
          </div>

          <Register />
          <div role="presentation" className="orDivider">
            <hr aria-hidden="true" />
            <p>Or</p>
            <hr aria-hidden="true" />
          </div>
          <div className="thirdParty">
            <Button text="Use Google" icon={googleLogo} />
            <Button text="Use Github" icon={githubLogo} />
          </div>

          <p
            role="button"
            aria-pressed={isLogin}
            aria-controls="loginForm"
            tabIndex={0}
            ref={havAccountRef}
            onClick={() => setIsLogin(!isLogin)}
            onKeyDown={(e) =>
              handleKeyDown(e, havAccountRef, setIsLogin, [!isLogin])
            }
          >
            Have a account?
          </p>
        </div>
      ) : (
        <div className="formContent login">
          <div className="title">
            <h2>Login</h2>
            {/* <h4>Welcome Back</h4> */}
            <hr aria-hidden="true" />
          </div>

          <Login />
        </div>
      )}

      <div className="formFooter">
        <p
          role="link"
          tabIndex={0}
          ref={footerLink1Ref}
          onKeyDown={(e) => handleKeyDown(e, footerLink1Ref)}
        >
          Terms of Service
        </p>
        <p
          role="link"
          tabIndex={0}
          ref={footerLink2Ref}
          onKeyDown={(e) => handleKeyDown(e, footerLink2Ref)}
        >
          Support
        </p>
      </div>
    </div>
  );
};

export default Form;
