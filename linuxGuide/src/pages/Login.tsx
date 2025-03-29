import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { loginUser, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/guide");
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? "Invalid username or password."
          : err.status === 400
            ? "Username and password are required."
            : err.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  if (token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">You are already logged in.</p>
          <button
            onClick={() => navigate("/guide")}
            className="mt-4 px-6 py-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Go to Guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg mt-10">
        {/* Left Section - Decorative */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 diagonal-pattern p-8 flex items-center justify-center">
          {/* Empty decorative section (patterned background only) */}
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Login Account
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-gray-600 uppercase mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin@gmail.com"
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-600 uppercase mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="keep-logged-in"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="keep-logged-in" className="text-sm text-gray-600">
                Keep me logged in
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
