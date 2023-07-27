import { InputProps } from "../../@types/InputProps";
import capitalize from "../../utils/capitalize";

const Input = ({
  field,
  register,
  registerOptions,
  error,
  ...options
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={`${field}Wrapper`}>
      <div className="inputWrapper">
        <input
          aria-required="true"
          id={field}
          // name={field}
          {...register(field, registerOptions)}
          autoComplete="off"
          {...options}
        />
        <label htmlFor={field}>
          {capitalize(field)}
          <span aria-label="Required">*</span>
        </label>
      </div>
      {error && <small className="fieldErr">{error.message}</small>}
    </div>
  );
};

export default Input;
