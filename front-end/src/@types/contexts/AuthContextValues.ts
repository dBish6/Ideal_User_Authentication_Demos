import { User } from "../User";

export type AuthContextValues = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};
