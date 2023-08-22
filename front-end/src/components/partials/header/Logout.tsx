import { useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import OverlayLoader from "../../loaders/OverlayLoader";

const Logout = () => {
  const [loading, toggleLoading] = useState(false),
    { currentUser, logOutUser } = useAuthContext();

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
            onClick={() => {
              toggleLoading(true);
              logOutUser().finally(() => toggleLoading(false));
            }}
          >
            Logout
          </button>
        )}
      </div>
      {loading && <OverlayLoader />}
    </>
  );
};

export default Logout;
