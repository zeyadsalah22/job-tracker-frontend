import React from 'react'
import { SplineScene } from './spline'
import { Spotlight } from './spotlight'

interface RobotSceneProps {
  className?: string
  robotStyle?: 'default' | 'bright' | 'colorful' | 'purple' | 'moodyBlue'
  animation?: boolean
  waveOnLoad?: boolean
}

export function RobotScene({ className = "", robotStyle = 'moodyBlue', animation = true, waveOnLoad = true }: RobotSceneProps) {
  
  // Define robot styling options
  const robotStyles = {
    default: "filter brightness-110 contrast-105",
    bright: "filter brightness-125 contrast-110 saturate-110",
    colorful: "filter brightness-120 contrast-115 saturate-150 hue-rotate-30",
    purple: "filter brightness-115 contrast-108 saturate-120 hue-rotate-280 sepia-20",
    moodyBlue: "filter brightness-80 contrast-120 saturate-150 hue-rotate-240 sepia-30"
  }

  const getAnimationClass = () => {
    let classes = "";
    if (animation) {
      classes += "hover:scale-105 transition-transform duration-700 ease-out animate-breathe ";
    }
    if (waveOnLoad) {
      classes += "animate-wave ";
    }
    return classes.trim();
  }
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#eef0ff] via-[#e0e3ff] to-[#c6cbff] border border-[#e0e3ff] shadow-2xl ${className}`}>
      <Spotlight
        className="-top-20 -left-20 md:left-40 md:-top-10"
        fill="#7571f9"
      />
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-[#7571f9] rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-8 right-12 w-2 h-2 bg-[#a4a8fd] rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 bg-[#c6cbff] rounded-full opacity-50 animate-pulse delay-500"></div>
      
      <div className="relative z-10 flex h-full">
        {/* 3D Scene Container with customizable styling */}
        <div className="w-full h-full relative p-4">
          <div className={`w-full h-full bg-transparent rounded-2xl ${getAnimationClass()}`}>
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className={`w-full h-full ${robotStyles[robotStyle]}`}
            />
          </div>
        </div>

        {/* Fallback content when 3D scene is loading or fails */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eef0ff] to-[#e0e3ff] opacity-0 pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <p className="text-[#231a4c] text-lg font-medium">Interactive AI Assistant</p>
            <p className="text-[#5336cc] text-sm mt-2">Loading your dream job companion...</p>
          </div>
        </div>

        {/* Speech bubble that appears with wave */}
        {waveOnLoad && (
          <div className="absolute top-8 left-8 opacity-0 animate-speech-bubble-full pointer-events-none z-20">
            {/* Speech bubble container */}
            <div className="relative bg-gradient-to-br from-[#7571f9] to-[#6144e7] rounded-2xl px-4 py-3 shadow-xl max-w-[280px] border border-[#a4a8fd]/30">
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[#6144e7] transform rotate-45 border-r border-b border-[#a4a8fd]/30"></div>
              
              {/* Message content */}
              <div className="relative z-10">
                <p className="text-[#eef0ff] text-sm font-medium leading-relaxed">
                  👋 Hi! I'm <span className="font-bold text-[#c6cbff]">JobLander</span>, your AI assistant to help you land your dream job!
                </p>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a4a8fd]/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Typing indicator animation */}
            <div className="flex items-center gap-1 mt-2 ml-4">
              <div className="w-2 h-2 bg-[#7571f9] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#a4a8fd] rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-[#c6cbff] rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
        )}

        {/* Subtle gradient overlay for better integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#eef0ff]/20 via-transparent to-transparent pointer-events-none"></div>
      </div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#7571f9] to-[#a4a8fd] rounded-full opacity-20 animate-float"></div>
      <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#c6cbff] to-[#e0e3ff] rounded-full opacity-30 animate-float-delayed"></div>
      
      {/* Additional animated elements for more life */}
      <div className="absolute top-1/4 right-8 w-2 h-2 bg-[#7571f9] rounded-full opacity-40 animate-pulse delay-200"></div>
      <div className="absolute bottom-1/3 left-8 w-3 h-3 bg-[#a4a8fd] rounded-full opacity-30 animate-bounce delay-700"></div>
    </div>
  )
} 