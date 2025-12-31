'use client';

import Image from 'next/image';

interface AnimatedLogoProps {
  className?: string;
}

export default function AnimatedLogo({ className = 'w-12 h-12' }: AnimatedLogoProps) {
  return (
    <Image
      src="/final-gdg-logo.svg"
      alt="GDG OC Logo"
      width={48}
      height={48}
      className={`${className} object-contain`}
    />
  );
}
