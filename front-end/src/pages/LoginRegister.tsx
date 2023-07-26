import { PagesProps } from "../@types/PagesProps";
import InitializeCsrfToken from "../api_services/InitializeCsrfToken";
import Form from "../components/form";

const LoginRegister = ({ title }: PagesProps) => {
  InitializeCsrfToken();

  return <Form />;
};

export default LoginRegister;
