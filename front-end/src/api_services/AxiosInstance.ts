import { RequestHandlerTypes } from "../@types/api_services/RequestHandlerTypes";
import { AxiosErrorResponse } from "../@types/api_services/AxiosErrorResponse";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { useGlobalContext } from "../contexts/GlobalContext";
import { useAuthContext } from "../contexts/AuthContext";
import { springUrl, expressUrl } from "../constants/apiUrls";

const RequestHandler: RequestHandlerTypes = (options) => {
  const navigate = useNavigate(),
    { selectedBackEnd } = useGlobalContext(),
    { setCurrentUser } = useAuthContext();

  const abortController = new AbortController(),
    instance = axios.create({
      baseURL: selectedBackEnd === "spring" ? springUrl : expressUrl,
      timeout: 10000,
      withCredentials: true,
      signal: abortController.signal,
      ...options,
    });

  // This happens before each request.
  instance.interceptors.request.use(
    (config) => {
      if (localStorage.getItem("csrf"))
        config.headers["X-XSRF-TOKEN"] = localStorage.getItem("csrf");

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
      error.response?.status !== 403 && abortController.abort();

      if (error.response) {
        const errorMessage = error.response.data.message;
        if (error.response.status === 400) {
          // Bad Request Messages
          if (
            errorMessage.includes("already exists") ||
            errorMessage === "Email or password is incorrect." ||
            errorMessage === "Incorrect email." ||
            errorMessage === "Incorrect password." ||
            errorMessage.includes("user was found") // from when a google or github user is found.
          ) {
            throw errorMessage;
          }
        } else if (error.response.status === 401) {
          // Authorization Needed
          navigate("/error-401");
        } else if (error.response.status === 403) {
          if (errorMessage) {
            // Forbidden Messages
            if (errorMessage === "Access token is expired.") {
              setCurrentUser((prev) => ({ ...prev, sessionStatus: false }));

              throw errorMessage;
            } else if (errorMessage.startsWith("CSRF token")) {
              navigate("/error-403");
            } else {
              navigate("/error-403");
              instance({
                method: "POST",
                url: "/auth/logout",
              }).then((res) => {
                if (res && res.status === 200) {
                  setCurrentUser({ user: null, sessionStatus: null });
                  localStorage.removeItem("loggedIn");
                }
              });
            }
          } else {
            navigate("/error-403");
            instance({
              method: "POST",
              url: "/auth/logout",
            }).then((res) => {
              if (res && res.status === 200) {
                setCurrentUser({ user: null, sessionStatus: null });
                localStorage.removeItem("loggedIn");
              }
            });
          }
        } else if (error.response.status === 404) {
          if (errorMessage) {
            if (
              errorMessage.includes("incorrect subject") ||
              errorMessage.includes("decoded claims")
            ) {
              navigate("/error500");
            }
          }
        } else if (error.response.status === 409 && errorMessage) {
          throw errorMessage;
        }
      } else if (error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (
        error.code === "ECONNABORTED" ||
        error.code === "NETWORK ERROR"
      ) {
        navigate("/error-500");
      } else {
        throw new Error(
          "A un-handled unexpected server error occurred or check connection."
        );
      }

      console.error("Response error", error);
    }
  );

  return { instance, abortController };
};

export default RequestHandler;
