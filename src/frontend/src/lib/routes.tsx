import { RouteObject } from 'react-router-dom';
import Layout from '@/lib/layout';
import Home from '@/lib/pages/home';
import Vote from '@/lib/pages/votes';
import CreateVote from '@/lib/pages/votes/create';
import About from '@/lib/pages/about';
import History from '@/lib/pages/votes/history';
import Plan from '@/lib/pages/plan/index';
import DetailVote from '@/lib/pages/votes/detail';
import ProtectedRoute from '@/lib/layout/components/ProtectedRoute';
import { WalletPage } from './pages/wallet';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            {
                path: 'plan',
                element: (
                    <ProtectedRoute>
                        <Plan />
                    </ProtectedRoute>
                )
            },
            {
                path: 'votes',
                children: [
                    { index: true, element: <Home /> },
                    { path: 'about', element: <About /> },
                    {
                        path: 'plan',
                        element: (
                            <ProtectedRoute>
                                <Plan />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'votes',
                        children: [
                            { index: true, element: <Home /> },
                            { path: 'about', element: <About /> },
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
                            { path: 'wallet', element: <WalletPage /> }
                        ],
                    },
                ]
            }
        ]
    }
];
