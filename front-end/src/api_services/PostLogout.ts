import RequestHandler from "./AxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";

const PostLogout = () => {
  const { instance } = RequestHandler(),
    { currentUser, setCurrentUser } = useAuthContext(),
    addToast = useToastContext();

  const handleLogout = async () => {
    if (currentUser.sessionStatus === true) {
      const res = await instance({
        method: "POST",
        url: "/auth/logout",
      });
      if (res && res.status === 200) {
        setCurrentUser({ user: null, sessionStatus: null });
        localStorage.removeItem("loggedIn");
        addToast("User session timed out.", "success");
      }
      return res;
    } else {
      console.warn(
        "Didn't send logout request because there is no user session."
      );
    }
  };

  return handleLogout;
};

export default PostLogout;
