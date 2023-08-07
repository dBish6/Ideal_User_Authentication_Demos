import { User } from "../../@types/User";
import "./usersTable.css";
import { useGlobalContext } from "../../contexts/GlobalContext";

const UsersTable = ({ users }: { users: User[] }) => {
  const { selectedBackEnd } = useGlobalContext();

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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
