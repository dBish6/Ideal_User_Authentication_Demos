import { PagesProps } from "../../@types/PagesProps";
import "./errors.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Error404 = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <div className="error">
      <h2>
        <span>Error 404:</span> Not Found
      </h2>
      <h3>Page Not Found</h3>
    </div>
  );
};

export default Error404;
