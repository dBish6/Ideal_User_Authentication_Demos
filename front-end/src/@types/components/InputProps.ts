import { UseFormRegister, RegisterOptions, FieldErrors } from "react-hook-form";
import { RegisterFormValues, LoginFormValues } from "./FormValues";

export type InputProps = {
  field: string;
  register: UseFormRegister<any>;
  registerOptions: RegisterOptions<any, string>;
  errors: FieldErrors<RegisterFormValues | LoginFormValues>;
};
