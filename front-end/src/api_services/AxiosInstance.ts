import { RequestHandlerTypes } from "../@types/RequestHandlerTypes";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useGlobalContext } from "../contexts/GlobalContext";
import { springUrl, expressUrl } from "../constants/apiUrls";

// TODO: if error.response.message.includes("expired")

const RequestHandler: RequestHandlerTypes = (secure, options) => {
  const navigate = useNavigate(),
    { selectedBackEnd } = useGlobalContext();
  // const csrfToken = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1"
  //   ),
  const abortController = new AbortController();

  const instance = axios.create({
    baseURL: selectedBackEnd === "spring" ? springUrl : expressUrl,
    timeout: 3000,
    // headers: {
    //   ...(secure && { "X-XSRF-TOKEN": csrfToken }),
    // },
    withCredentials: true,
    signal: abortController.signal,
    ...options,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      abortController.abort();
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/error-401");
        } else if (error.response.status === 403) {
          navigate("/error-403");
        }
      }
      console.error(error);
    }
  );

  return { instance, abortController };
};

export default RequestHandler;
