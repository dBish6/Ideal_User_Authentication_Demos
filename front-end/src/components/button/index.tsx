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

  const isAnyRegLoading =
      loading &&
      typeof loading === "object" &&
      (loading.email || loading.google || loading.gitHub),
    isRegLoading =
      loading &&
      typeof loading === "object" &&
      ((isGoogleBtn && loading.google) ||
        (isGithubBtn && loading.gitHub) ||
        (!isGithubBtn && !isGoogleBtn && loading.email));

  return (
    <button
      aria-disabled={isAnyRegLoading || loading === true}
      disabled={isAnyRegLoading || loading === true}
      className={className ? `btnMain ${className}` : "btnMain"}
      style={{
        backgroundColor:
          isAnyRegLoading || loading === true ? "rgba(36, 36, 36, 0.5)" : "",
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
          backgroundColor: isAnyRegLoading || loading === true ? "#d6d6d6" : "",
          borderColor:
            isAnyRegLoading || loading === true ? "rgba(36, 36, 36, 0.5)" : "",
        }}
      >
        {icon && (
          <img
            src={icon}
            alt={alt}
            {...(!isIconBtn && {
              style: {
                marginRight: "0.5rem",
                display: isRegLoading || loading === true ? "none" : "initial",
              },
            })}
          ></img>
        )}
        {!isIconBtn &&
          (isRegLoading || loading === true ? (
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
