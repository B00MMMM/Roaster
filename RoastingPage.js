import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Flame, Zap, Sparkles, Target } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { roastAPI } from '../services/api';
import SpinningWheel from '../components/SpinningWheel';

const RoastingPage = () => {
  const [name, setName] = useState('');
  const [roast, setRoast] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await roastAPI.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error 🚫",
        description: "Failed to load roast categories",
        variant: "destructive"
      });
    }
  };

  const handleGenerateRoast = async () => {
    if (!name.trim()) {
      toast({
        title: "Hold up! 🔥",
        description: "Enter your name first, brave soul!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setShowRoast(false);
    setIsWheelSpinning(true);
    
    try {
      // Simulate wheel spinning
      setTimeout(async () => {
        setIsWheelSpinning(false);
        
        try {
          const response = await roastAPI.generateRoast(name);
          
          if (response.success) {
            setSelectedCategory(response.data.category);
            setRoast(response.data.roast);
            
            setTimeout(() => {
              setIsGenerating(false);
              setTimeout(() => {
                setShowRoast(true);
              }, 100);
            }, 500);
          } else {
            throw new Error(response.message || 'Failed to generate roast');
          }
        } catch (error) {
          console.error('Error generating roast:', error);
          setIsGenerating(false);
          toast({
            title: "Roast Failed! 😅",
            description: "Something went wrong. Try again!",
            variant: "destructive"
          });
        }
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      setIsWheelSpinning(false);
    }
  };

  const resetRoast = () => {
    setRoast('');
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
            <Flame className="text-orange-500 w-12 h-12 animate-bounce" />
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
              RoastMe
            </h1>
            <Flame className="text-orange-500 w-12 h-12 animate-bounce delay-200" />
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
          <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm animate-slide-up delay-400">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-300 mb-3">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">Target Acquired</span>
                </div>
                <Input
                  type="text"
                  placeholder="Enter your name here..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateRoast();
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerateRoast}
            disabled={isGenerating}
            className="relative px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up delay-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 animate-spin" />
                Spinning Wheel...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Spin & Roast Me!
              </div>
            )}
          </Button>
        </div>

        {/* Loading Animation */}
        {isGenerating && !isWheelSpinning && (
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
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-orange-500/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                    <Flame className="w-6 h-6 text-red-500 animate-pulse delay-100" />
                    <Flame className="w-6 h-6 text-yellow-500 animate-pulse delay-200" />
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
                    {roast}
                  </p>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={resetRoast}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300"
                  >
                    Spin Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default RoastingPage;