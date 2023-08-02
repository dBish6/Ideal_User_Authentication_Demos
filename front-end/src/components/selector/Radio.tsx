/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";

const Radio = ({
  isSelected,
  selectedBackEnd,
}: {
  selectedBackEnd?: "spring" | "express" | null;
  isSelected: boolean;
}) => {
  const radioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      radioRef.current!.style.setProperty(
        "--isSelected",
        isSelected
          ? selectedBackEnd === "spring"
            ? "#5FB832"
            : "#68A063"
          : "#f4f4f4"
      );
    }
  }, [isSelected]);

  return (
    <div
      role="checkbox"
      aria-label="Selected Checkbox"
      aria-checked="false"
      ref={radioRef}
      className={`sqrRadio ${isSelected ? "selected" : ""}`}
    >
      <div />
    </div>
  );
};

export default Radio;
