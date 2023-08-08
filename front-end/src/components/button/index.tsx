import { ButtonProps } from "../../@types/components/ButtonProps";
import { useRef, useEffect } from "react";
import "./button.css";
import Spinner from "../loaders/Spinner";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const Button = ({
  text,
  icon,
  alt,
  isIconBtn,
  isLoading,
  style,
  onClick,
  className,
  ...options
}: ButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null),
    handleKeyDown = useKeyboardHelper();

  return (
    <button
      aria-disabled={isLoading}
      disabled={isLoading}
      className={className ? `btnMain ${className}` : "btnMain"}
      style={{
        backgroundColor: isLoading ? "rgba(36, 36, 36, 0.5)" : "",
        ...style,
      }}
      ref={btnRef}
      onClick={onClick}
      onKeyDown={(e) => handleKeyDown(e, btnRef)}
      {...options}
    >
      <span
        className="btnTop"
        style={{
          backgroundColor: isLoading ? "#d6d6d6" : "",
          borderColor: isLoading ? "rgba(36, 36, 36, 0.5)" : "",
        }}
      >
        {icon && (
          <img
            src={icon}
            alt={alt}
            {...(!isIconBtn && {
              style: {
                marginRight: "0.5rem",
                display: isLoading ? "none" : "initial",
              },
            })}
          ></img>
        )}
        {!isIconBtn &&
          (isLoading ? (
            <Spinner />
          ) : (
            <p
              {...(icon && {
                style: { position: "relative", top: "1px" },
              })}
            >
              {text}
            </p>
          ))}
      </span>
    </button>
  );
};

export default Button;
