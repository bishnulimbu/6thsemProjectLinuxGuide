import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-5 border-t border-gray-200 text-center flex-shrink-0">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-5">
          <Link
            to="/about"
            className="no-underline text-blue-500 hover:underline"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="no-underline text-blue-500 hover:underline"
          >
            Contact
          </Link>
          <a
            href="https://github.com/bishnulimbu/6thsemProjectLinuxGuide"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-blue-500 hover:underline"
          >
            GitHub
          </a>
        </div>
        <div className="text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Linux Guide App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
