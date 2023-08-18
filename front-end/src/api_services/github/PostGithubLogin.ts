/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestHandler from "../AxiosInstance";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";

const PostGithubLogin = (
  toggleLoading: React.Dispatch<
    React.SetStateAction<{
      register: {
        email: boolean;
        google: boolean;
        gitHub: boolean;
      };
      login: boolean;
    }>
  >
) => {
  const navigate = useNavigate(),
    addToast = useToastContext();

  const { instance, abortController } = RequestHandler(),
    { setCurrentUser } = useAuthContext();

  useEffect(() => {
    const queryString = window.location.search;

    const handleGithubLogin = async () => {
      if (queryString && queryString.startsWith("?code")) {
        toggleLoading((prev) => ({
          ...prev,
          register: { ...prev.register, gitHub: true },
        }));

        const codeParam = new URLSearchParams(queryString).get("code"),
          res = await instance({
            method: "POST",
            url: "/auth/login/github",
            data: {
              code: codeParam,
            },
          });
        if (res && res.status === 200) {
          setCurrentUser({ user: res.data.user, sessionStatus: true });
          localStorage.setItem("loggedIn", res.data.user.displayName);
          navigate("/users");

          addToast(`Welcome back ${res.data.user.displayName}!`, "success");
        }

        toggleLoading((prev) => ({
          ...prev,
          register: { ...prev.register, gitHub: false },
        }));
      }
    };
    handleGithubLogin();

    return () => abortController.abort();
  }, [window.location.search]);
};

export default PostGithubLogin;
