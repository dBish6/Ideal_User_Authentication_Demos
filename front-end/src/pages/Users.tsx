import { PagesProps } from "../@types/PagesProps";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Users = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return <div>Users</div>;
};

export default Users;
