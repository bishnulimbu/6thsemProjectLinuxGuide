import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-8 bg-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand Info */}
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-3">LinuxGuide</h3>
            <p className="text-blue-100 mb-4">
              A platform dedicated to learning Linux for choosing distro and
              installing required tools and software.
            </p>
            <div className="flex gap-4 text-xl">
              <a
                href="https://www.facebook.com/subash.limbu.75470316"
                className="hover:text-blue-300 transition-colors"
              >
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/bishnu-limbu-61a1b2282/"
                className="hover:text-blue-300 transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/about"
                className="text-blue-200 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <a
                href="https://github.com/bishnulimbu/6thsemProjectLinuxGuide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-blue-700 text-center">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <button className="flex items-center gap-2 border border-white hover: text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Support LinuxGuide
            </button>
            <p className="text-blue-100 text-sm leading-relaxed px-4">
              Your contribution helps us stay independent and continue our
              mission of promoting guides and instructions for Linux and its
              programs. With your support, we can build a wider variety of Linux
              content.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-blue-700 text-center text-blue-200 text-sm">
          <p>
            © {new Date().getFullYear()} Linux Guide App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
