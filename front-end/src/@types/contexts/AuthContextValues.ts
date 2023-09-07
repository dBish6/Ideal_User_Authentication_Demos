import { CurrentUser } from "../CurrentUser";

export type AuthContextValues = {
  currentUser: CurrentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
};
