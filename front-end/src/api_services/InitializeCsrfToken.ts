/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import requestHandler from "./AxiosInstance";

const InitializeCsrfToken = () => {
  const { instance, abortController } = requestHandler(false); // backEndType state?

  useEffect(() => {
    const handleCsrf = async () => {
      try {
        const res = await instance({
          method: "OPTIONS",
          url: "/auth/csrf",
        });
        if (res) {
          console.log(res);
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleCsrf();

    return () => abortController.abort();
  }, []);
};

export default InitializeCsrfToken;
