import { ButtonProps } from "../../@types/ButtonProps";
import "./button.css";

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
  // TODO: Keyboard selected.

  return (
    <button
      className={className ? `btnMain ${className}` : "btnMain"}
      style={{ ...style }}
      onClick={onClick}
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
