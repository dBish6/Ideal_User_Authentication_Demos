import { RegisterFormValues } from "../../@types/components/FormValues";
import { useRef } from "react";

import { useForm } from "react-hook-form";

import Input from "./Input";
import Button from "../button";

import PostRegister from "../../api_services/PostRegister";

const Register = () => {
  // TODO: Feedback.
  // TODO: Verify email.
  // TODO: loading.

  const formRef = useRef<HTMLFormElement>(null),
    {
      register,
      formState: { errors },
      handleSubmit,
      watch,
      setError,
    } = useForm<RegisterFormValues>(),
    handleRegister = PostRegister(setError);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(() => {
        console.log("Submitted", watch());
        handleRegister(watch(), formRef);
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
        field="username"
        register={register}
        registerOptions={{
          required: "Username is required.",
          maxLength: {
            value: 24,
            message: "Username can be no more than 24 characters.",
          },
          minLength: {
            value: 3,
            message: "You can make a better username than that...",
          },
        }}
        errors={errors}
        placeholder=" "
      />

      <div className="nameWrapper">
        <Input
          field="firstName"
          register={register}
          registerOptions={{
            required: "First name is required.",
            maxLength: {
              value: 50,
              message: "Max of 50 characters exceeded.",
            },
          }}
          errors={errors}
          placeholder=" "
        />
        <Input
          field="lastName"
          register={register}
          registerOptions={{
            required: "Last name is required.",
            maxLength: {
              value: 80,
              message: "Max of 80 characters exceeded.",
            },
          }}
          errors={errors}
          placeholder=" "
        />
      </div>

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
        registerOptions={{
          required: "Password is required.",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters.",
          },
          maxLength: {
            value: 128,
            message: "Max of 128 characters exceeded.",
          },
        }}
        errors={errors}
        placeholder=" "
      />

      <Input
        field="conPassword"
        register={register}
        registerOptions={{
          required: "Please confirm your password.",
          maxLength: {
            value: 128,
            message: "Max of 128 characters exceeded.",
          },
        }}
        errors={errors}
        placeholder=" "
      />

      <Button text="Register" type="submit" />
    </form>
  );
};

export default Register;
