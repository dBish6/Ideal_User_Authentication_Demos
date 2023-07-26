import { useState } from "react";

import "./form.css";
import googleLogo from "../../assets/icons/Google.svg";
import githubLogo from "../../assets/icons/GitHub.svg";

// import requestHandler from "../../api_services/AxiosInstance";

import Register from "./Register";
import Login from "./Login";
import Button from "../button";

const Form = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="formWrapper">
      {!isLogin ? (
        <div className="formContent">
          <div className="title">
            <h2>Register</h2>
            <h4>Welcome to my Auth Demo</h4>
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
            onClick={() => setIsLogin(!isLogin)}
          >
            Have a account?
          </p>
        </div>
      ) : (
        <div className="formContent">
          <div className="title">
            <h2 className="loginHeading">Login</h2>
            <hr aria-hidden="true" />
          </div>

          <Login />
        </div>
      )}
      <div className="formFooter">
        <p role="link">Terms of Service</p> <p role="link">Support</p>
      </div>
    </div>
  );
};

export default Form;
