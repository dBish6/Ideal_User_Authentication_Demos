import { UseFormSetError } from "react-hook-form";
import { RegisterFormValues } from "../@types/components/FormValues";
import RequestHandler from "./AxiosInstance";

const PostRegister = (setError: UseFormSetError<RegisterFormValues>) => {
  const { instance } = RequestHandler();

  const handleRegister = async (
    user: RegisterFormValues,
    formRef: React.RefObject<HTMLFormElement>
  ) => {
    if (user.conPassword !== user.password) {
      return setError("conPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
    }

    try {
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
      if (res && res.status === 200) formRef.current!.reset();
    } catch (error: any) {
      if (error.includes("exists")) {
        setError("root", {
          type: "manual",
          message: error,
        });
      }
    }
  };

  return handleRegister;
};

export default PostRegister;
