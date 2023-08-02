/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";

const GetInitializeCsrfToken = () => {
  const { instance, abortController } = RequestHandler();

  useEffect(() => {
    const handleCsrf = async () => {
      // if (!sessionStorage.getItem("_csrf")) {
      // !document.cookie.match(/^(.*;)?\s*XSRF-TOKEN\s*=\s*[^;]+(.*)?$/)
      // !document.cookie.match(/XSRF-TOKEN=([^;]+)/)
      const res = await instance({
        method: "GET",
        url: "/csrf/init",
      });
      if (res && res.status === 200) {
        // if (res.data.token) sessionStorage.setItem("_csrf", res.data.token); // This token in the body isn't actually the csrf token, it's encrypted. So, it is safe to store it in sessionStorage.
        console.log("csrfTokenEncrypted", res.data.token);
      }
      // }
    };
    handleCsrf();

    return () => abortController.abort();
  }, []);
};

export default GetInitializeCsrfToken;
