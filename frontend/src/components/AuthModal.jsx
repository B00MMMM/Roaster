import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login as loginAPI, register as registerAPI } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, mode = 'login' }) {
  const [authMode, setAuthMode] = useState(mode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || (authMode === 'register' && !formData.name)) {
      setSubmitStatus('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      let response;
      if (authMode === 'login') {
        response = await loginAPI({
          email: formData.email,
          password: formData.password
        });
        
        // Use the context login method which will show toast
        login(response.token, response.user);
      } else {
        response = await registerAPI({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Use the context register method which will show toast
        register(response.token, response.user);
      }

      setSubmitStatus(`${authMode === 'login' ? 'Login' : 'Registration'} successful! 🎉`);
      
      // Call the success callback
      if (onAuthSuccess) {
        onAuthSuccess(response.token, response.user);
      }

      // Reset form and close modal
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Auth error:', error);
      setSubmitStatus(error.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setSubmitStatus('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleModalClose = () => {
    setFormData({ name: '', email: '', password: '' });
    setSubmitStatus('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 min-h-screen">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-2xl w-full max-w-md border border-orange-500/20 relative mx-auto">
        {/* Close button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-6 text-center">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
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
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={authMode === 'register'}
                />
              </div>
            )}

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
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-orange-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span>
                  {authMode === 'login' ? 'Logging in...' : 'Registering...'}
                </div>
              ) : (
                authMode === 'login' ? 'Login' : 'Register'
              )}
            </button>

            {submitStatus && (
              <div className={`mt-4 p-3 rounded-md text-center text-sm ${
                submitStatus.includes('successful') 
                  ? 'bg-green-600/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-600/20 border border-red-500/30 text-red-300'
              }`}>
                {submitStatus}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-orange-300 hover:text-orange-200 transition-colors duration-200 text-sm"
            >
              {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
