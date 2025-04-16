import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu"; // Importe o novo componente

function Navbar({ searchQuery, onSearchChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const clearSearch = () => {
    onSearchChange({ target: { value: "" } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <header className="top__header fixed top-0 left-0 w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg pt-4 pb-4 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-0">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white text-3xl cursor-pointer">
            <FaHome />
          </Link>
          {location.pathname !== "/add-artist" &&
            location.pathname !== "/add-album" && (
              <div className="search__wrp relative flex items-center border border-gray-600 rounded-lg overflow-hidden mx-auto w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Procurar por"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={onSearchChange}
                  className="bg-gray-200 text-black placeholder-gray-400 py-2 px-3 pr-10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out w-full"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Registrar
              </Link>
              <Link
                to="/login"
                className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Iniciar Sessão
              </Link>
            </>
          ) : (
            <UserMenu username={username} onLogout={handleLogout} />
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="block md:hidden text-white text-2xl p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800 shadow-lg px-4 py-2 mt-4 rounded-lg"
          >
            <div className="flex flex-col space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/register"
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={toggleMenu}
                  >
                    Registrar
                  </Link>
                  <Link
                    to="/login"
                    className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={toggleMenu}
                  >
                    Iniciar Sessão
                  </Link>
                </>
              ) : (
                <div className="p-2">
                  <UserMenu username={username} onLogout={handleLogout} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

Navbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default Navbar;
