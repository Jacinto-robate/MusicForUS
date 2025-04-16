import PropTypes from "prop-types";

function Logout({ setAuthToken }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// Define a validação para `setAuthToken` como função
Logout.propTypes = {
  setAuthToken: PropTypes.func.isRequired,
};

export default Logout;
