import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function LoginButton() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-orange-500/20">
          <span className="text-orange-300 text-sm">Welcome, {user.name}!</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded border border-red-500/30 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
        >
          Login / Register
        </button>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        mode="login"
      />
    </>
  );
}
