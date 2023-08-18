/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import RequestHandler from "./AxiosInstance";
import { useGlobalContext } from "../contexts/GlobalContext";

const GetInitializeCsrfToken = () => {
  const { instance, abortController } = RequestHandler(),
    { selectedBackEnd } = useGlobalContext();

  useEffect(() => {
    const handleCsrf = async () => {
      // Don't send the request when redirected back on a GitHub login.
      if (!window.location.search.includes("code")) {
        const res = await instance({
          method: "GET",
          url: "/csrf/init",
        });
        if (res && res.status === 200) {
          if (selectedBackEnd === "express") {
            sessionStorage.getItem("csrf") && sessionStorage.removeItem("csrf");
            sessionStorage.setItem("csrf", res.data.token); // This is a hashed csrf token, so it is safe to store it in localStorage.
          }
          console.log("csrfTokenHashed", res.data.token);
        }
      }
    };
    handleCsrf();

    return () => abortController.abort();
  }, []);
};

export default GetInitializeCsrfToken;
