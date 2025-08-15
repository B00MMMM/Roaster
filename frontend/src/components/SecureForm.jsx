import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { submitFormData } from '../services/api';
import AuthModal from './AuthModal';

export default function SecureForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { isAuthenticated, token, user, logout } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await submitFormData(formData, token);
      setSubmitStatus('Form submitted successfully! 🎉');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        setIsAuthModalOpen(true);
        setSubmitStatus('Session expired. Please login again.');
      } else {
        setSubmitStatus('Sorry, there was an error submitting your form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      message: ''
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-2 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-2 sm:right-10 w-56 sm:w-96 h-56 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-80 h-32 sm:h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* User info and logout button */}
      {isAuthenticated && user && (
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
      )}

      {/* Login button for non-authenticated users */}
      {!isAuthenticated && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
          >
            Login / Register
          </button>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-8 border border-orange-500/20">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
            {isAuthenticated ? 'Secure Form' : 'Please Login to Access Form'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-orange-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!token}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={token ? "Enter your full name" : "Please login to fill this form"}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-orange-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!token}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={token ? "Enter your email address" : "Please login to fill this form"}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-orange-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                disabled={!token}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={token ? "Enter your message..." : "Please login to fill this form"}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {!token ? (
                'Please Login First'
              ) : isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Submitting...
                </div>
              ) : (
                'Submit Form'
              )}
            </button>

            {submitStatus && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                submitStatus.includes('successfully') 
                  ? 'bg-green-600/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-600/20 border border-red-500/30 text-red-300'
              }`}>
                {submitStatus}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        mode="login"
      />
    </div>
  );
}