import { useNavigate } from "react-router-dom";
import { CredentialResponse } from "google-oauth-gsi";
import RequestHandler from "../AxiosInstance";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";

const PostGoogleLogin = (
  toggleLoading: React.Dispatch<
    React.SetStateAction<{
      register: {
        email: boolean;
        google: boolean;
        gitHub: boolean;
      };
      login: boolean;
    }>
  >
) => {
  const navigate = useNavigate(),
    addToast = useToastContext();

  const { instance } = RequestHandler(),
    { setCurrentUser } = useAuthContext();

  const handleGoogleLogin = async (googleRes: CredentialResponse) => {
    toggleLoading((prev) => ({
      ...prev,
      register: { ...prev.register, google: true },
    }));
    // console.log("googleRes", googleRes);

    try {
      const userIdToken = googleRes.credential,
        res = await instance({
          method: "POST",
          url: "/auth/login/google",
          headers: {
            Authorization: "Bearer " + userIdToken,
          },
        });
      if (res && res.status === 200) {
        setCurrentUser({ user: res.data.user, sessionStatus: true });
        localStorage.setItem("loggedIn", res.data.user.displayName);
        navigate("/users");

        addToast(`Welcome back ${res.data.user.displayName}!`, "success");
      }
    } catch (error: any) {
      if (typeof error == "string") {
        addToast(error, "error");
      }
    }

    toggleLoading((prev) => ({
      ...prev,
      register: { ...prev.register, google: false },
    }));
  };

  return handleGoogleLogin;
};

export default PostGoogleLogin;
