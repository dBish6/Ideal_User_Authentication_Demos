import { PagesProps } from "../@types/PagesProps";
import Selector from "../components/selector";

const Landing = ({ title }: PagesProps) => {
  return (
    <>
      <p
        style={{
          marginBottom: "3rem",
          fontSize: "18px",
          fontWeight: "500",
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
