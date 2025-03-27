import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = (): React.ReactElement => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { token, logout, role } = useAuth();

  const toggleNav = (): void => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="flex justify-between items-center py-2">
      <div className="logo">
        <h1 className="text-xl font-bold">Demo App</h1>
      </div>
      <button
        className="md:hidden text-2xl bg-transparent border-none cursor-pointer"
        onClick={toggleNav}
        aria-expanded={isNavOpen ? "true" : "false"}
      >
        {isNavOpen ? "✕" : "≡"}
      </button>
      <ul
        className={`flex gap-5 list-none p-0 m-0 md:flex-row md:static md:bg-transparent md:shadow-none md:p-0 ${
          isNavOpen
            ? "flex flex-col absolute top-14 left-0 right-0 bg-white shadow-md p-2"
            : "hidden md:flex"
        }`}
      >
        <li>
          <Link to="/" className="no-underline text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/guide"
            className="no-underline text-blue-500 hover:underline"
          >
            Guides
          </Link>
        </li>
        <li>
          <Link
            to="/post"
            className="no-underline text-blue-500 hover:underline"
          >
            Posts
          </Link>
        </li>
        {token ? (
          <>
            <li>
              <Link
                to="/create-post"
                className="no-underline text-blue-500 hover:underline"
              >
                Create Post
              </Link>
            </li>
            <li>
              <span>Logged in as {role}</span>
            </li>
            <li>
              <button
                onClick={logout}
                className="no-underline text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/signup"
                className="no-underline text-blue-500 hover:underline"
              >
                Signup
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="no-underline text-blue-500 hover:underline"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
