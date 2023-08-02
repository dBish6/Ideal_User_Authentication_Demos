import { SelectBoxProps } from "../../@types/components/SelectBoxProps";
import { useRef } from "react";
import Radio from "./Radio";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const SelectBox = ({
  name,
  img,
  selectedBackEnd,
  setSelectedBackEnd,
}: SelectBoxProps) => {
  const selectBoxRef = useRef<HTMLDivElement>(null),
    isSelected = selectedBackEnd === name.toLowerCase();

  const handleKeyDown = useKeyboardHelper();

  return (
    <div
      aria-label={`Select ${name}`}
      tabIndex={1}
      className={`selectBox ${isSelected ? "selected" : ""}`}
      ref={selectBoxRef}
      onClick={() => {
        setSelectedBackEnd(name.toLowerCase() as "spring" | "express");
        localStorage.setItem("selectedBackEnd", name.toLowerCase());
      }}
      onKeyDown={(e) =>
        handleKeyDown(e, selectBoxRef, setSelectedBackEnd, [
          name.toLowerCase() as "spring" | "express",
        ])
      }
    >
      <div role="presentation" className="imgWrapper">
        <img src={img} alt="Back-end Logo" />
      </div>
      <h3>{name}</h3>
      <Radio selectedBackEnd={selectedBackEnd} isSelected={isSelected} />
    </div>
  );
};

export default SelectBox;
