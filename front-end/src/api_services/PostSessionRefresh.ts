/* eslint-disable react-hooks/exhaustive-deps */
import { CurrentUser } from "../@types/CurrentUser";
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";

const PostSessionRefresh = (
  currentUser: CurrentUser,
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>,
  logOutUser: () => Promise<void>
) => {
  const { instance, abortController } = RequestHandler();

  useEffect(() => {
    const handleRefresh = async () => {
      if (currentUser.sessionStatus === false) {
        try {
          const res = await instance({
            method: "POST",
            url: "/auth/refresh",
          });
          if (res && res.status === 200)
            setCurrentUser({ user: res.data.user, sessionStatus: true });
        } catch (error: any) {
          if (!error.includes("CSRF") && localStorage.getItem("loggedIn")) {
            await logOutUser();
            alert("User session timed out, please proceed to login.");
          }
        }
      }
    };
    handleRefresh();

    return () => abortController.abort();
  }, [currentUser.sessionStatus]);
};

export default PostSessionRefresh;
