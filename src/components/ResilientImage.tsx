import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackIcon = 'water_drop',
  fallbackClassName = '',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] text-[#0284c7] ${className} ${fallbackClassName}`}
      >
        <span className="material-symbols-outlined text-[20px]">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
