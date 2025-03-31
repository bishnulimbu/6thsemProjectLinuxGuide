import { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const { loginUser, token, isAdmin } = useAuth(); // Added isAdmin
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/guides");
      }
    }
  }, [token, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(username, password);
      // Store keepLoggedIn preference (optional: could affect token expiration on backend)
      localStorage.setItem("keepLoggedIn", JSON.stringify(keepLoggedIn));
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // Navigation is handled by useEffect
    } catch (err: any) {
      const errorMessage =
        err.message === "Invalid username or password"
          ? "Invalid username or password."
          : err.message === "Username and password are required"
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
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full">
          <p className="text-gray-600 text-lg text-center mb-6">
            You are already logged in.
          </p>
          <button
            onClick={() => navigate(isAdmin ? "/admin" : "/guide")} // Dynamic redirect
            className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Go to {isAdmin ? "Admin Dashboard" : "Guides"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login Account
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 mb-1.5"
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
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1.5"
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
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="keep-logged-in"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="keep-logged-in" className="text-sm text-gray-600">
              Keep me logged in
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
