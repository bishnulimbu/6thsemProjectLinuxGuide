import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { signup, adminSignup } from "../services/api";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<"super_admin" | "admin" | "user">(
    "user",
  );
  const { role, token } = useAuth();
  const navigate = useNavigate();

  const handlePublicSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, password);
      toast.success("Signup Successful. Please log in.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed", {
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

  const handleAdminSign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSignup(adminUsername, adminPassword, adminRole);
      toast.success("User created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setAdminUsername("");
      setAdminPassword("");
      setAdminRole("user");
    } catch (err: any) {
      toast.error(err.message || "Signup failed", {
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
            Create Account
          </h3>
          <form onSubmit={handlePublicSignup} className="space-y-5">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>

          {token && role === "super_admin" && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Admin: Create User
              </h4>
              <form onSubmit={handleAdminSign} className="space-y-5">
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-username"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    placeholder="admin@gmail.com"
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-role"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Role
                  </label>
                  <select
                    id="admin-role"
                    value={adminRole}
                    onChange={(e) =>
                      setAdminRole(
                        e.target.value as "super_admin" | "admin" | "user",
                      )
                    }
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
                >
                  Create User
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
