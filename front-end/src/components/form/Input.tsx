import {
  RegisterFormValues,
  LoginFormValues,
} from "../../@types/components/FormValues";
import { InputProps } from "../../@types/components/InputProps";

import { useRef, useState } from "react";

import eye from "../../assets/icons/Eye.svg";
import eyeClosed from "../../assets/icons/EyeClosed.svg";

import useKeyboardHelper from "../../hooks/useKeyboardHelper";
import capitalize from "../../utils/capitalize";

type FormValues = RegisterFormValues | LoginFormValues;

const Input = ({
  field,
  register,
  registerOptions,
  errors,
  ...options
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false),
    showRef = useRef<HTMLSpanElement>(null),
    error = errors[field as keyof FormValues],
    passwordFields = field === "password" || field === "conPassword";

  const handleKeyDown = useKeyboardHelper();

  return (
    <div className={`${field}Wrapper`}>
      <div
        className="inputWrapper"
        {...((errors.root || error) && { style: { borderColor: "red" } })}
      >
        <input
          aria-required="true"
          aria-invalid={error ? true : false}
          id={field}
          {...register(field, registerOptions)}
          {...(passwordFields && { type: show ? "text" : "password" })}
          autoComplete="off"
          {...options}
        />
        <label htmlFor={field}>
          {capitalize(field)}
          <span aria-label="Required">*</span>
        </label>
        {passwordFields && (
          <span
            role="button"
            aria-pressed={show}
            aria-controls={field}
            tabIndex={0}
            className="passwordBtn"
            ref={showRef}
            onClick={() => setShow(!show)}
            onKeyDown={(e) => handleKeyDown(e, showRef, setShow, [!show])}
          >
            {show ? (
              <img src={eyeClosed} alt="Show Password" />
            ) : (
              <img src={eye} alt="Hide Password" />
            )}
          </span>
        )}
      </div>
      {error && (
        <small aria-errormessage={field} className="fieldErr">
          {error.message}
        </small>
      )}
    </div>
  );
};

export default Input;
