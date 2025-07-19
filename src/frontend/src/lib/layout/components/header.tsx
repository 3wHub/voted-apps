function Header() {
  return (

    <nav className="bg-secondary shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse py-5">
          <img src="./public/voted.png" className="h-17" alt="voteD Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">VoteD</span>
        </a>
        <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0">Beranda</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0">About</a>
            </li>
            <li className="flex justify-center">
              <button type="button" className="block  focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-700 font-medium rounded-lg px-5 py-2">Login</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
}

export default Header;
