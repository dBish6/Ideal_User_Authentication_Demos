const useKeyboardHelper = () => {
  const handleKeyDown = (
    event: React.KeyboardEvent<any>,
    ref: React.RefObject<any>,
    func?: any,
    funcParams?: any[]
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      if (ref!.current) {
        if (ref.current.classList) {
          if (ref.current.classList.contains("selectBox")) {
            ref.current.classList.add("selected");
          } else {
            ref.current.classList.add("selected");
            setTimeout(() => {
              ref.current.classList.remove("selected");
            }, 350);
          }
        }
        if (func) funcParams ? func(...funcParams) : func();
      }
    }
  };

  return handleKeyDown;
};

export default useKeyboardHelper;
