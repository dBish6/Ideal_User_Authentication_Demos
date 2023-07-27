import { UseFormRegister, RegisterOptions, FieldError } from "react-hook-form";

export type InputProps = {
  field: string;
  register: UseFormRegister<any>;
  registerOptions: RegisterOptions<any, string>;
  error?: FieldError;
};
