import { ButtonProps } from "../../@types/components/ButtonProps";
import { useRef } from "react";
import "./button.css";
import Spinner from "../loaders/Spinner";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const Button = ({
  text,
  icon,
  alt,
  isIconBtn,
  loading,
  style,
  onClick,
  className,
  ...options
}: ButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null),
    handleKeyDown = useKeyboardHelper();

  const isGoogleBtn = options.id === "googleBtn",
    isGithubBtn = options.id === "githubBtn";

  const isAnyLoading =
      loading && (loading.email || loading.google || loading.gitHub),
    isLoading =
      loading &&
      ((isGoogleBtn && loading.google) ||
        (isGithubBtn && loading.gitHub) ||
        (!isGithubBtn && !isGoogleBtn && loading.email));

  return (
    <button
      aria-disabled={isAnyLoading}
      disabled={isAnyLoading}
      className={className ? `btnMain ${className}` : "btnMain"}
      style={{
        backgroundColor: isAnyLoading ? "rgba(36, 36, 36, 0.5)" : "",
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
          backgroundColor: isAnyLoading ? "#d6d6d6" : "",
          borderColor: isAnyLoading ? "rgba(36, 36, 36, 0.5)" : "",
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
