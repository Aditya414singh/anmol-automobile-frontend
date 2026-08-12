import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { webUtilsApi } from "../api/webUtilsApi";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isManager: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE LOGIN SESSION
  // ==========================================

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem(
        "anmol-access-token"
      );

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser =
          await webUtilsApi.getMe();

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Failed to restore session:",
          error
        );

        localStorage.removeItem(
          "anmol-access-token"
        );

        localStorage.removeItem(
          "anmol-refresh-token"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await webUtilsApi.login({
      email,
      password,
    });

    /*
      Backend response:

      {
        success: true,
        message: "Login successful.",
        data: {
          access: "...",
          refresh: "...",
          user: {...}
        }
      }
    */

    localStorage.setItem(
      "anmol-access-token",
      response.data.access
    );

    localStorage.setItem(
      "anmol-refresh-token",
      response.data.refresh
    );

    setUser(response.data.user);
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    passwordConfirm: string
  ) => {
    /*
      Backend expects:

      {
        name,
        email,
        phone,
        password,
        confirm_password
      }

      Registration does NOT return
      access/refresh tokens.
    */

    await webUtilsApi.register({
      name,
      email,
      phone,
      password,
      confirm_password: passwordConfirm,
    });
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(
      "anmol-access-token"
    );

    localStorage.removeItem(
      "anmol-refresh-token"
    );

    setUser(null);
  };

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),

        // We will verify the exact role value
        // from your User model before relying
        // on this for Manager protection.
        isManager: user?.role === "MANAGER",

        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// useAuth HOOK
// ==========================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};