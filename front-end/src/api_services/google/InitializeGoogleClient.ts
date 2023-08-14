import { GoogleOAuthProvider } from "google-oauth-gsi";
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
  const handleGoogleLogin = PostGoogleLogin(toggleLoading);

  const googleProvider = new GoogleOAuthProvider({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
    onScriptLoadError: () =>
      console.error("GoogleOAuthProvider failed to load, check client id."),
    onScriptLoadSuccess: () =>
      console.log("GoogleOAuthProvider successfully loaded"),
  });

  const oneTap = googleProvider.useGoogleOneTapLogin({
    cancel_on_tap_outside: false,
    onSuccess: (res) => handleGoogleLogin(res),
    onError: () =>
      console.error("useGoogleOneTapLogin unexpected error occurred."),
  });

  return oneTap;
};

export default InitializeGoogleClient;
