import { useState } from 'react';
import { requestRoast } from '../services/api';
import SpinningWheel from './SpinningWheel';

export default function RoastBox() {
  const [name, setName] = useState('');
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Static categories for the wheel
  const categories = ['Savage', 'Friendly', 'Professional', 'Random', 'Witty', 'Gentle', 'Epic', 'Classic'];

  const handleRoast = async () => {
    if (!name.trim()) return alert('Enter a name');
    
    setLoading(true);
    setShowRoast(false);
    setIsWheelSpinning(true);
    
    // Simulate wheel spinning for 2 seconds
    setTimeout(async () => {
      setIsWheelSpinning(false);
      // Select random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setSelectedCategory(randomCategory);
      
      try {
        const res = await requestRoast(name.trim(), 'savage');
        setRoast(res);
        
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setShowRoast(true);
          }, 100);
        }, 500);
      } catch (err) {
        console.error('Error generating roast:', err);
        alert('Error generating roast');
        setLoading(false);
      }
    }, 2000);
  };

  const resetRoast = () => {
    setRoast(null);
    setShowRoast(false);
    setName('');
    setSelectedCategory('');
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
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-orange-500 text-6xl animate-bounce">🔥</span>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
              RoastMe
            </h1>
            <span className="text-orange-500 text-6xl animate-bounce delay-200">🔥</span>
          </div>
          <p className="text-xl text-slate-300 font-medium animate-slide-up">
            Prepare to get absolutely <span className="text-orange-400 font-bold">ROASTED</span> 🔥
          </p>
          <p className="text-slate-400 mt-2 animate-slide-up delay-200">
            Spin the wheel and let fate decide your roast level!
          </p>
        </div>

        {/* Spinning Wheel */}
        <div className="animate-slide-up delay-300">
          <SpinningWheel 
            isSpinning={isWheelSpinning}
            selectedCategory={selectedCategory}
            categories={categories}
          />
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 backdrop-blur-sm animate-slide-up delay-400 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-300 mb-3">
                <span className="text-orange-500">🎯</span>
                <span className="font-semibold">Target Acquired</span>
              </div>
              <input
                type="text"
                placeholder="Enter your name here..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 px-3 py-2 rounded-md"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRoast();
                  }
                }}
              />
            </div>
          </div>

          <button
            onClick={handleRoast}
            disabled={loading}
            className="relative px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up delay-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">⚡</span>
                Spinning Wheel...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>✨</span>
                Spin & Roast Me!
              </div>
            )}
          </button>
        </div>

        {/* Loading Animation */}
        {loading && !isWheelSpinning && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center items-center gap-2 text-orange-400 text-lg font-semibold">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <span>Crafting your {selectedCategory.toLowerCase()} roast...</span>
            </div>
          </div>
        )}

        {/* Roast Display */}
        {roast && (
          <div className={`transition-all duration-700 transform ${showRoast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-orange-500/30 backdrop-blur-sm shadow-2xl rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  <span className="text-orange-500 text-2xl animate-pulse">🔥</span>
                  <span className="text-red-500 text-2xl animate-pulse delay-100">🔥</span>
                  <span className="text-yellow-500 text-2xl animate-pulse delay-200">🔥</span>
                </div>
                <h3 className="text-2xl font-bold text-orange-400">You've Been Roasted!</h3>
                <div className="ml-auto">
                  <span className="text-sm bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30">
                    {selectedCategory}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700/50">
                <p className="text-slate-200 text-lg leading-relaxed font-medium animate-typewriter">
                  {roast.roast}
                </p>
                <p className="text-slate-400 text-sm mt-3 italic">Source: {roast.source}</p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={resetRoast}
                  className="bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300 px-6 py-2 rounded-md"
                >
                  Spin Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
