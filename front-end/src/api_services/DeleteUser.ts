import { User } from "../@types/User";
import RequestHandler from "./AxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import PostLogout from "./PostLogout";

const DeleteUser = () => {
  const { instance } = RequestHandler(),
    { currentUser } = useAuthContext(),
    addToast = useToastContext(),
    handleLogout = PostLogout();

  const handleDelete = async (user: User) => {
    const res = await instance({
      method: "DELETE",
      url: `/auth/user/${user.email}`,
    });
    if (res && res.status === 200) {
      if (user.email === currentUser.user!.email) await handleLogout();
      addToast(`User ${user.displayName} is deleted.`, "success");
    }
  };

  return handleDelete;
};

export default DeleteUser;
