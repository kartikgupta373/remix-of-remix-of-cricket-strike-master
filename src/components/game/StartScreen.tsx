import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-background/90 to-background/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="game-title text-6xl md:text-8xl text-primary mb-2">
          CRICKET
        </h1>
        <h2 className="game-title text-3xl md:text-5xl text-foreground/80 mb-8">
          SIXER
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-xl p-6 mb-8 max-w-sm mx-auto"
        >
          <p className="text-foreground/90 text-sm mb-4">
            🏏 Ankit, Face 6 balls (1 Over)
          </p>
          <p className="text-foreground/70 text-xs">
            Tap at the right moment to hit!
          </p>
          <p className="text-foreground/70 text-xs mt-1">
            Perfect timing = Maximum runs
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="hit-button px-12 py-4 rounded-full text-primary-foreground font-game text-lg font-bold uppercase tracking-wider animate-pulse-glow"
        >
          Play Now
        </motion.button>
      </motion.div>
      
      {/* Decorative cricket balls */}
      <motion.div
        animate={{ 
          rotate: 360,
          y: [0, -10, 0]
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-20 left-10 text-4xl"
      >
        🏏
      </motion.div>
      <motion.div
        animate={{ 
          rotate: -360,
          y: [0, 10, 0]
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-32 right-8 text-3xl"
      >
        🏆
      </motion.div>
    </motion.div>
  );
};
