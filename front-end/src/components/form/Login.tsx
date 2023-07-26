import { LoginFormValues } from "../../@types/LoginFormValues";
import { useForm } from "react-hook-form";
import Input from "./Input";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    // setError,
  } = useForm<LoginFormValues>();

  return (
    <form id="loginForm">
      <Input
        type="email"
        error={errors.email}
        {...register("email", {
          required: "Email is required.",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address.",
          },
          maxLength: {
            value: 254,
            message: "This can't be your actual email, holy crap!.",
          },
        })}
      />
      <Input
        type="password"
        error={errors.password}
        {...register("password", {
          required: "Password is required.",
          // minLength: {
          //   value: 6,
          //   message: "Password must be at least 6 characters.",
          // },
          // maxLength: {
          //   value: 128,
          //   message: "Max of 128 characters exceeded.",
          // },
        })}
      />
    </form>
  );
};

export default Login;
