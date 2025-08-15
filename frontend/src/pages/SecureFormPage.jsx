import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import SecureForm from '../components/SecureForm';

export default function SecureFormPage() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleAuthSuccess = () => {
    // Auth success is handled by the context
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-orange-500/20">
          <span className="text-orange-300 text-sm">Welcome, {user.name}!</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded border border-red-500/30 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <SecureForm />
    </div>
  );
}
