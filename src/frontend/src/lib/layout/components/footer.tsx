function Footer() {
  return (
    <footer className="bg-secondary shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse py-5">
            <img src="./public/voted.png" className="h-17" alt="voteD Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">VoteD</span>
          </a>
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0">Beranda</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0">About</a>
            </li>

          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-900 sm:text-center">
          © {new Date().getFullYear()}{" "}
          <a href="/" className="hover:underline">
            3wHub™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
