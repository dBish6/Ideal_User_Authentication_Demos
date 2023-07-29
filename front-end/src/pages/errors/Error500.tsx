import { PagesProps } from "../../@types/PagesProps";
import "./errors.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Error500 = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <div className="error">
      <h2>
        <span>Error 500:</span> Internal Server Error
      </h2>
      <h3>Unexpected Server Error or Couldn't Establish a Connection</h3>
    </div>
  );
};

export default Error500;
