import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { login, signup, adminSignup } from "../services/api";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Added loading state
  loginUser: (username: string, password: string) => Promise<void>;
  signupUser: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  adminSignupUser: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Load token from localStorage and decode user details on mount
  useEffect(() => {
    const restoreAuthState = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Check if the token is expired
          const decoded: User & { exp: number } = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decoded.exp < currentTime) {
            console.log("Token expired, logging out");
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
          } else {
            setToken(storedToken);
            setUser(decoded);
            console.log("Decoded user on mount:", decoded);
          }
        } catch (err) {
          console.error("Invalid token on mount:", err);
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    restoreAuthState();
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const { token } = await login(username, password);
      setToken(token);
      localStorage.setItem("token", token);
      const decoded: User = jwtDecode(token);
      console.log("Decoded user after login:", decoded);
      setUser(decoded);
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || "Login failed");
    }
  };

  const signupUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      await signup(username, email, password);
      await loginUser(username, password);
    } catch (err: any) {
      console.error("Signup error:", err);
      throw new Error(err.message || "Signup failed");
    }
  };

  const adminSignupUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      await adminSignup({ username, email, password });
      await loginUser(username, password);
    } catch (err: any) {
      console.error("Admin signup error:", err);
      throw new Error(err.message || "Admin signup failed");
    }
  };

  const logout = () => {
    try {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("keepLoggedIn");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const isAuthenticated = !!token;
  const isSuperAdmin = user ? user.role === "super_admin" : false;
  const isAdmin = user
    ? user.role === "admin" || user.role === "super_admin"
    : false;

  useEffect(() => {
    console.log("Auth state:", {
      token,
      user,
      isAuthenticated,
      isSuperAdmin,
      isAdmin,
      isLoading,
    });
  }, [token, user, isAuthenticated, isSuperAdmin, isAdmin, isLoading]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isLoading, // Added to context
    loginUser,
    signupUser,
    adminSignupUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
