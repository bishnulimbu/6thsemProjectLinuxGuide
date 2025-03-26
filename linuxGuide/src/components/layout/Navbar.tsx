import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>DemoApp</h1>
      </div>
      <button className="nav-toggle" onClick={toggleNav}>
        {isNavOpen ? "✖" : "☰"}
      </button>
      <ul className={`nav-links ${isNavOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/post">Posts</Link>
        </li>
        <li>
          <Link to="/guide">Guides</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
