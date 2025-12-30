'use client';

import Image from 'next/image';

export default function HeroBackgroundVideo() {
  return (
    <div className="w-96 h-96 flex items-center justify-center">
      <Image
        src="/final-gdg-logo.svg"
        alt="GDG OC Newsletter Logo"
        width={384}
        height={384}
        priority
        className="w-full h-full object-contain"
      />
    </div>
  );
}
