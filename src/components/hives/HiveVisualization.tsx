import React from 'react';

export const HiveVisualization: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative">
      <svg width="240" height="320" viewBox="0 0 240 320" className="drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        {/* Grass/Base */}
        <ellipse cx="120" cy="300" rx="100" ry="15" fill="var(--color-olive, #708238)" opacity="0.4" />
        
        {/* Legs */}
        <rect x="60" y="270" width="10" height="30" fill="#4a3b2c" />
        <rect x="170" y="270" width="10" height="30" fill="#4a3b2c" />
        
        {/* Bottom Board */}
        <polygon points="40,270 200,270 190,285 50,285" fill="#a07855" />
        
        {/* Brood Boxes */}
        <rect x="50" y="200" width="140" height="70" fill="#c49a6c" stroke="#8b5a2b" strokeWidth="2" />
        <rect x="50" y="130" width="140" height="70" fill="#d0a97c" stroke="#8b5a2b" strokeWidth="2" />
        <rect x="50" y="60" width="140" height="70" fill="#c49a6c" stroke="#8b5a2b" strokeWidth="2" />
        
        {/* Handles */}
        <rect x="100" y="225" width="40" height="10" rx="5" fill="#8b5a2b" opacity="0.7" />
        <rect x="100" y="155" width="40" height="10" rx="5" fill="#8b5a2b" opacity="0.7" />
        <rect x="100" y="85" width="40" height="10" rx="5" fill="#8b5a2b" opacity="0.7" />

        {/* Roof */}
        <polygon points="30,60 210,60 120,10" fill="#5c4033" />
        <polygon points="40,60 200,60 120,20" fill="#704214" opacity="0.8" />
        
        {/* Entrance */}
        <rect x="90" y="260" width="60" height="10" fill="#2d1e12" />
        
        {/* Animated Bees */}
        <g className="animate-[bounce_3s_infinite_ease-in-out]">
          <ellipse cx="80" cy="180" rx="4" ry="3" fill="#eab308" />
          <path d="M78,177 Q82,175 84,178" fill="none" stroke="black" />
        </g>
        <g className="animate-[bounce_2s_infinite_ease-in-out]" style={{ animationDelay: '0.5s' }}>
          <ellipse cx="160" cy="220" rx="4" ry="3" fill="#eab308" />
          <path d="M158,217 Q162,215 164,218" fill="none" stroke="black" />
        </g>
        <g className="animate-[bounce_4s_infinite_ease-in-out]" style={{ animationDelay: '1s' }}>
          <ellipse cx="120" cy="280" rx="4" ry="3" fill="#eab308" />
          <path d="M118,277 Q122,275 124,278" fill="none" stroke="black" />
        </g>
      </svg>
    </div>
  );
};
