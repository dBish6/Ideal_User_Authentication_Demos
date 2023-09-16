/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useAuthContext } from "../contexts/AuthContext";

const GetSessionStatus = () => {
  const { instance, abortController } = RequestHandler(),
    { selectedBackEnd } = useGlobalContext(),
    { currentUser, setCurrentUser } = useAuthContext();

  useEffect(() => {
    const handleCheck = async () => {
      if (
        currentUser.sessionStatus === true &&
        selectedBackEnd &&
        window.location.pathname !== "/login-register"
      ) {
        const res = await instance({
          method: "GET",
          url: "/auth/checkSession",
        });
        if (res && res.status === 200)
          setCurrentUser({ user: res.data.user, sessionStatus: true });
      }
    };
    handleCheck();

    return () => abortController.abort();
  }, []);
};

export default GetSessionStatus;
