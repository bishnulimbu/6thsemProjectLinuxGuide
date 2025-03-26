import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { token, logout, role } = useAuth();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>DemoApp</h1>
      </div>
      <button
        className="nav-toggle"
        onClick={toggleNav}
        aria-expanded={isNavOpen ? "true" : "false"}
      >
        {isNavOpen ? "✕" : "≡"}
      </button>
      <ul className={`nav-links ${isNavOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/guide">Guides</Link>
        </li>
        <li>
          <Link to="/post">Posts</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/create-post">Create Post</Link>
            </li>
            <li>
              <span>Logged in as {role}</span>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
