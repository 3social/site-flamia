'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeCarouselProps {
  children: ReactNode[];
  className?: string;
  speed?: number;
  gap?: number;
}

export function MarqueeCarousel({ children, className, speed = 20, gap = 16 }: MarqueeCarouselProps) {
  const itemCount = children.length;
  const duplicatedChildren = [...children, ...children];

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <motion.div
        className="flex gap-4 md:gap-6"
        animate={{
          x: [-50 * (gap + 100), -100 * (gap + 100) * itemCount],
        }}
        transition={{
          duration: speed * itemCount,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedChildren.map((child, idx) => (
          <div key={idx} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
