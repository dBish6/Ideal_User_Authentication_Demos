import { useNavigate } from "react-router-dom";
import { UseFormSetError } from "react-hook-form";
import { LoginFormValues } from "../@types/components/FormValues";
import RequestHandler from "./AxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const PostLogin = (setError: UseFormSetError<LoginFormValues>) => {
  const navigate = useNavigate();

  const { instance } = RequestHandler(),
    { setCurrentUser } = useAuthContext();

  const handleLogin = async (
    user: LoginFormValues,
    formRef: React.RefObject<HTMLFormElement>
  ) => {
    try {
      const res = await instance({
        method: "POST",
        url: "/auth/login",
        data: { ...user },
      });
      if (res && res.status === 200) {
        formRef.current!.reset();
        setCurrentUser({ user: res.data.user, sessionStatus: true });
        localStorage.setItem("loggedIn", res.data.user.displayName);
        navigate("/users");
      }
    } catch (error: any) {
      if (error.includes("Email or password")) {
        setError("root", {
          type: "manual",
          message: error,
        });
      } else if (error.includes("email")) {
        setError("email", {
          type: "manual",
          message: error,
        });
      } else if (error.includes("password")) {
        setError("password", {
          type: "manual",
          message: error,
        });
      }
    }
  };

  return handleLogin;
};

export default PostLogin;
