import { RequestHandlerTypes } from "../@types/api_services/RequestHandlerTypes";
import { AxiosErrorResponse } from "../@types/api_services/AxiosErrorResponse";
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
      timeout: 10000, // 3000
      withCredentials: true,
      signal: abortController.signal,
      ...options,
    });

  // This happens before each request.
  instance.interceptors.request.use(
    (config) => {
      if (selectedBackEnd === "express" && sessionStorage.getItem("csrf"))
        config.headers["X-XSRF-TOKEN"] = sessionStorage.getItem("csrf");

      return config;
    },
    (error) => {
      console.error("Request error", error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log("response", response);
      return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
      abortController.abort();

      if (error.response) {
        const errorMessage = error.response.data.message;
        if (error.response.status === 400) {
          // Bad Request Messages
          if (
            errorMessage.includes("already exists") ||
            errorMessage === "Email or password is incorrect." ||
            errorMessage === "Incorrect email." ||
            errorMessage === "Incorrect password." ||
            errorMessage.includes("google user")
          ) {
            throw errorMessage;
          }
        } else if (error.response.status === 401) {
          // Authorization Needed
          navigate("/error-401");
        } else if (error.response.status === 403) {
          // Forbidden Messages
          // TODO: "Token is expired." is still in spring.
          if (errorMessage === "Access token is expired.") {
            throw errorMessage;
          } else if (errorMessage.startsWith("CSRF token")) {
            navigate("/error-403");
            throw errorMessage;
          } else {
            navigate("/error-403");
          }
        } else if (
          error.response.status === 404 &&
          errorMessage &&
          errorMessage.includes("incorrect subject")
        ) {
          navigate("/error500");
        } else if (error.code === "NETWORK ERROR") {
          navigate("/error-500");
        }
      } else if (error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.code === "ECONNABORTED") {
        navigate("/error-500"); // FIXME: This is network error?
      } else {
        throw new Error("A un-handled unexpected server error occurred.");
      }

      console.error("Response error", error);
    }
  );

  return { instance, abortController };
};

export default RequestHandler;
