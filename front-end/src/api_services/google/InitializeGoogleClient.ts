/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from "react";
import PostGoogleLogin from "./PostGoogleLogin";

const InitializeGoogleClient = (
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
  const handleGoogleLoginCallback = PostGoogleLogin(toggleLoading);

  useLayoutEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
      callback: handleGoogleLoginCallback,
      cancel_on_tap_outside: false,
    });
  }, []);
};

export default InitializeGoogleClient;
