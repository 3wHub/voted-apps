import { useEffect, useState } from 'react';
import Container from '@/lib/pages/components/Container';
import { Card, Button, Badge } from 'flowbite-react';
import { formatDate } from '@/lib/helpers/formatDate';
import { NavLink } from 'react-router-dom';
import { ICPService } from '@/services/icp';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/lib/helpers/useAuth';
import { WalletService } from '@/services/wallet';
import { DashboardService } from '@/services/dashboard';
import History from '../votes/history';
import VotingHistory from '@/lib/layout/components/VotingHistory';

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
        <Container>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className='!bg-white text-orange-900 !border-orange-50'>
                    <div className="text-center">
                        <div className="text-lg font-semibold">My Votes</div>
                        <div className="text-3xl font-bold">{stats.voteCount}</div>
                    </div>
                </Card>
                <Card className='!bg-white text-orange-900 !border-orange-50'>
                    <div className="text-center">
                        <div className="text-lg font-semibold">Polls Created</div>
                        <div className="text-3xl font-bold">{stats.createdCount}</div>
                    </div>
                </Card>
                <Card className='!bg-white text-orange-900 !border-orange-50'>
                    <div className="text-center">
                        <div className="text-lg font-semibold">Balance</div>
                        <div className="text-3xl font-bold">
                            {icpBalance !== null ? icpBalance.toFixed(4) : '--'} <span className="text-lg">ICP</span>
                        </div>
                    </div>
                </Card>
            </div>
            {/* My Polls List */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Polls</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <VotingHistory />
            </div>
        </Container>
    );
}
