import { LoginFormValues } from "../../@types/LoginFormValues";

import { useForm } from "react-hook-form";

import Input from "./Input";
import Button from "../button";

import PostLogin from "../../api_services/PostLogin";

const Login = () => {
  const {
      register,
      formState: { errors },
      handleSubmit,
      watch,
      setError,
    } = useForm<LoginFormValues>(),
    handleLogin = PostLogin(setError);

  return (
    <form
      id="loginForm"
      onSubmit={handleSubmit(() => {
        console.log(watch());
        handleLogin(watch());
      })}
    >
      <Input
        field="email"
        register={register}
        registerOptions={{
          required: "Email is required.",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address.",
          },
          maxLength: {
            value: 254,
            message: "This can't be your actual email, holy crap!.",
          },
        }}
        error={errors.email}
        placeholder=" "
      />

      <Input
        field="password"
        register={register}
        registerOptions={{ required: "Password is required." }}
        error={errors.password}
        placeholder=" "
      />
    </form>
  );
};

export default Login;
