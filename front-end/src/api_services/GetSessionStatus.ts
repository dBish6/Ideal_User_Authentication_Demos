/* eslint-disable react-hooks/exhaustive-deps */
import { User } from "../@types/User";
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";
import { useGlobalContext } from "../contexts/GlobalContext";

const GetSessionStatus = (
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const { instance, abortController } = RequestHandler(),
    { selectedBackEnd } = useGlobalContext();

  useEffect(() => {
    const handleCheck = async () => {
      if (localStorage.getItem("loggedIn") && selectedBackEnd) {
        const res = await instance({
          method: "GET",
          url: "/auth/checkSession",
        });
        if (res && res.status === 200) {
          setCurrentUser(res.data.user);
        }
      }
    };
    handleCheck();

    return () => abortController.abort();
  }, []);
};

export default GetSessionStatus;
