import { RouteObject } from 'react-router-dom';
import Layout from '@/lib/layout';
import DashboardLayout from '@/lib/layout/DashboardLayout';
import Home from '@/lib/pages/home';
import Vote from '@/lib/pages/votes';
import CreateVote from '@/lib/pages/votes/create';
import About from '@/lib/pages/about';
import Dashboard from '@/lib/pages/dashboard';
import History from '@/lib/pages/votes/history';
import Plan from '@/lib/pages/plan/index';
import DetailVote from '@/lib/pages/votes/detail';
import ProtectedRoute from '@/lib/layout/components/ProtectedRoute';
import Wallet from '@/lib/pages/wallet';
import FAQ from './pages/faq';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'faq', element: <FAQ /> },
            { path: 'votes', element: <Vote /> },
            { path: 'votes/:id', element: <DetailVote /> },
        ]
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'plan', element: <Plan /> },
            { path: 'wallet', element: <Wallet /> },
            { path: 'votes/create', element: <CreateVote /> },
            { path: 'votes/history', element: <History /> },
        ]
    }
];
