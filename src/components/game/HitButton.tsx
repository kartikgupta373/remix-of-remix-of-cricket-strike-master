import { motion } from 'framer-motion';
import { useCallback } from 'react';

interface HitButtonProps {
  onHit: () => void;
  disabled: boolean;
  canHit: boolean;
}

export const HitButton = ({ onHit, disabled, canHit }: HitButtonProps) => {
  // Handle both touch and click for mobile optimization
  const handleInteraction = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onHit();
  }, [onHit]);

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        whileTap={{ scale: 0.85 }}
        onTouchStart={handleInteraction}
        onClick={handleInteraction}
        disabled={disabled}
        className={`
          pointer-events-auto select-none
          w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40
          rounded-full
          font-game font-bold text-xl sm:text-2xl uppercase tracking-wide
          transition-all duration-100
          active:scale-90
          touch-none
          ${canHit && !disabled
            ? 'hit-button text-primary-foreground animate-pulse-glow shadow-2xl'
            : 'bg-muted/80 text-muted-foreground opacity-60'
          }
        `}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <span className="block text-2xl sm:text-3xl">🏏</span>
        <span className="block mt-1">HIT!</span>
      </motion.button>
      
      {/* Pulse rings when can hit */}
      {canHit && !disabled && (
        <>
          <motion.div
            className="absolute w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-primary/60 pulse-ring pointer-events-none"
          />
          <motion.div
            className="absolute w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-primary/40 pulse-ring pointer-events-none"
            style={{ animationDelay: '0.4s' }}
          />
          <motion.div
            className="absolute w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-primary/20 pulse-ring pointer-events-none"
            style={{ animationDelay: '0.8s' }}
          />
        </>
      )}
    </div>
  );
};
