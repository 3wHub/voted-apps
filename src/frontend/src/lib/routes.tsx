import { RouteObject } from 'react-router-dom';
import Layout from '@/lib/layout';
import Home from '@/lib/pages/home';
import Vote from '@/lib/pages/votes';
import CreateVote from '@/lib/pages/votes/create';
import About from '@/lib/pages/about';
import Dashboard from '@/lib/pages/dashboard';
import History from '@/lib/pages/votes/history';
import DetailVote from '@/lib/pages/votes/detail';
import ProtectedRoute from '@/lib/layout/components/ProtectedRoute';
import Wallet from '@/lib/pages/wallet';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            {
                path: 'dashboard', element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: 'votes',
                children: [
                    { index: true, element: <Vote /> },
                    { path: ':id', element: <DetailVote /> },
                    {
                        path: 'history',
                        element: (
                            <ProtectedRoute>
                                <History />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute>
                                <CreateVote />
                            </ProtectedRoute>
                        )
                    }
                ],
            },
            { path: 'wallet', element: <Wallet /> }
        ],
    },
];
