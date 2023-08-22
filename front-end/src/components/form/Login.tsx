import { FormProps } from "../../@types/components/FormProps";
import { LoginFormValues } from "../../@types/components/FormValues";

import { useRef } from "react";
import { useForm } from "react-hook-form";

import Input from "./Input";
import Button from "../button";

import PostLogin from "../../api_services/PostLogin";

const Login = ({ loading, toggleLoading }: FormProps) => {
  const formRef = useRef<HTMLFormElement>(null),
    {
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
      ref={formRef}
      onSubmit={handleSubmit(() => {
        toggleLoading({ ...loading, login: true });
        console.log("Submitted", watch());
        handleLogin(watch(), formRef).finally(() => {
          toggleLoading({ ...loading, login: false });
        });
      })}
    >
      {errors.root && (
        <p
          className="fieldErr"
          style={{ fontWeight: "500", textAlign: "center" }}
        >
          {errors.root.message}
        </p>
      )}

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
        errors={errors}
        placeholder=" "
      />

      <Input
        field="password"
        register={register}
        registerOptions={{ required: "Password is required." }}
        errors={errors}
        placeholder=" "
      />

      <Button text="Login" type="submit" loading={loading.login} />
    </form>
  );
};

export default Login;
