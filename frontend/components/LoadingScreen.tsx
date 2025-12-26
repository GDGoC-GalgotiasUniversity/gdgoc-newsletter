'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep loading screen visible for 3 seconds (one complete animation cycle)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Animated Logo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-28 h-28 md:w-40 md:h-40 object-contain"
        >
          <source src="/logo.mp4" type="video/mp4" />
        </video>

        {/* Loading Text - Single Line */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl md:text-2xl font-medium text-[var(--google-blue)]">
              Loading
            </span>
            <span className="text-xl md:text-2xl font-medium">
              <span className="text-[var(--google-red)]">Your</span>
              <span className="text-[var(--google-yellow)] ml-1">imagination</span>
            </span>
            <span className="inline-flex gap-1 ml-2">
              <span 
                className="w-2 h-2 rounded-full bg-[var(--google-blue)] animate-bounce" 
                style={{ animationDelay: '0s' }}
              ></span>
              <span 
                className="w-2 h-2 rounded-full bg-[var(--google-red)] animate-bounce" 
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span 
                className="w-2 h-2 rounded-full bg-[var(--google-yellow)] animate-bounce" 
                style={{ animationDelay: '0.4s' }}
              ></span>
              <span 
                className="w-2 h-2 rounded-full bg-[var(--google-green)] animate-bounce" 
                style={{ animationDelay: '0.6s' }}
              ></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
