import React, { useState } from 'react';

export default function() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = 3;

  const handleNext = () => {
    if (currentLevel < totalLevels) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="relative mb-8">
        {/* Background bar */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Progress bar */}
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentLevel - 1) / (totalLevels - 1)) * 100}%` }}
          />
        </div>
        
        {/* Level indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between -mt-2">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                transition-colors duration-300 border-2
                ${level <= currentLevel 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'}`}
            >
              {level}
            </div>
          ))}
        </div>
      </div>

      {/* Level text */}
      <div className="text-center mb-6">
        <p className="text-lg font-medium">Level {currentLevel}</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleBack}
          disabled={currentLevel === 1}
          className={`px-4 py-2 rounded-md ${
            currentLevel === 1 
              ? 'bg-gray-200 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentLevel === totalLevels}
          className={`px-4 py-2 rounded-md ${
            currentLevel === totalLevels 
              ? 'bg-gray-200 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

