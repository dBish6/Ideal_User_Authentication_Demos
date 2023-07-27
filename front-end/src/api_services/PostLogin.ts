import { UseFormSetError } from "react-hook-form";
import { LoginFormValues } from "../@types/LoginFormValues";
import requestHandler from "./AxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const PostLogin = (setError: UseFormSetError<LoginFormValues>) => {
  const { instance } = requestHandler(false),
    { setCurrentUser } = useAuthContext();

  const handleLogin = async (user: LoginFormValues) => {
    console.log("user", user);

    const res = await instance({
      method: "POST",
      url: "/auth/login",
      data: { ...user },
    });
    if (res) {
      console.log(res);
      setCurrentUser(res.data);
    }
  };

  return handleLogin;
};

export default PostLogin;
