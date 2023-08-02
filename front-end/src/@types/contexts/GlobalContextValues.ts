export type GlobalContextValues = {
  selectedBackEnd: "spring" | "express" | null;
  setSelectedBackEnd: React.Dispatch<
    React.SetStateAction<"spring" | "express" | null>
  >;
};
