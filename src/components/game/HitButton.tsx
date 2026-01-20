import { motion } from 'framer-motion';

interface HitButtonProps {
  onHit: () => void;
  disabled: boolean;
  canHit: boolean;
}

export const HitButton = ({ onHit, disabled, canHit }: HitButtonProps) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        whileTap={{ scale: 0.9 }}
        onClick={onHit}
        disabled={disabled}
        className={`
          pointer-events-auto
          w-28 h-28 md:w-32 md:h-32
          rounded-full
          font-game font-bold text-lg uppercase tracking-wide
          transition-all duration-150
          ${canHit && !disabled
            ? 'hit-button text-primary-foreground animate-pulse-glow'
            : 'bg-muted text-muted-foreground opacity-50'
          }
        `}
      >
        <span className="block">HIT</span>
        <span className="text-xs block mt-1">🏏</span>
      </motion.button>
      
      {/* Pulse ring when can hit */}
      {canHit && !disabled && (
        <>
          <motion.div
            className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/50 pulse-ring pointer-events-none"
          />
          <motion.div
            className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/30 pulse-ring pointer-events-none"
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}
    </div>
  );
};
