import { useEffect, useState } from 'react';
import { whoAmI, isAuthenticated } from '../../../services/auth';

export default function AuthStatus() {
  const [principal, setPrincipal] = useState('');

  useEffect(() => {
    async function checkAuth() {
      if (await isAuthenticated()) {
        setPrincipal(await whoAmI());
      }
    }
    checkAuth();
  }, []);

  return (
    <div>
      {principal ? (
        <p>Authenticated as: <code>{principal}</code></p>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
}
