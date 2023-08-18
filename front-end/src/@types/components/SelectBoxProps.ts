export type SelectBoxProps = {
  name: "Spring" | "Express";
  img: string;
  selectedBackEnd?: "spring" | "express" | null;
  setSelectedBackEnd: React.Dispatch<
    React.SetStateAction<"spring" | "express" | null>
  >;
};
