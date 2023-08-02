import { ButtonProps } from "../../@types/components/ButtonProps";
import { useRef } from "react";
import "./button.css";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const Button = ({
  text,
  icon,
  alt,
  isIconBtn,
  style,
  onClick,
  className,
  ...options
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const btnRef = useRef<HTMLButtonElement>(null),
    handleKeyDown = useKeyboardHelper();

  return (
    <button
      className={className ? `btnMain ${className}` : "btnMain"}
      style={{ ...style }}
      ref={btnRef}
      onClick={onClick}
      onKeyDown={(e) => handleKeyDown(e, btnRef)}
      {...options}
    >
      <span className="btnTop">
        {icon && (
          <img
            src={icon}
            alt={alt}
            {...(!isIconBtn && { style: { marginRight: "0.5rem" } })}
          ></img>
        )}
        {!isIconBtn && (
          <p
            {...(icon && {
              style: { position: "relative", top: "1px" },
            })}
          >
            {text}
          </p>
        )}
      </span>
    </button>
  );
};

export default Button;
