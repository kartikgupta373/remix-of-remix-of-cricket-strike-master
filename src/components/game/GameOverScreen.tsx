import { motion } from 'framer-motion';

interface GameOverScreenProps {
  score: number;
  onRetry: () => void;
}

export const GameOverScreen = ({ score, onRetry }: GameOverScreenProps) => {
  const getPerformance = () => {
    if (score >= 30) return { text: "INCREDIBLE! 🔥", color: "text-yellow-400" };
    if (score >= 24) return { text: "EXCELLENT! 🌟", color: "text-yellow-300" };
    if (score >= 18) return { text: "GREAT! ⭐", color: "text-green-400" };
    if (score >= 12) return { text: "GOOD! 👍", color: "text-blue-400" };
    if (score >= 6) return { text: "NICE TRY! 💪", color: "text-purple-400" };
    return { text: "KEEP PRACTICING! 🎯", color: "text-orange-400" };
  };
  
  const performance = getPerformance();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsla(45, 80%, 35%, 0.95) 0%, hsla(35, 90%, 30%, 0.95) 100%)'
      }}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center"
      >
        <motion.h1 
          className="game-title text-5xl md:text-7xl text-white mb-2"
        >
          OVER COMPLETE!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl md:text-3xl font-game font-bold mb-6 ${performance.color}`}
        >
          {performance.text}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="glass-panel rounded-xl p-8 mb-8"
        >
          <p className="text-white/60 text-sm mb-2">Your Score</p>
          <motion.p 
            className="score-display text-7xl text-primary"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {score}
          </motion.p>
          <p className="text-white/60 text-sm mt-2">runs in 6 balls</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="hit-button px-10 py-4 rounded-full text-primary-foreground font-game text-lg font-bold uppercase tracking-wider"
        >
          Play Again
        </motion.button>
      </motion.div>
      
      {/* Trophy */}
      <motion.div
        initial={{ y: -50, opacity: 0, rotate: -20 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute top-16 text-6xl"
      >
        🏆
      </motion.div>
      
      {/* Confetti emojis */}
      {score >= 18 && (
        <>
          <motion.div
            initial={{ y: -100, x: -50, opacity: 0 }}
            animate={{ y: 100, x: -100, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-1/4 text-3xl"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ y: -100, x: 50, opacity: 0 }}
            animate={{ y: 150, x: 100, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute top-0 right-1/4 text-3xl"
          >
            ⭐
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
