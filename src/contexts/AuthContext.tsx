
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthState, User, UserRole } from "@/lib/types";

// Mock API URL - replace with actual Django backend URL in production
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
      if (state.token) {
        try {
          // Set default Authorization header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
          
          // In production, fetch current user from your Django backend
          const response = await axios.get(`${API_URL}/users/me/`);
          
          setState({
            ...state,
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Authentication error:", error);
          localStorage.removeItem("token");
          setState({
            ...state,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState({
          ...state,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, [state.token]);

  const login = async (email: string, password: string) => {
    try {
      // In production, call your Django backend
      const response = await axios.post(`${API_URL}/auth/login/`, {
        email,
        password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      
      setState({
        ...state,
        user,
        token,
        isAuthenticated: true,
      });
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setState({
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
    });
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
