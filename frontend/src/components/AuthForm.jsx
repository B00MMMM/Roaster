import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login as loginAPI, register as registerAPI } from '../services/api';

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
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
    
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setSubmitStatus('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      let response;
      if (isLogin) {
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

      setSubmitStatus(`${isLogin ? 'Login' : 'Registration'} successful! 🎉`);
      
      // Call the success callback
      if (onAuthSuccess) {
        onAuthSuccess(response.token, response.user);
      }

      // Reset form
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Auth error:', error);
      setSubmitStatus(error.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setSubmitStatus('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-2 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-2 sm:right-10 w-56 sm:w-96 h-56 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-80 h-32 sm:h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-8 border border-orange-500/20">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
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
                  required={!isLogin}
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
                  {isLogin ? 'Logging in...' : 'Registering...'}
                </div>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>

            {submitStatus && (
              <div className={`mt-4 p-3 rounded-md text-center ${
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
              className="text-orange-300 hover:text-orange-200 transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
