import { RegisterFormValues } from "../../@types/RegisterFormValues";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "../button";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    // setError,
  } = useForm<RegisterFormValues>();

  // TODO: Email already taken.
  // TODO: Verify email.

  return (
    <form onSubmit={handleSubmit(() => console.log(watch()))}>
      <Input
        type="username"
        error={errors.username}
        {...register("username", {
          required: "Username is required.",
          maxLength: {
            value: 24,
            message: "Username can be no more than 24 characters.",
          },
          minLength: {
            value: 3,
            message: "You can make a better username than that...",
          },
        })}
      />

      <div className="nameWrapper">
        <Input
          type="firstName"
          error={errors.firstName}
          {...register("firstName", {
            required: "First name is required.",
            maxLength: {
              value: 50,
              message: "Max of 50 characters exceeded.",
            },
          })}
        />
        <Input
          type="lastName"
          error={errors.lastName}
          {...register("lastName", {
            required: "Last name is required.",
            maxLength: {
              value: 80,
              message: "Max of 80 characters exceeded.",
            },
          })}
        />
      </div>

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
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters.",
          },
          maxLength: {
            value: 128,
            message: "Max of 128 characters exceeded.",
          },
        })}
      />

      <Input
        type="conPassword"
        error={errors.conPassword}
        {...register("conPassword", {
          required: "Please confirm your password.",
          maxLength: {
            value: 128,
            message: "Max of 128 characters exceeded.",
          },
        })}
      />

      <Button text="Register" type="submit" />
    </form>
  );
};

export default Register;
