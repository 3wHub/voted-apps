import { useState, useEffect } from 'react';
import { initAuthClient, login, logout, isAuthenticated } from '@/services/auth';

type AuthHookReturn = {
  isLoggedIn: boolean;
  loading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

export function useAuth(): AuthHookReturn {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      await initAuthClient();
      setIsLoggedIn(await isAuthenticated());
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      await login();
      setIsLoggedIn(true);
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logout();
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isLoggedIn, loading, handleLogin, handleLogout };
}
