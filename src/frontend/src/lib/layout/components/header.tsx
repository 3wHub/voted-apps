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
  { to: "/votes/history", label: "History", protected: true }
];

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src="./voted.png" className="h-15" alt="voteD Logo" />
              <span className="self-center ml-2 text-2xl font-semibold whitespace-nowrap">VoteD</span>
            </NavLink>
          </div>
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              (!link.protected || isLoggedIn) && (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-lg font-medium ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ))}
            <LoginButton />
          </nav>
        </div>
      </div>
    </header>
  );
}