import { ToastProps } from "../../@types/contexts/ToastTypes";
import "./toast.css";

const Toast = ({ close, state }: ToastProps) => {
  return (
    <div
      aria-label="Notification"
      className={state.type === "error" ? "toast error" : "toast success"}
    >
      <p>{state.message}</p>
      <button onClick={close}>&#10005;</button>
    </div>
  );
};

export default Toast;
