import { useAuth } from '@/lib/helpers/useAuth';
import { Link } from 'react-router-dom';

type FooterLink = {
  to: string;
  label: string;
  protected?: boolean;
};
const footerLinks: FooterLink[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/votes/history", label: "History", protected: true }
];

export default function Footer() {
  const { isLoggedIn } = useAuth();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary shadow-lg mt-auto">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse py-5 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <img
              src="/voted.png"
              className="h-15"
              alt="voteD Logo"
              width={40}
              height={40}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">
              VoteD
            </span>
          </Link>

          <ul className="flex flex-wrap items-center font-medium p-4 md:p-0 mt-4 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            {footerLinks.map((link) => (
              (!link.protected || isLoggedIn) && (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-700 hover:text-orange-600 px-3 py-2 text-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>

        <hr className="my-6 border-gray-300 sm:mx-auto" />

        <div className="text-center mb-4">
          <span className="block text-sm text-gray-700">
            © {currentYear}{' '}
            <Link
              to="/"
              className="hover:underline hover:text-orange-600 transition-colors"
            >
              3wHub
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}