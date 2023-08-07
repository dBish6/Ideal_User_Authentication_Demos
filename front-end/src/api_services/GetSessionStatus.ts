/* eslint-disable react-hooks/exhaustive-deps */
import { CurrentUser } from "../@types/CurrentUser";
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";
import { useGlobalContext } from "../contexts/GlobalContext";

const GetSessionStatus = (
  currentUser: CurrentUser,
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>,
  logOutUser: () => Promise<void>
) => {
  const { instance, abortController } = RequestHandler(),
    { selectedBackEnd } = useGlobalContext();

  useEffect(() => {
    const handleCheck = async () => {
      if (currentUser.sessionStatus === true && selectedBackEnd) {
        try {
          const res = await instance({
            method: "GET",
            url: "/auth/checkSession",
          });
          if (res && res.status === 200)
            setCurrentUser({ user: res.data.user, sessionStatus: true });
        } catch (error: any) {
          if (error.includes("expired")) {
            setCurrentUser((prev) => ({ ...prev, sessionStatus: false }));
          } else {
            // Even when a error happens get this user out of here.
            if (!error.includes("CSRF") && localStorage.getItem("loggedIn"))
              await logOutUser();
          }
        }
      }
    };
    handleCheck();

    return () => abortController.abort();
  }, []);
};

export default GetSessionStatus;
