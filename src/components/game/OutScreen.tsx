import { motion } from 'framer-motion';

interface OutScreenProps {
  score: number;
  ballsFaced: number;
  onRetry: () => void;
}

export const OutScreen = ({ score, ballsFaced, onRetry }: OutScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsla(0, 85%, 30%, 0.95) 0%, hsla(15, 90%, 25%, 0.95) 100%)'
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="text-center"
      >
        <motion.h1 
          className="game-title text-7xl md:text-9xl text-white mb-2"
          animate={{ 
            textShadow: [
              "0 0 20px rgba(255,255,255,0.5)",
              "0 0 40px rgba(255,255,255,0.8)",
              "0 0 20px rgba(255,255,255,0.5)"
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          OUT!
        </motion.h1>
        <p className="text-white/80 text-xl mb-8 font-game">BOWLED!</p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6 mb-8"
        >
          <p className="text-white/60 text-sm mb-2">Final Score</p>
          <p className="score-display text-5xl text-white mb-4">{score}</p>
          <p className="text-white/60 text-sm">
            Balls Faced: {ballsFaced}/6
          </p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="hit-button px-10 py-4 rounded-full text-primary-foreground font-game text-lg font-bold uppercase tracking-wider"
        >
          Play Again
        </motion.button>
      </motion.div>
      
      {/* Broken wicket emoji */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="absolute top-20 text-6xl"
      >
        💔
      </motion.div>
    </motion.div>
  );
};
