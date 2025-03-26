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
      toast.success("Signup Successful. Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  };
  const handleAdminSign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSignup(adminUsername, adminPassword, adminRole);
      toast.success("User created cussessfully!");
      setAdminUsername("");
      setAdminPassword("");
      setAdminRole("user");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  };

  return (
    <div className="signup">
      <h2>Signup</h2>
      <form onSubmit={handlePublicSignup}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
      {token && role === "super_admin" && (
        <div className="admin-signup">
          <h3>Admin: Create User</h3>
          <form onSubmit={handleAdminSign}>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Role:</label>
              <select
                value={adminRole}
                onChange={(e) =>
                  setAdminRole(
                    e.target.value as "super_admin" | "admin" | "user",
                  )
                }
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button type="submit">Create User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;
