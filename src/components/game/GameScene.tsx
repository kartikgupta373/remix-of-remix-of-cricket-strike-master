import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Stadium } from './Stadium';
import { Stumps } from './Stumps';
import { CricketBall } from './CricketBall';
import { Batsman } from './Batsman';
import { Bowler } from './Bowler';

interface GameSceneProps {
  gameState: 'idle' | 'bowling' | 'hitting' | 'result' | 'out';
  bowlingProgress: number;
  isSwinging: boolean;
  swingProgress: number;
  hitResult: number | null;
  isOut: boolean;
  onBallReachBat: () => void;
  onAnimationComplete: () => void;
}

export const GameScene = ({ 
  gameState, 
  bowlingProgress,
  isSwinging,
  swingProgress,
  hitResult,
  isOut,
  onBallReachBat,
  onAnimationComplete
}: GameSceneProps) => {
  const ballState = gameState === 'out' ? 'out' 
    : gameState === 'hitting' || gameState === 'result' ? 'hit'
    : gameState === 'bowling' ? 'bowling'
    : 'idle';
  
  return (
    <Canvas shadows className="touch-none" dpr={[1, 2]}>
      <Suspense fallback={null}>
        {/* Camera behind and slightly above the batsman - optimized for mobile viewing */}
        <PerspectiveCamera 
          makeDefault 
          position={[0.8, 2.5, 10]} 
          fov={50}
          rotation={[-0.08, 0.02, 0]}
        />
        
        {/* Scene lighting - enhanced for visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[15, 35, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={80}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <hemisphereLight args={['#87CEEB', '#2E7D32', 0.5]} />
        
        {/* Point light to illuminate the batting area */}
        <pointLight position={[0, 8, 5]} intensity={0.8} distance={20} />
        
        {/* RENDER ORDER: Background to Foreground */}
        
        {/* 1. Stadium environment - furthest back */}
        <Stadium />
        
        {/* 2. Bowler - at the far end */}
        <Bowler 
          isBowling={gameState === 'bowling' || gameState === 'out'} 
          bowlingProgress={bowlingProgress} 
        />
        
        {/* 3. Bowler's stumps - at bowler's end */}
        <Stumps position={[0, 0, -10]} />
        
        {/* 4. Cricket Ball - travels from bowler to batsman */}
        <CricketBall 
          ballState={ballState}
          bowlingProgress={bowlingProgress}
          hitResult={hitResult}
          onBallReachBat={onBallReachBat}
          onAnimationComplete={onAnimationComplete}
        />
        
        {/* 5. Batsman - standing on crease, in front of his stumps */}
        <Batsman isSwinging={isSwinging} swingProgress={swingProgress} />
        
        {/* 6. Batsman's stumps - CLOSEST to camera, behind batsman */}
        <Stumps position={[0, 0, 6.5]} bailsFallen={isOut} />
        
        {/* Atmospheric fog - reduced for better visibility */}
        <fog attach="fog" args={['#87CEEB', 50, 130]} />
      </Suspense>
    </Canvas>
  );
};
