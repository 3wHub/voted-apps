import { useAuth } from '@/lib/helpers/useAuth';
import { Spinner } from 'flowbite-react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isLoggedIn, loading } = useAuth(); 
    
    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <Spinner aria-label="Loading..." size="sm" />
                <span className="pl-3">Loading...</span>
            </div>
        );
    }

    if (!isLoggedIn) { 
        return <Navigate to="/" replace />;
    }

    return children;
}