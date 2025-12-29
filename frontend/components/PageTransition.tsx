'use client';

import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

        .page-transition-enter {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div key={pathname} className="page-transition-enter">
        {children}
      </div>
    </>
  );
}
