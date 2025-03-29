import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { login, signup, adminSignup } from "../services/api";

interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  signupUser: (username: string, password: string) => Promise<void>;
  adminSignupUser: (
    username: string,
    password: string,
    role: string,
  ) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

//authcontext with a default value undefined.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//custom hook to use the authcontext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const { token, role } = await login(username, password);
      setToken(token);
      setRole(role);
      localStorage.setItem("role", role);
      localStorage.setItem("role", role);
    } catch (err: any) {
      throw err;
    }
  };

  const signupUser = async (username: string, password: string) => {
    try {
      await signup(username, password);
      await loginUser(username, password);
    } catch (err) {
      throw err;
    }
  };

  const adminSignupUser = async (
    username: string,
    password: string,
    role: string,
  ) => {
    try {
      await adminSignup(username, password, role);
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const isAuthenticated = !!token;
  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin" || role === "super_admin";

  const value: AuthContextType = {
    token,
    role,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    loginUser,
    signupUser,
    adminSignupUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
