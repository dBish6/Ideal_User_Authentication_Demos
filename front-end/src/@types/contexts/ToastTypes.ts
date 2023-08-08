export type ToastStatuses = "error" | "success" | "info";

export type ToastState = {
  id: string;
  message: string;
  type: ToastStatuses;
};

export type ToastContextValues = (msg: string, type: ToastStatuses) => void;

export type ToastProps = {
  close: () => void;
  state: ToastState;
};
