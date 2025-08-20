import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Vote,
    CreditCard,
    Wallet,
    History,
    Plus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Vote',
        href: '#',
        icon: Vote,
        children: [
            {
                name: 'All Votes',
                href: '/votes',
                icon: Vote,
            },
            {
                name: 'Create Vote',
                href: '/votes/create',
                icon: Plus,
            },
            {
                name: 'Vote History',
                href: '/votes/history',
                icon: History,
            },
        ],
    },
    {
        name: 'Plan',
        href: '/plan',
        icon: CreditCard,
    },
    {
        name: 'Wallet',
        href: '/wallet',
        icon: Wallet,
    },
];

export default function DashboardSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: DashboardSidebarProps) {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const { subscription } = useUserSubscription();

    const isActiveLink = (href: string) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        if (href === '/votes') {
            return location.pathname === '/votes' && !location.pathname.includes('/create') && !location.pathname.includes('/history');
        }
        return location.pathname.startsWith(href);
    };

    // Determine if sidebar should show full content (expanded or hovered)
    const showFullContent = !isCollapsed || isHovered;

    const NavItem = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
        const isActive = isActiveLink(item.href);

        return (
            <div className="relative group">
                <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative',
                        isChild ? 'ml-6' : '',
                        isActive
                            ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                        !showFullContent && !isChild ? 'justify-center' : ''
                    )}
                >
                    <item.icon
                        className={cn(
                            'flex-shrink-0 h-5 w-5 transition-colors duration-200',
                            showFullContent && !isChild ? 'mr-3' : 'mr-2',
                            isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                    />
                    {(showFullContent || isChild) && (
                        <span className="flex-1 truncate">{item.name}</span>
                    )}
                </NavLink>
            </div>
        );
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out',
                    // Mobile behavior
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    // Desktop behavior
                    isCollapsed && !isHovered ? 'lg:static lg:w-16' : 'lg:w-64',
                    isCollapsed && isHovered ? 'lg:fixed lg:z-50 lg:shadow-2xl' : 'lg:static',
                    // Width
                    isCollapsed && !isHovered ? 'w-16' : 'w-64'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header - NO HOVER AREA */}
                    <div className={cn(
                        "flex items-center justify-between p-4 border-b border-gray-200",
                        showFullContent ? 'px-4' : 'px-2'
                    )}>
                        {showFullContent && (
                            <NavLink to={'/'}>
                                <div className="flex items-center">
                                    <img src="/voted.png" className="h-8 w-8 object-contain flex-shrink-0" alt="VoteD Logo" />
                                    <span className="ml-2 text-lg font-semibold text-gray-900 lg:block hidden">VoteD</span>
                                </div>
                            </NavLink>
                        )}

                        {!showFullContent && (
                            <NavLink to={'/'}>
                                <div className="flex justify-center w-full">
                                    <img src="/voted.png" className="h-8 w-8 object-contain flex-shrink-0" alt="VoteD Logo" />
                                </div>
                            </NavLink>
                        )}

                        {/* Toggle button - always visible on desktop */}
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:block p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </button>

                        {/* Close button - only visible on mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 flex-shrink-0"
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Hover area container for navigation and footer */}
                    <div
                        className="flex flex-col flex-1"
                        onMouseEnter={() => isCollapsed && setIsHovered(true)}
                        onMouseLeave={() => isCollapsed && setIsHovered(false)}
                    >
                        {/* Navigation - WITH HOVER AREA */}
                        <nav className={cn(
                            "flex-1 py-4 space-y-1",
                            showFullContent ? 'px-4 overflow-x-hidden' : 'px-2'
                        )}>
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <div key={item.name}>
                                        <NavItem item={item} />
                                        {item.children && showFullContent && (
                                            <div className="mt-1 space-y-1">
                                                {item.children.map((child) => (
                                                    <NavItem key={child.name} item={child} isChild />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </nav>

                        {/* Sidebar footer - WITH HOVER AREA - only show when showing full content */}
                        {showFullContent && subscription.type === 'free' && (
                            <div className="flex-shrink-0 p-4 border-t border-gray-200">
                                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                                                <CreditCard className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">Upgrade Plan</p>
                                            <p className="text-xs text-gray-500">Get more features</p>
                                        </div>
                                    </div>
                                    <NavLink
                                        to="/plan"
                                        onClick={onClose}
                                        className="mt-3 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:from-orange-600 hover:to-pink-600 transition-colors duration-200 text-center block"
                                    >
                                        Upgrade Now
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
