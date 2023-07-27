import { PagesProps } from "../../@types/PagesProps";
import "./errors.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Error401 = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <div className="error">
      <h2>
        <span>Error 401</span>: Unauthorized
      </h2>
      <h3>User Authorization Required</h3>
    </div>
  );
};

export default Error401;
