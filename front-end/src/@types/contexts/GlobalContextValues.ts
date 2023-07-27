export type GlobalContextValues = {
  selectedBackEnd?: "spring" | "express";
  setSelectedBackEnd: React.Dispatch<
    React.SetStateAction<"spring" | "express" | undefined>
  >;
};
