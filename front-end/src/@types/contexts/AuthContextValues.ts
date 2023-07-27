import { CurrentUser } from "../CurrentUser";

export type AuthContextValues = {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
};
