import { useRoutes } from 'react-router-dom';
import { routes } from '@/lib/routes';

export default function App() {
  return useRoutes(routes);
}