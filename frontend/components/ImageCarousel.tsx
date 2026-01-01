'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Auto-rotation effect - only if more than 1 image
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, images.length]); // Removed currentIndex to prevent interval recreation

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, images.length]);

  return (
    <div className="w-full mb-8">
      {/* Main carousel container */}
      <div
        className="relative w-full bg-black/5 rounded-xl overflow-hidden shadow-lg border border-[#e7e5e4]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Image display */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-black">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                style={{ objectFit: 'cover' }}
                priority={index === currentIndex}
              />
            </div>
          ))}

          {/* Navigation arrows - only show if more than 1 image */}
          {images.length > 1 && (
            <>
              {/* Left arrow area */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-12 z-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer group bg-black/20 hover:bg-black/40 hover:backdrop-blur-sm rounded-r-lg"
                onClick={goToPrevious}
                role="button"
                aria-label="Previous image"
              >
                <button
                  disabled={isTransitioning}
                  className="text-white/80 group-hover:text-white transition-colors transform group-hover:-translate-x-0.5"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Right arrow area */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-12 z-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer group bg-black/20 hover:bg-black/40 hover:backdrop-blur-sm rounded-l-lg"
                onClick={goToNext}
                role="button"
                aria-label="Next image"
              >
                <button
                  disabled={isTransitioning}
                  className="text-white/80 group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail indicators - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all rounded-lg cursor-pointer overflow-hidden ${index === currentIndex
                ? 'ring-2 ring-[#6F4E37] ring-offset-2 w-16 h-12'
                : 'w-12 h-12 grayscale opacity-60 hover:opacity-100'
                }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[index]}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
