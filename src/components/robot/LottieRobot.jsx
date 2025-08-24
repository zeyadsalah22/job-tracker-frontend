import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieRobot = ({ 
  className = "", 
  size = "md",
  showSpeechBubble = false,
  speechText = "Hi! Let me guide you through this amazing platform!"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32", 
    lg: "w-40 h-40"
  };

  return (
    <div className={`relative ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className={`absolute -top-16 -left-8 bg-white rounded-xl shadow-lg border border-primary/20 p-3 min-w-[200px] transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-sm text-gray-700 font-medium">{speechText}</p>
          <div className="absolute bottom-0 left-8 transform translate-y-full">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
          </div>
        </div>
      )}
      
      {/* Robot Animation */}
      <div className={`${sizeClasses[size]} transform transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <DotLottieReact
          src="https://lottie.host/c6f9b304-f3b8-4dea-b810-ac2d3e958d83/Xy3NrWVSF2.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default LottieRobot;
