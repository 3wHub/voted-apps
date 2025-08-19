import { useEffect, useState } from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { formatDate } from '@/lib/helpers/formatDate';
import { NavLink } from 'react-router-dom';
import { ICPService } from '@/services/icp';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/lib/helpers/useAuth';
import { WalletService } from '@/services/wallet';
import { DashboardService } from '@/services/dashboard';
import VotingHistory from '@/lib/layout/components/VotingHistory';
import { TrendingUp, Users, Vote, Plus } from 'lucide-react';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const { principal, isLoggedIn } = useAuth();
    const [myPolls, setMyPolls] = useState([]);
    const [stats, setStats] = useState({ voteCount: 0, createdCount: 0 });
    const [icpBalance, setIcpBalance] = useState<number | null>(null);

    useEffect(() => {
        // DashboardService.getMyPolls().then(setMyPolls);
        DashboardService.getMyStats().then(setStats);

        if (principal) {
            WalletService.getIcpBalance(principal!).then(setIcpBalance);
        }
    }, [principal]);

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your voting activities
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NavLink
                    to="/votes/create"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <Plus className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Create Vote</p>
                            <p className="text-sm text-gray-500">Start new poll</p>
                        </div>
                    </div>
                </NavLink>

                <NavLink
                    to="/votes"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Vote className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Browse Votes</p>
                            <p className="text-sm text-gray-500">Explore polls</p>
                        </div>
                    </div>
                </NavLink>

                <NavLink
                    to="/votes/history"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">My Polls History</p>
                            <p className="text-sm text-gray-500">View poll</p>
                        </div>
                    </div>
                </NavLink>

                <NavLink
                    to="/wallet"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Wallet</p>
                            <p className="text-sm text-gray-500">Manage funds</p>
                        </div>
                    </div>
                </NavLink>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Vote className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">My Votes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.voteCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Plus className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Polls Created</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.createdCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">₿</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">ICP Balance</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {icpBalance !== null ? icpBalance.toFixed(4) : '--'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Poll */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Poll</h2>
                        <NavLink
                            to="/votes/history"
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                            View all
                        </NavLink>
                    </div>
                </div>
                <div className="p-6">
                    <VotingHistory />
                </div>
            </div>
        </div>
    );
}
