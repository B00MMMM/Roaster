import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import SecureForm from '../components/SecureForm';

export default function SecureFormPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-orange-500/20">
          <span className="text-orange-300 text-sm">Welcome, {user.name}!</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded border border-red-500/30 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <SecureForm token={token} user={user} />
    </div>
  );
}
