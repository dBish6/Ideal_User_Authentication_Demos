import { PagesProps } from "../@types/PagesProps";
import Selector from "../components/selector";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Landing = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <>
      <p
        style={{
          marginBottom: "3rem",
          fontSize: "1.25rem",
          fontWeight: "600",
          textAlign: "center",
          color: "#383838",
        }}
      >
        To start the demo, select a back-end that you'll like to commutate with.
        😁
      </p>
      <Selector />
    </>
  );
};

export default Landing;
