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

import InitializeGoogleClient from "../../api_services/google/InitializeGoogleClient";
import githubLoginRedirect from "../../api_services/github/githubLoginRedirect";
import PostGithubLogin from "../../api_services/github/PostGithubLogin";

const Form = () => {
  const [isLogin, setIsLogin] = useState(false),
    [loading, toggleLoading] = useState({
      register: {
        email: false,
        google: false,
        gitHub: false,
      },
      login: false,
    });

  const btnRef = useRef<HTMLButtonElement>(null),
    havAccountRef = useRef<HTMLParagraphElement>(null),
    footerLink1Ref = useRef<HTMLParagraphElement>(null),
    footerLink2Ref = useRef<HTMLParagraphElement>(null);

  const { selectedBackEnd } = useGlobalContext(),
    handleKeyDown = useKeyboardHelper();

  const oneTap = InitializeGoogleClient(toggleLoading);

  PostGithubLogin(toggleLoading); // When the user is redirected back to here on a GitHub login, this will fire.

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

          <Register loading={loading} toggleLoading={toggleLoading} />
          <div role="presentation" className="orDivider">
            <hr aria-hidden="true" />
            <p>Or</p>
            <hr aria-hidden="true" />
          </div>
          <div className="thirdParty">
            <Button
              text="Use Google"
              icon={googleLogo}
              id="googleBtn"
              onClick={() => oneTap()}
              loading={loading.register}
            />
            <Button
              text="Use Github"
              icon={githubLogo}
              id="githubBtn"
              onClick={() => githubLoginRedirect()}
              loading={loading.register}
            />
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
            <hr aria-hidden="true" />
          </div>

          <Login loading={loading} toggleLoading={toggleLoading} />
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
