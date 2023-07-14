import { RegisterValues } from "../../@types/RegisterValues";
import { useForm } from "react-hook-form";

const Register: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    // setError,
  } = useForm<RegisterValues>();

  // TODO: Email already taken.
  // TODO: Verify email.
  // TODO: Strength Indicator.

  return (
    <form onSubmit={handleSubmit(() => console.log(watch()))}>
      <div className="usernameWrapper">
        <input
          {...register("username", {
            required: "Username is required.",
            maxLength: {
              value: 24,
              message: "Username can be no more then 24 characters.",
            },
            minLength: {
              value: 3,
              message: "You can make a better username then that...",
            },
          })}
          aria-required="true"
          id="username"
          name="username"
          autoComplete="off"
        />
        <label htmlFor="username">
          Username <span aria-label="Required">*</span>
        </label>
        {errors.username && (
          <small className="formErr">{errors.username.message}</small>
        )}
      </div>

      <div className="nameWrapper">
        <div>
          <input
            {...register("firstName", {
              required: "First name is required.",
              maxLength: {
                value: 50,
                message: "Max of 50 characters exceeded.",
              },
            })}
            aria-required="true"
            id="firstName"
            name="firstName"
            autoComplete="off"
          />
          <label htmlFor="firstName">
            First Name <span aria-label="Required">*</span>
          </label>
          {errors.firstName && (
            <small className="formErr">{errors.firstName.message}</small>
          )}
        </div>

        <div>
          <input
            {...register("lastName", {
              required: "Last name is required.",
              maxLength: {
                value: 80,
                message: "Max of 80 characters exceeded.",
              },
            })}
            aria-required="true"
            id="lastName"
            name="lastName"
            autoComplete="off"
          />
          <label htmlFor="lastName">
            Last Name <span aria-label="Required">*</span>
          </label>
          {errors.lastName && (
            <small className="formErr">{errors.lastName.message}</small>
          )}
        </div>
      </div>

      <div className="emailWrapper">
        <input
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
          aria-required="true"
          id="email"
          name="email"
          autoComplete="off"
        />
        <label htmlFor="email">
          email <span aria-label="Required">*</span>
        </label>
        {errors.email && (
          <small className="formErr">{errors.email.message}</small>
        )}
      </div>

      <div className="passwordWrapper">
        <input
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
          aria-required="true"
          id="password"
          name="password"
          autoComplete="off"
        />
        <label htmlFor="password">
          password <span aria-label="Required">*</span>
        </label>
        {errors.password && (
          <small className="formErr">{errors.password.message}</small>
        )}
      </div>

      <div className="conPasswordWrapper">
        <input
          {...register("conPassword", {
            required: "Please confirm your password.",
            maxLength: {
              value: 128,
              message: "Max of 128 characters exceeded.",
            },
            // onChange: (e) => {
            //   if (e.target.value === watch("password"))
            //     setErrorHandler({ ...errorHandler, confirmation: false });
            // },
          })}
          aria-required="true"
          id="conPassword"
          name="conPassword"
          autoComplete="off"
        />
        <label htmlFor="conPassword">
          password <span aria-label="Required">*</span>
        </label>
        {errors.conPassword && (
          <small className="formErr">{errors.conPassword.message}</small>
        )}
      </div>
    </form>
  );
};

export default Register;
