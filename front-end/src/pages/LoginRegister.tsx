import { PagesProps } from "../@types/PagesProps";
import Form from "../components/form";
import useDocumentTitle from "../hooks/useDocumentTitle";
import InitializeCsrfToken from "../api_services/InitializeCsrfToken";

const LoginRegister = ({ title }: PagesProps) => {
  useDocumentTitle(title);
  InitializeCsrfToken();

  return <Form />;
};

export default LoginRegister;
