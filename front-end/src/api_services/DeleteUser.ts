import { User } from "../@types/User";
import RequestHandler from "./AxiosInstance";
import { useToastContext } from "../contexts/ToastContext";

const DeleteUser = () => {
  const { instance } = RequestHandler(),
    addToast = useToastContext();

  const handleDelete = async (user: User) => {
    const res = await instance({
      method: "DELETE",
      url: `/auth/user/${user.email}`,
    });
    if (res && res.status === 200) {
      addToast(`User ${user.displayName} successfully deleted.`, "success");
    }
  };

  return handleDelete;
};

export default DeleteUser;
