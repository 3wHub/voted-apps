import { useState, useEffect } from 'react';
import { initAuthClient, login, logout, isAuthenticated, getPrincipal } from '@/services/auth';

type AuthHookReturn = {
    isLoggedIn: boolean;
    loading: boolean;
    principal: string | null;
    handleLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
};

export function useAuth(): AuthHookReturn {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [principal, setPrincipal] = useState<string | null>(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                await initAuthClient();
                const authenticated = await isAuthenticated();
                setIsLoggedIn(authenticated);
                setPrincipal(authenticated ? getPrincipal()?.toString() || null : null);
            } catch (error) {
                console.error("Auth initialization failed:", error);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
        try {
            await login();
            const authenticated = await isAuthenticated();
            setIsLoggedIn(authenticated);
            setPrincipal(authenticated ? getPrincipal()?.toString() || null : null);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        setLoading(true);
        try {
            await logout();
            setIsLoggedIn(false);
            setPrincipal(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { 
        isLoggedIn, 
        loading, 
        principal, 
        handleLogin, 
        handleLogout
    };
}