import { PagesProps } from "../../@types/PagesProps";
import "./errors.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Error403 = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <div className="error">
      <h2>
        <span>Error 403</span>: Forbidden
      </h2>
      <h3>User Authorization is Not Valid or Expired</h3>
    </div>
  );
};

export default Error403;
