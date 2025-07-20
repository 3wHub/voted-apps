import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src="./public/voted.png" className="h-17" alt="voteD Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">VoteD</span>
            </NavLink>
          </div>
          <nav className="flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/vote"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Vote
            </NavLink>

            <button type="button" className="block  focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-700 font-medium rounded-lg px-5 py-2">Login</button>

          </nav>
        </div>
      </div>
    </header>
  );
}