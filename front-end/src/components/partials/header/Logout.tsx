import { useAuthContext } from "../../../contexts/AuthContext";

const Logout = () => {
  const { currentUser, logOutUser } = useAuthContext();

  return (
    <>
      <div>
        {!currentUser.sessionStatus ? (
          <h2>
            By: <span>David Bishop</span>
          </h2>
        ) : (
          <button
            tabIndex={1}
            className="logoutBtn"
            onClick={() => logOutUser()}
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Logout;
