'use client';

import { useRef, useEffect } from 'react';

export default function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Pause on last frame
      video.pause();
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-96 h-96 object-contain"
    >
      <source src="/logo.mp4" type="video/mp4" />
    </video>
  );
}
