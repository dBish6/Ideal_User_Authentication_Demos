/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";

const RefreshSession = () => {
  const { instance, abortController } = RequestHandler();

  useEffect(() => {
    const handleRefresh = async () => {
      // if (localStorage.getItem("loggedIn")) {
      instance({
        method: "POST",
        url: "/auth/refresh",
      });
      // }
    };
    handleRefresh();

    return () => abortController.abort();
  }, []); // TODO: Is expired state?
};

export default RefreshSession;
