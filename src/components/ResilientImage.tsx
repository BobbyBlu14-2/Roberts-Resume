import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 p-6 text-center ${className}`}
      >
        <Layers className="w-7 h-7 text-blue-700 dark:text-blue-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
