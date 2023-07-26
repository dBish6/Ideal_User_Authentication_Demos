import { InputProps } from "../../@types/InputProps";
import capitalize from "../../utils/capitalize";

const Input = ({
  type,
  error,
  ...options
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={`${type}Wrapper`}>
      <div className="inputWrapper">
        <input
          aria-required="true"
          id={type}
          // name={type}
          autoComplete="off"
          {...options}
        />
        <label htmlFor={type}>
          {capitalize(type)}
          <span aria-label="Required">*</span>
        </label>
      </div>
      {error && <small className="fieldErr">{error.message}</small>}
    </div>
  );
};

export default Input;
