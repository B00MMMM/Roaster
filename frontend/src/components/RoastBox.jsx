import { useState, useRef, useEffect } from 'react';
import { requestRoast } from '../services/api';
import SpinningWheel from './SpinningWheel';
import Swal from 'sweetalert2';

// Custom hook for typing effect
function useTypewriter(text, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      setIsComplete(false);
      return;
    }
    
    let index = 0;
    setDisplayed('');
    setIsComplete(false);
    
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      
      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);
    
    return () => {
      clearInterval(interval);
      setIsComplete(false);
    };
  }, [text, speed]);

  return { displayed, isComplete };
}

export default function RoastBox() {
  const [name, setName] = useState('');
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const roastResultRef = useRef(null);

  const categories = ['Savage', 'Friendly', 'Professional', 'Random', 'Witty', 'Gentle', 'Epic', 'Classic'];

  const handleRoast = async () => {
    if (!name.trim()) {
      return Swal.fire({
        title: 'Name Required!',
        text: 'Please enter a name to get roasted 🔥',
        icon: 'warning',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#f97316',
        background: '#1e293b',
        color: '#f1f5f9',
        customClass: {
          popup: 'border border-orange-500/20'
        }
      });
    }

    setLoading(true);
    setShowRoast(false);
    setIsWheelSpinning(true);

    setTimeout(async () => {
      setIsWheelSpinning(false);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setSelectedCategory(randomCategory);

      try {
        const res = await requestRoast(name.trim(), 'savage');
        setRoast(res);

        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setShowRoast(true);
            // Initial scroll when roast appears
            setTimeout(() => {
              roastResultRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });
            }, 100);
          }, 100);
        }, 500);
      } catch (err) {
        console.error('Error generating roast:', err);
        Swal.fire({
          title: 'Oops! Something went wrong 😅',
          text: 'Failed to generate roast. The AI might be taking a coffee break!',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#f97316',
          background: '#1e293b',
          color: '#f1f5f9',
          customClass: {
            popup: 'border border-red-500/20'
          }
        });
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

  // Typewriter effect for roast text
  const { displayed: typedRoast, isComplete: typewriterComplete } = useTypewriter(roast?.roast || '', 35);

  // Auto-scroll when roast appears and when typewriter completes
  useEffect(() => {
    if (showRoast && roastResultRef.current) {
      // Initial scroll when roast appears
      setTimeout(() => {
        const element = roastResultRef.current;
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 300);
    }
  }, [showRoast]);

  useEffect(() => {
    if (typewriterComplete && showRoast) {
      // Final scroll to bottom when typewriter completes
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 500);
    }
  }, [typewriterComplete, showRoast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-5 sm:top-20 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl mt-16">
        
        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:block">
          {/* Header */}
          <div className="text-center mb-36 animate-fade-in lg:scale-105 xl:scale-110">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="text-orange-500 text-4xl sm:text-6xl animate-bounce">🔥</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
                RoastMe
              </h1>
              <span className="text-orange-500 text-4xl sm:text-6xl animate-bounce delay-200">🔥</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-medium animate-slide-up">
              Prepare to get absolutely <span className="text-orange-400 font-bold">ROASTED</span> 🔥
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 mt-2 animate-slide-up delay-200">
              Spin the wheel and let fate decide your roast level!
            </p>
          </div>

          {/* Spinning Wheel + Button Row */}
          <div className="animate-slide-up delay-300 mb-24 lg:scale-105 xl:scale-110">
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Spinning Wheel - Larger Size */}
              <div className="w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 flex items-center justify-center">
                <SpinningWheel
                  isSpinning={isWheelSpinning}
                  selectedCategory={selectedCategory}
                  categories={categories}
                />
              </div>

              {/* Button - Adjusted to match wheel height */}
              <button
                onClick={handleRoast}
                disabled={loading}
                className="w-60 h-56 sm:h-72 lg:h-60 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white ml-14 mb-12 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex flex-col items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin text-2xl">⚡</span>
                    <span className="text-center">Spinning<br />Wheel...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    
                    <span className="text-center font-bold"><span className="text-3xl">🔥</span>ROAST ME!<span className="text-3xl">🔥</span></span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex justify-center mb-12 w-full px-2 sm:px-0 lg:scale-105 xl:scale-110">
            <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 lg:p-8">
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
          </div>

          {/* Loading Animation */}
          {loading && !isWheelSpinning && (
            <div className="text-center mb-12 animate-fade-in">
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
            <div
              ref={roastResultRef}
              className={`transition-all duration-700 transform ${
                showRoast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-orange-500/30 backdrop-blur-sm shadow-2xl rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 lg:scale-105 xl:scale-110">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    <span className="text-orange-500 text-xl sm:text-2xl animate-pulse">🔥</span>
                    <span className="text-red-500 text-xl sm:text-2xl animate-pulse delay-100">🔥</span>
                    <span className="text-yellow-500 text-xl sm:text-2xl animate-pulse delay-200">🔥</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-400">
                    You've Been Roasted!
                  </h3>
                  <div className="ml-auto">
                    <span className="text-xs sm:text-sm bg-orange-600/20 text-orange-300 px-2 sm:px-3 py-1 rounded-full border border-orange-500/30">
                      {selectedCategory}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 md:p-6 border border-slate-700/50">
                  <p className="text-slate-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed sm:leading-loose font-medium break-words">
                    {typedRoast}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-3 italic">
                    Source: {roast.source}
                  </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={resetRoast}
                    className="px-4 sm:px-6 lg:px-8 py-2 lg:py-3 bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300 rounded-md"
                  >
                    Spin Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout (below lg) - Original Design */}
        <div className="lg:hidden">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="text-orange-500 text-4xl sm:text-6xl animate-bounce">🔥</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
                RoastMe
              </h1>
              <span className="text-orange-500 text-4xl sm:text-6xl animate-bounce delay-200">🔥</span>
            </div>
            <p className="text-lg sm:text-xl text-slate-300 font-medium animate-slide-up">
              Prepare to get absolutely <span className="text-orange-400 font-bold">ROASTED</span> 🔥
            </p>
            <p className="text-sm sm:text-base text-slate-400 mt-2 animate-slide-up delay-200">
              Spin the wheel and let fate decide your roast level!
            </p>
          </div>

          {/* Spinning Wheel */}
          <div className="animate-slide-up delay-300 mb-6">
            <SpinningWheel
              isSpinning={isWheelSpinning}
              selectedCategory={selectedCategory}
              categories={categories}
            />
          </div>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full px-2 sm:px-0">
            <div className="w-full sm:w-auto flex-1 bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6">
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
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            <div
              ref={roastResultRef}
              className={`transition-all duration-700 transform ${
                showRoast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-orange-500/30 backdrop-blur-sm shadow-2xl rounded-lg p-4 sm:p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    <span className="text-orange-500 text-xl sm:text-2xl animate-pulse">🔥</span>
                    <span className="text-red-500 text-xl sm:text-2xl animate-pulse delay-100">🔥</span>
                    <span className="text-yellow-500 text-xl sm:text-2xl animate-pulse delay-200">🔥</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">
                    You've Been Roasted!
                  </h3>
                  <div className="ml-auto">
                    <span className="text-xs sm:text-sm bg-orange-600/20 text-orange-300 px-2 sm:px-3 py-1 rounded-full border border-orange-500/30">
                      {selectedCategory}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 md:p-6 border border-slate-700/50">
                  <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-medium break-words">
                    {typedRoast}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-3 italic">
                    Source: {roast.source}
                  </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={resetRoast}
                    className="px-4 sm:px-6 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300 rounded-md"
                  >
                    Spin Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
