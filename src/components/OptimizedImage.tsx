import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  fallbackSrc?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ASPECT_RATIOS = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: 'aspect-auto',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';

export default function OptimizedImage({
  src,
  alt,
  className,
  aspectRatio = 'square',
  fallbackSrc = FALLBACK_IMAGE,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, currentSrc]);

  useEffect(() => {
    if (priority) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = currentSrc;
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [currentSrc, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onError?.();
    }
  }, [hasError, fallbackSrc, onError]);

  useEffect(() => {
    if (priority && imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        ASPECT_RATIOS[aspectRatio],
        className
      )}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        src={priority ? currentSrc : undefined}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-100'
        )}
      />
    </div>
  );
}
