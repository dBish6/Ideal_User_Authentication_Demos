import { AxiosInstance } from "axios";

export type RequestHandlerTypes = (options?: object) => {
  instance: AxiosInstance;
  abortController: AbortController;
};
