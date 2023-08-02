import { RequestHandlerTypes } from "../@types/RequestHandlerTypes";
import { AxiosErrorResponse } from "../@types/AxiosErrorResponse";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { useGlobalContext } from "../contexts/GlobalContext";
import { springUrl, expressUrl } from "../constants/apiUrls";

const RequestHandler: RequestHandlerTypes = (options) => {
  const navigate = useNavigate(),
    { selectedBackEnd } = useGlobalContext();

  const abortController = new AbortController(),
    instance = axios.create({
      baseURL: selectedBackEnd === "spring" ? springUrl : expressUrl,
      timeout: 3000,
      withCredentials: true,
      signal: abortController.signal,
      ...options,
    });

  instance.interceptors.response.use(
    (response) => {
      console.log("response", response);
      return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
      abortController.abort();

      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message;
          if (
            errorMessage === "Email or password is incorrect." ||
            errorMessage === "User already exists."
          ) {
            throw errorMessage;
          }
        } else if (error.response.status === 401) {
          if (error.response.data.message === "Token is expired.") {
            // TODO: Add to state?
          }
          navigate("/error-401");
        } else if (error.response.status === 403) {
          navigate("/error-403");
        } else if (error.response.status === 404) {
          // navigate("/error-404"); // TODO: ?
        } else if (
          error.response.status === 500 ||
          error.code === "NETWORK ERROR" // FIXME: ?
        ) {
          navigate("/error-500");
        }
      } else if (error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.code === "ECONNABORTED") {
        navigate("/error-500"); // FIXME: This is network error?
      } else {
        throw new Error("A un-handled unexpected server error occurred.");
      }

      // console.error(error);
    }
  );

  return { instance, abortController };
};

export default RequestHandler;
