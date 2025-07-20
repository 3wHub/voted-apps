import { useEffect, useState } from 'react';
import AuthStatus from './components/AuthStatus';
import LoginButton from './components/LoginButton';

function App() {
  return (
    <div>
      <h1>Voted</h1>
      <AuthStatus />
      <LoginButton />
    </div>
  );
}

export default App;
