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
    <Canvas shadows className="touch-none">
      <Suspense fallback={null}>
        {/* Camera behind and slightly above the batsman */}
        <PerspectiveCamera 
          makeDefault 
          position={[0.5, 2.2, 9.5]} 
          fov={55}
          rotation={[-0.05, 0, 0]}
        />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[15, 30, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <hemisphereLight args={['#87CEEB', '#2E7D32', 0.4]} />
        
        {/* Stadium environment */}
        <Stadium />
        
        {/* Batsman's stumps - BEHIND batsman, closer to camera (z = 7) */}
        <Stumps position={[0, 0, 7]} bailsFallen={isOut} />
        
        {/* Bowler's stumps - at bowler's end (z = -10) */}
        <Stumps position={[0, 0, -10]} />
        
        {/* Cricket Ball */}
        <CricketBall 
          ballState={ballState}
          bowlingProgress={bowlingProgress}
          hitResult={hitResult}
          onBallReachBat={onBallReachBat}
          onAnimationComplete={onAnimationComplete}
        />
        
        {/* Batsman - standing in front of stumps, on the crease (z = 6) */}
        <Batsman isSwinging={isSwinging} swingProgress={swingProgress} />
        
        {/* Bowler - runs in from z = -14 */}
        <Bowler 
          isBowling={gameState === 'bowling' || gameState === 'out'} 
          bowlingProgress={bowlingProgress} 
        />
        
        {/* Atmospheric fog */}
        <fog attach="fog" args={['#87CEEB', 40, 120]} />
      </Suspense>
    </Canvas>
  );
};
