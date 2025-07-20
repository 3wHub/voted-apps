import { RouteObject } from 'react-router-dom';
import Layout from '@/lib/layout';
import Home from '@/lib/pages/home';
import Vote from '@/lib/pages/home/vote';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'vote', element: <Vote /> },
    ],
  },
];