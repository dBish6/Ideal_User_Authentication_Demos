import { AxiosInstance } from "axios";

export type RequestHandlerTypes = (
  secure: boolean,
  options?: object
) => {
  instance: AxiosInstance;
  abortController: AbortController;
};
