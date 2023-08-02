import { PagesProps } from "../@types/PagesProps";
import Form from "../components/form";
import useDocumentTitle from "../hooks/useDocumentTitle";
import GetInitializeCsrfToken from "../api_services/GetInitializeCsrfToken";

const LoginRegister = ({ title }: PagesProps) => {
  useDocumentTitle(title);
  GetInitializeCsrfToken();

  return <Form />;
};

export default LoginRegister;
