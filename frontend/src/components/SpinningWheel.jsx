import React from 'react';

const SpinningWheel = ({ isSpinning, selectedCategory, categories }) => {
  const segmentAngle = 360 / categories.length;
  
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        {/* Wheel container */}
        <div 
          className={`relative w-64 h-64 rounded-full border-4 border-orange-500/30 shadow-2xl transition-transform duration-[2000ms] ease-out ${
            isSpinning ? 'animate-spin-wheel' : ''
          }`}
          style={{
            transform: isSpinning ? `rotate(${Math.random() * 360 + 720}deg)` : 'rotate(0deg)'
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {categories.map((category, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              
              const x1 = 100 + 90 * Math.cos(startAngle);
              const y1 = 100 + 90 * Math.sin(startAngle);
              const x2 = 100 + 90 * Math.cos(endAngle);
              const y2 = 100 + 90 * Math.sin(endAngle);
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              
              const pathData = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              const textAngle = (index * segmentAngle + segmentAngle / 2 - 90);
              const textRadius = 60;
              const textX = 100 + textRadius * Math.cos((textAngle) * (Math.PI / 180));
              const textY = 100 + textRadius * Math.sin((textAngle) * (Math.PI / 180));
              
              const isSelected = selectedCategory === category && !isSpinning;
              
              // Color mapping for segments
              const colors = [
                '#FDE047', '#F87171', '#FB923C', '#60A5FA', 
                '#34D399', '#A3A3A3', '#F472B6', '#A78BFA'
              ];
              
              return (
                <g key={category}>
                  <path
                    d={pathData}
                    fill={isSelected ? '#F97316' : colors[index] || '#64748B'}
                    fillOpacity={isSelected ? 0.9 : 0.7}
                    stroke="#1E293B"
                    strokeWidth="1"
                    className="transition-all duration-300"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-900 text-xs font-bold pointer-events-none"
                    transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                  >
                    {category}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-orange-400/50 z-10">
            <div className="text-white text-xs font-bold text-center leading-tight">
              ROAST<br/>WHEEL
            </div>
          </div>
        </div>
        
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg"></div>
        </div>
      </div>
      
      {/* Selected category display */}
      {selectedCategory && !isSpinning && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg px-6 py-3">
            <p className="text-orange-300 text-lg font-semibold text-center">
              🎯 Selected: <span className="text-orange-200 font-bold">{selectedCategory}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinningWheel;
