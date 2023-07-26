const useKeyboardHelper = () => {
  const handleKeyDown = (
    event: React.KeyboardEvent<any>,
    ref?: React.RefObject<any>,
    func?: any,
    funcParams?: any[]
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      if (func) funcParams ? func(...funcParams) : func();
      if (ref) ref.current!.classList.add("selected");

      console.log("PRESSING");
    }
  };

  return handleKeyDown;
};

export default useKeyboardHelper;
