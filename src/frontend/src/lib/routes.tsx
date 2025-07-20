import { RouteObject } from 'react-router-dom';
import Layout from '@/lib/layout';
import Home from '@/lib/pages/home';
import Vote from '@/lib/pages/votes';
import CreateVote from '@/lib/pages/votes/create';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'votes', element: <Vote /> },
      { path: 'votes-create', element: <CreateVote /> },
    ],
  },
];