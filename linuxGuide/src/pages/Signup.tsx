import { useState } from "react";
import { signup } from "../api/auth";
import { SignupRequest } from "../api/types";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      setSuccess(response.message);
      setError(null);
      // Redirect to login or home page
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
      setSuccess(null);
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
