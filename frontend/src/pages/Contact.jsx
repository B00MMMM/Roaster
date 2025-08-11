import { useState } from 'react';
import { submitFeedback } from '../services/api';

export default function Contact() {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [message, setMessage] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitStatus, setSubmitStatus] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !message) {
          setSubmitStatus('Please fill in all fields');
          return;
        }

        setIsSubmitting(true);
        setSubmitStatus('');

        try {
          await submitFeedback({
            name,
            email,
            message,
          });

          setSubmitStatus('Thank you! Your message has been sent successfully. 🎉');
          setName('');
          setEmail('');
          setMessage('');
        } catch (error) {
          console.error('Error submitting feedback:', error);
          setSubmitStatus('Sorry, there was an error sending your message. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-orange-500/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-6">Contact Us</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-orange-300 mb-3">Get in Touch</h2>
              <p className="text-slate-300 mb-4 text-lg leading-relaxed">
                Have feedback about our roasts? Want to suggest improvements? 
                We'd love to hear from you!
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {submitStatus && (
                <div className={`p-3 rounded-md text-center ${
                  submitStatus.includes('Thank you') 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {submitStatus}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-200 placeholder-slate-400 transition-all duration-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Email
                </label>
                <input
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-200 placeholder-slate-400 transition-all duration-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Message
                </label>
                <textarea
                  rows="4" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-200 placeholder-slate-400 transition-all duration-300"
                  placeholder="Tell us what you think..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-md font-semibold transform transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message 🔥'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
