import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserMenu = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-medium border-2 border-white">
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <span className="text-white hidden md:block">{username}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 border-b">
            <p className="text-sm text-gray-700">Conectado como</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {username}
            </p>
          </div>

          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Perfil</span>
            </div>
          </Link>

          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Configurações</span>
            </div>
          </Link>

          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sair</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenu;
