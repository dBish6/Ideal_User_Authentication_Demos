import { User } from "../../@types/User";
import { useState } from "react";

import "./usersTable.css";
import trashCan from "../../assets/icons/Delete.svg";

import Spinner from "../loaders/Spinner";

import { useGlobalContext } from "../../contexts/GlobalContext";

import DeleteUser from "../../api_services/DeleteUser";

const UsersTable = ({ users }: { users: User[] }) => {
  const [loading, toggleLoading] = useState<Record<string, boolean>>({}),
    { selectedBackEnd } = useGlobalContext(),
    handleDelete = DeleteUser();

  return (
    <table>
      <caption
        {...(selectedBackEnd === "express" && { className: "isExpress" })}
      >
        {selectedBackEnd === "spring" ? "Spring" : "Express"} Users
      </caption>
      <thead>
        <tr>
          <th>Email</th>
          <th>Display Name</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>
              <span>Email:</span>
              {user.email}
            </td>
            <td>
              <span>Display Name:</span>
              {user.displayName}
            </td>
            <td>
              <span>Name:</span>
              {user.fullName}
              <button
                onClick={() => {
                  toggleLoading((prev) => ({ ...prev, [user.email]: true }));
                  handleDelete(user).finally(() =>
                    toggleLoading((prev) => ({ ...prev, [user.email]: false }))
                  );
                }}
              >
                {loading[user.email] ? (
                  <Spinner />
                ) : (
                  <img src={trashCan} alt="Delete User" />
                )}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
