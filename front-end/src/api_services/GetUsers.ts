/* eslint-disable react-hooks/exhaustive-deps */
import { User } from "../@types/User";
import { useState, useEffect } from "react";
import RequestHandler from "./AxiosInstance";

const GetUsers = ({
  render,
}: {
  render: (props: User[]) => React.JSX.Element;
}) => {
  const [users, setUsers] = useState<User[]>([]),
    { instance, abortController } = RequestHandler();

  useEffect(() => {
    const handleUsers = async () => {
      const res = await instance({
        method: "GET",
        url: "/auth/users",
      });
      if (res && res.status === 200) setUsers(res.data);
    };
    handleUsers();

    return () => abortController.abort();
  }, []);

  return render(users);
};

export default GetUsers;
