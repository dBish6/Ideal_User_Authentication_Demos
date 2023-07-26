import { RequestHandlerTypes } from "../@types/RequestHandlerTypes";
import axios from "axios";
import { useGlobalContext } from "../contexts/GlobalContext";
import { springUrl, expressUrl } from "../constants/apiUrls";

// TODO: if error.response.message.includes("expired")

const RequestHandler: RequestHandlerTypes = (secure, options) => {
  const { selectedBackEnd } = useGlobalContext();
  const csrfToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    ),
    abortController = new AbortController();

  const instance = axios.create({
    baseURL: selectedBackEnd === "spring" ? springUrl : expressUrl,
    timeout: 3000,
    headers: {
      ...(secure && { "X-XSRF-TOKEN": csrfToken }), // TODO: CSRF
    },
    withCredentials: true,
    signal: abortController.signal,
    ...options,
  });

  return { instance, abortController };
};

export default RequestHandler;
