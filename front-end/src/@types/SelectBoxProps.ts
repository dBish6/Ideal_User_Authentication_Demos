// FIXME:
export type SelectBoxProps = {
  name: "Spring" | "Express";
  img: string;
  selectedBackEnd?: "spring" | "express";
  setSelectedBackEnd: React.Dispatch<
    React.SetStateAction<"spring" | "express" | undefined>
  >;
};
