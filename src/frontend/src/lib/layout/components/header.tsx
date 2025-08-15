import { useState } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import LoginButton from '@/lib/layout/components/LoginButton';
import { NavLink } from 'react-router-dom';

type NavLinkItem = {
    to: string;
    label: string;
    protected?: boolean;
};

const navLinks: NavLinkItem[] = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/votes/history", label: "History", protected: true },
    { to: "/wallet", label: "Wallet", protected: true }
];

export default function Header() {
    const { isLoggedIn } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex items-center">
                            <img src="./voted.png" className="h-10 md:h-14" alt="voteD Logo" />
                            <span className="self-center ml-2 text-lg sm:text-2xl font-semibold whitespace-nowrap">VoteD</span>
                        </NavLink>
                    </div>
                    {/* Desktop Menu */}
                    <div className='flex items-center space-x-4'>
                        <nav className="hidden lg:flex space-x-6">
                            {navLinks.map(
                                (link) =>
                                    (!link.protected || isLoggedIn) && (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `px-3 py-2 rounded-md font-medium text-sm sm:text-base ${isActive
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`
                                            }
                                        >
                                            {link.label}
                                        </NavLink>
                                    )
                            )}
                        </nav>
                        {/* Login Button (Always Visible) */}
                        <div className="hidden lg:block">
                            <LoginButton />
                        </div>

                        {/* Hamburger Menu Button */}

                        {!isLoggedIn && (
                            <div className="block lg:hidden">
                                <LoginButton />
                            </div>
                        )}

                        <button
                            className="block lg:hidden p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Off-Canvas Menu */}
            {/* Login Button for Mobile */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } lg:hidden`}
            >
                <button
                    className="absolute top-4 right-4 p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <nav className="mt-16 space-y-4 px-4">
                    {navLinks.map(
                        (link) =>
                            (!link.protected || isLoggedIn) && (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md font-medium text-sm sm:text-base ${isActive
                                            ? "bg-orange-100 text-orange-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            )
                    )}
                    {isLoggedIn && (
                        <div className="block lg:hidden">
                            <LoginButton />
                        </div>
                    )}

                </nav>
            </div>

        </header>
    );
}
