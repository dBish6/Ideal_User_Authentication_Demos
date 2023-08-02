import {
  RegisterFormValues,
  LoginFormValues,
} from "../../@types/components/FormValues";
import { InputProps } from "../../@types/components/InputProps";
import capitalize from "../../utils/capitalize";

type FormValues = RegisterFormValues | LoginFormValues;

const Input = ({
  field,
  register,
  registerOptions,
  errors,
  ...options
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const error = errors[field as keyof FormValues];

  return (
    <div className={`${field}Wrapper`}>
      <div className="inputWrapper">
        <input
          aria-required="true"
          // aria-invalid={error}
          id={field}
          // name={field}
          {...((errors.root || error) && { style: { borderColor: "red" } })}
          {...register(field, registerOptions)}
          autoComplete="off"
          {...options}
        />
        <label htmlFor={field}>
          {capitalize(field)}
          <span aria-label="Required">*</span>
        </label>
      </div>
      {error && (
        <small aria-errormessage="" className="fieldErr">
          {error.message}
        </small>
      )}
    </div>
  );
};

export default Input;
