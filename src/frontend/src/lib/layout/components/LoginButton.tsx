import { useAuth } from "@/lib/helpers/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
    const { isLoggedIn, loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            handleLogin();
        }
    };

    return (
        <button
            type="button"
            className="block focus:outline-none px-3 py-1 text-[16px] md:text-lg md:px-4 md:py-2 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-700 font-medium rounded-lg "
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? "Loading..." : isLoggedIn ? "Dashboard" : "Login"}
        </button>
    );
}
