/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import requestHandler from "./AxiosInstance";

const RefreshSession = () => {
  const { instance, abortController } = requestHandler(false); // backEndType state?

  useEffect(() => {
    instance({
      method: "POST",
      url: "/auth/refresh",
    });

    return () => abortController.abort();
  }, []); // TODO: Is expired state?
};

export default RefreshSession;
