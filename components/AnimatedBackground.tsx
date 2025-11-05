
import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-[#0b0b0f]"></div>
      <style>
        {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gradient-bg {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 20% 20%, #b667ff 0%, transparent 30%),
                        radial-gradient(circle at 80% 70%, #4af3ff 0%, transparent 30%),
                        radial-gradient(circle at 50% 50%, #0b0b0f 40%, #0b0b0f 100%);
            animation: gradient-move 25s ease infinite;
            filter: blur(100px);
            opacity: 0.3;
          }
        `}
      </style>
      <div className="gradient-bg"></div>
    </div>
  );
};
