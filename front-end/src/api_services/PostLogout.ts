import RequestHandler from "./AxiosInstance";

const PostLogout = () => {
  const { instance } = RequestHandler();

  const handleLogout = async () => {
    const res = await instance({
      method: "POST",
      url: "/auth/logout",
    });
    return res;
  };

  return handleLogout;
};

export default PostLogout;
