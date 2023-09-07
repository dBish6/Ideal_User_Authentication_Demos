/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const PostSessionRefresh = () => {
  const { instance, abortController } = RequestHandler(),
    { currentUser, setCurrentUser } = useAuthContext();

  useEffect(() => {
    const handleRefresh = async () => {
      if (currentUser.sessionStatus === false) {
        const res = await instance({
          method: "POST",
          url: "/auth/refresh",
        });
        if (res && res.status === 200)
          setCurrentUser({ user: res.data.user, sessionStatus: true });
      }
    };
    handleRefresh();

    return () => abortController.abort();
  }, [currentUser.sessionStatus]);
};

export default PostSessionRefresh;
