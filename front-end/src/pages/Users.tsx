import { User } from "../@types/User";
import { PagesProps } from "../@types/PagesProps";

import UsersTable from "../components/usersTable";
import OverlayLoader from "../components/loaders/OverlayLoader";

import useDocumentTitle from "../hooks/useDocumentTitle";

import GetUsers from "../api_services/GetUsers";

const Users = ({ title }: PagesProps) => {
  useDocumentTitle(title);

  return (
    <>
      <GetUsers
        render={(users: User[]) =>
          users.length ? <UsersTable users={users} /> : <OverlayLoader />
        }
      />
    </>
  );
};

export default Users;
