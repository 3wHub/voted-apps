import { useAuth } from "@/lib/helpers/useAuth";

export default function LoginButton() {
  const { isLoggedIn, loading, handleLogin, handleLogout } = useAuth();

  return (
    <button
      type="button"
      className="block focus:outline-none px-3 py-1 text-[16px] md:text-lg md:px-4 md:py-2 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-700 font-medium rounded-lg "
      onClick={isLoggedIn ? handleLogout : handleLogin}
      disabled={loading}
    >
      {loading ? "Loading..." : isLoggedIn ? "Logout" : "Login"}
    </button>
  );
}
