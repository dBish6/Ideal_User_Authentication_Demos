/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import requestHandler from "./AxiosInstance";

const InitializeCsrfToken = () => {
  const { instance, abortController } = requestHandler(false);

  useEffect(() => {
    // TODO: Need to not send the token when already initialized.
    const handleCsrf = async () => {
      const res = await instance({
        method: "OPTIONS",
        url: "/auth/csrf",
      });
      if (res) {
        console.log(res);
        // TODO: Set boolean.
      }
    };
    handleCsrf();

    return () => abortController.abort();
  }, []);
};

export default InitializeCsrfToken;
