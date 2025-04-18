
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthState, User, UserRole } from "@/lib/types";

// Django backend URL
const API_URL = "http://localhost:8000/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/auth/user/`);
          
          setState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Authentication error:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout/`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const checkPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!state.user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(state.user.role);
    }
    
    return state.user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

