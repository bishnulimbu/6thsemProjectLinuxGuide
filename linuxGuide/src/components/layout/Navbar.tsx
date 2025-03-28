import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaLinux, FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Title/Logo Section */}
        <Link to="/" className="flex items-center space-x-2 group">
          <FaLinux className="text-3xl text-blue-600 group-hover:text-blue-800 transition" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-900 transition">
            Linux Guide
          </h1>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 focus:outline-none"
          >
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>
          <Link
            to="/guide"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
          >
            Guides
          </Link>
          <Link
            to="/post"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
          >
            Posts
          </Link>
          {token ? (
            <>
              {role === "super_admin" && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-blue-600 transition font-medium"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links - Mobile (Dropdown) */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/guides"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={toggleMenu}
          >
            Guides
          </Link>
          <Link
            to="/posts"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={toggleMenu}
          >
            Posts
          </Link>
          {token ? (
            <>
              {role === "super_admin" && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-blue-600 transition font-medium"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-gray-600 hover:text-blue-600 transition font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
                onClick={toggleMenu}
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
