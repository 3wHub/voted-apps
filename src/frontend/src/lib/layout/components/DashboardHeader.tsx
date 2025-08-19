import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import { NavLink } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { WalletService } from '@/services/wallet';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function DashboardHeader({ onToggleSidebar, isSidebarOpen }: DashboardHeaderProps) {
  const { isLoggedIn, handleLogout, principal } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [icpBalance, setIcpBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Fetch ICP balance when component mounts or principal changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (principal && isLoggedIn) {
        setBalanceLoading(true);
        try {
          const balance = await WalletService.getIcpBalance(principal);
          setIcpBalance(balance);
        } catch (error) {
          console.error('Failed to fetch ICP balance:', error);
          setIcpBalance(null);
        } finally {
          setBalanceLoading(false);
        }
      } else {
        setIcpBalance(null);
      }
    };

    fetchBalance();
  }, [principal, isLoggedIn]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <NavLink to="/dashboard" className="flex items-center ml-2 lg:ml-0">
              <span className="ml-2 text-xl font-semibold text-gray-900 hidden sm:block">
                Dashboard
              </span>
            </NavLink>
          </div>

          {/* Right side - ICP Balance, Profile */}
          <div className="flex items-center space-x-4">
            {/* ICP Balance */}
            <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white font-bold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM12 4.5L19 8v8l-7 3.5L5 16V8l7-3.5z"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {balanceLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : icpBalance !== null ? (
                  `${icpBalance.toFixed(4)} ICP`
                ) : (
                  '--'
                )}
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {principal?.toString().slice(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {principal?.toString().slice(0, 8) || 'User'}...
                    </p>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {principal?.toString().slice(0, 12) || 'User'}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Member</p>
                    </div>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}
