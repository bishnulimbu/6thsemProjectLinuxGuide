import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaLinux, FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, isLoading, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the user is an admin or super admin
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  // Show a loading state while auth is being restored
  if (isLoading) {
    return (
      <nav className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center max-w-full mx-auto">
          <Link to="/" className="flex items-center space-x-2 group">
            <FaLinux className="text-3xl text-blue-600 group-hover:text-blue-800 transition" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-900 transition">
              Linux Guide
            </h1>
          </Link>
          <div className="text-gray-600">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center max-w-full mx-auto">
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
            aria-label={isOpen ? "Close menu" : "Open menu"}
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
          {/* Show Home, Guides, and Posts links only for non-admins */}
          {!isAdminOrSuperAdmin && (
            <>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Home
              </Link>
              <Link
                to="/guides"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Guides
              </Link>

              <Link
                to="/try-linux"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Terminal
              </Link>
              <Link
                to="/posts"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Posts
              </Link>
            </>
          )}
          {token ? (
            <>
              {(isAdmin || isSuperAdmin) && (
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
          {/* Show Home, Guides, and Posts links only for non-admins */}
          {!isAdminOrSuperAdmin && (
            <>
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
            </>
          )}
          {token ? (
            <>
              {(isAdmin || isSuperAdmin) && (
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
