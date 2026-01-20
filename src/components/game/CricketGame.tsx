import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameScene } from './GameScene';
import { StartScreen } from './StartScreen';
import { OutScreen } from './OutScreen';
import { GameOverScreen } from './GameOverScreen';
import { GameHUD } from './GameHUD';
import { HitButton } from './HitButton';

type GamePhase = 'start' | 'playing' | 'out' | 'gameover';
type GameState = 'idle' | 'bowling' | 'hitting' | 'result' | 'out';

const SHOT_TYPES = [
  'Miss',
  'Defensive Push',
  'Flick Shot',
  'Drive',
  'Cover Drive',
  'Pull Shot',
  'SIX!'
];

export const CricketGame = () => {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [ballsRemaining, setBallsRemaining] = useState(6);
  const [currentRun, setCurrentRun] = useState<number | null>(null);
  const [lastShotType, setLastShotType] = useState<string | null>(null);
  
  const [bowlingProgress, setBowlingProgress] = useState(0);
  const [isSwinging, setIsSwinging] = useState(false);
  const [swingProgress, setSwingProgress] = useState(0);
  const [hitResult, setHitResult] = useState<number | null>(null);
  const [isOut, setIsOut] = useState(false);
  const [canHit, setCanHit] = useState(false);
  
  const hitTimingRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const bowlingStartTimeRef = useRef(0);
  const gameStateRef = useRef<GameState>('idle');
  
  // Timing window constants
  const PERFECT_TIMING_START = 0.70;
  const PERFECT_TIMING_END = 0.90;
  const BOWLING_DURATION = 2000;
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  const calculateRuns = useCallback((timing: number): number => {
    const normalizedTiming = Math.abs(timing - 0.5) * 2;
    
    if (normalizedTiming < 0.1) return 6;
    if (normalizedTiming < 0.25) return 4;
    if (normalizedTiming < 0.4) return 3;
    if (normalizedTiming < 0.55) return 2;
    if (normalizedTiming < 0.75) return 1;
    return 0;
  }, []);
  
  const handleOut = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsOut(true);
    setGameState('out');
    setCanHit(false);
    
    setTimeout(() => {
      setPhase('out');
    }, 1200);
  }, []);
  
  const startBowling = useCallback(() => {
    setGameState('bowling');
    setBowlingProgress(0);
    setCanHit(false);
    hitTimingRef.current = 0;
    bowlingStartTimeRef.current = performance.now();
    
    const animate = () => {
      if (gameStateRef.current !== 'bowling') return;
      
      const elapsed = performance.now() - bowlingStartTimeRef.current;
      const progress = Math.min(elapsed / BOWLING_DURATION, 1);
      
      setBowlingProgress(progress);
      
      if (progress >= PERFECT_TIMING_START && progress <= PERFECT_TIMING_END) {
        setCanHit(true);
        hitTimingRef.current = (progress - PERFECT_TIMING_START) / (PERFECT_TIMING_END - PERFECT_TIMING_START);
      } else {
        setCanHit(false);
      }
      
      if (progress >= 1) {
        handleOut();
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [handleOut]);
  
  const nextBall = useCallback(() => {
    setGameState('idle');
    setHitResult(null);
    setBowlingProgress(0);
    setIsSwinging(false);
    setSwingProgress(0);
    
    setTimeout(() => {
      startBowling();
    }, 800);
  }, [startBowling]);
  
  const handleHit = useCallback(() => {
    if (gameStateRef.current !== 'bowling') return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const timing = hitTimingRef.current;
    const runs = canHit ? calculateRuns(timing) : 0;
    
    if (runs === 0 && !canHit) {
      handleOut();
      return;
    }
    
    setGameState('hitting');
    setIsSwinging(true);
    setHitResult(runs);
    setCurrentRun(runs);
    setLastShotType(SHOT_TYPES[runs] || 'Miss');
    setCanHit(false);
    
    let swingStart = performance.now();
    const animateSwing = () => {
      const elapsed = performance.now() - swingStart;
      const progress = Math.min(elapsed / 200, 1);
      setSwingProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateSwing);
      } else {
        setIsSwinging(false);
        setSwingProgress(0);
        setGameState('result');
      }
    };
    requestAnimationFrame(animateSwing);
  }, [calculateRuns, handleOut, canHit]);
  
  const onBallReachBat = useCallback(() => {}, []);
  
  const onAnimationComplete = useCallback(() => {
    const newBallsRemaining = ballsRemaining - 1;
    setBallsRemaining(newBallsRemaining);
    
    if (hitResult !== null && hitResult > 0) {
      setScore(prev => prev + hitResult);
    }
    
    setTimeout(() => {
      setCurrentRun(null);
      setLastShotType(null);
      
      if (newBallsRemaining <= 0) {
        setPhase('gameover');
      } else {
        nextBall();
      }
    }, 1200);
  }, [ballsRemaining, hitResult, nextBall]);
  
  const startGame = useCallback(() => {
    setPhase('playing');
    setScore(0);
    setBallsRemaining(6);
    setCurrentRun(null);
    setLastShotType(null);
    setIsOut(false);
    setHitResult(null);
    setGameState('idle');
    setBowlingProgress(0);
    
    setTimeout(() => {
      startBowling();
    }, 800);
  }, [startBowling]);
  
  const resetGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setPhase('start');
    setGameState('idle');
    setScore(0);
    setBallsRemaining(6);
    setCurrentRun(null);
    setLastShotType(null);
    setIsOut(false);
    setBowlingProgress(0);
    setHitResult(null);
    setIsSwinging(false);
    setSwingProgress(0);
    setCanHit(false);
  }, []);
  
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <GameScene
        gameState={gameState}
        bowlingProgress={bowlingProgress}
        isSwinging={isSwinging}
        swingProgress={swingProgress}
        hitResult={hitResult}
        isOut={isOut}
        onBallReachBat={onBallReachBat}
        onAnimationComplete={onAnimationComplete}
      />
      
      <AnimatePresence mode="wait">
        {phase === 'start' && (
          <StartScreen key="start" onStart={startGame} />
        )}
        
        {phase === 'out' && (
          <OutScreen 
            key="out" 
            score={score} 
            ballsFaced={6 - ballsRemaining}
            onRetry={resetGame} 
          />
        )}
        
        {phase === 'gameover' && (
          <GameOverScreen 
            key="gameover" 
            score={score} 
            onRetry={resetGame} 
          />
        )}
      </AnimatePresence>
      
      {phase === 'playing' && (
        <>
          <GameHUD 
            score={score} 
            ballsRemaining={ballsRemaining}
            currentRun={currentRun}
            lastShotType={lastShotType}
          />
          <HitButton 
            onHit={handleHit}
            disabled={gameState !== 'bowling'}
            canHit={canHit}
          />
        </>
      )}
    </div>
  );
};
