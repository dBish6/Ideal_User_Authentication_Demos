import { UseFormSetError } from "react-hook-form";
import { RegisterFormValues } from "../@types/RegisterFormValues";
import requestHandler from "./AxiosInstance";

const PostRegister = (setError: UseFormSetError<RegisterFormValues>) => {
  const { instance } = requestHandler(false);

  const handleRegister = async (user: RegisterFormValues) => {
    console.log("user", user);

    if (user.conPassword !== user.password) {
      return setError("conPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
    }

    const res = await instance({
      method: "POST",
      url: "/auth/register",
      data: {
        displayName: user.username,
        fullName: user.firstName.concat(" ", user.lastName),
        email: user.email,
        password: user.password,
      },
    });
    if (res) console.log(res);
  };

  return handleRegister;
};

export default PostRegister;
