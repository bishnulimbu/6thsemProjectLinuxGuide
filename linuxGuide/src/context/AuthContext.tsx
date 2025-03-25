import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { login } from "../api/auth";
import { toast } from "react-toastify";

interface AuthContextType {
  userId: number | null;
  token: string | null;
  role: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(storedToken.split(".")[1]);
        setToken(storedToken);
        setUserId(payload.id);
        setRole(payload.role);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setToken(null);
        setUserId(null);
        setRole(null);
      }
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      setToken(data.token);
      setUserId(data.usedId);
      setRole(payload.role);
      toast.success("Login Successful");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.remove("token");
    setToken(null);
    setUserId(null);
    setRole(null);
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ token, userId, role, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
