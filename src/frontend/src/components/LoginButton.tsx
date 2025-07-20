import { useState, useEffect } from 'react';
import { initAuthClient, login, logout, isAuthenticated } from '../services/auth';

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      await initAuthClient();
      setIsLoggedIn(await isAuthenticated());
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setLoading(false);
  };

  if (loading) return <button disabled>Loading...</button>;

  return isLoggedIn ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Login with Internet Identity</button>
  );
}
