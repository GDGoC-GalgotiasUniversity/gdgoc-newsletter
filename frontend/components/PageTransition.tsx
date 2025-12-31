'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      // Skip animation on initial page load
      isFirstRender.current = false;
      return;
    }

    setAnimate(true);

    const timer = setTimeout(() => {
      setAnimate(false);
    }, 500); // match animation duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-transition {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className={animate ? 'page-transition' : ''}>
        {children}
      </div>
    </>
  );
}
