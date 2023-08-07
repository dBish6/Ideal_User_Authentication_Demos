import { User } from "./User";

export type CurrentUser = {
  user: User | null;
  sessionStatus: boolean | null;
};
