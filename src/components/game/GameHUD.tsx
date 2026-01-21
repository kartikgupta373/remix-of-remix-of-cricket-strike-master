import { motion, AnimatePresence } from 'framer-motion';

interface GameHUDProps {
  score: number;
  ballsRemaining: number;
  currentRun: number | null;
  lastShotType: string | null;
}

export const GameHUD = ({ score, ballsRemaining, currentRun, lastShotType }: GameHUDProps) => {
  const getRunColor = (run: number) => {
    if (run === 6) return 'text-fuchsia-400';
    if (run === 4) return 'text-green-400';
    if (run >= 2) return 'text-blue-400';
    return 'text-white';
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
      <div className="flex justify-between items-start max-w-md mx-auto">
        {/* Score */}
        <motion.div
          className="glass-panel rounded-lg px-4 py-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-foreground/60 text-xs uppercase tracking-wider">Score</p>
          <motion.p
            key={score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="score-display text-3xl text-primary"
          >
            {score}
          </motion.p>
        </motion.div>

        {/* Balls remaining */}
        <motion.div
          className="glass-panel rounded-lg px-4 py-2 text-right"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-foreground/60 text-xs uppercase tracking-wider">Balls</p>
          <div className="flex gap-1 mt-1">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${i < (6 - ballsRemaining)
                    ? 'bg-foreground/30'
                    : 'bg-primary'
                  }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Current run popup */}
      <AnimatePresence>
        {currentRun !== null && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          >
            <div className={`run-popup text-center ${getRunColor(currentRun)}`}>
              <motion.span
                className="game-title text-4xl md:text-5xl block"
                animate={{
                  scale: currentRun === 6 ? [1, 1.2, 1] : 1,
                  rotate: currentRun === 6 ? [0, -5, 5, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {currentRun}
              </motion.span>
              {lastShotType && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-game uppercase tracking-wider"
                >
                  {lastShotType}
                </motion.span>
              )}
            </div>

            {/* Special effects for boundaries */}
            {currentRun === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-6xl">🔥</span>
              </motion.div>
            )}
            {currentRun === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-6xl">💥</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
