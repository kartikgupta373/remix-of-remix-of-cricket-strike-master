import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
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

const CameraController = () => {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 2, -5));
  
  useFrame(() => {
    // Behind the batsman perspective
    camera.position.lerp(new THREE.Vector3(0, 2.5, 12), 0.02);
    camera.lookAt(targetRef.current);
  });
  
  return null;
};

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
        <PerspectiveCamera makeDefault position={[0, 2.5, 12]} fov={60} />
        <CameraController />
        
        {/* Scene */}
        <Stadium />
        
        {/* Stumps at batsman end */}
        <Stumps position={[0, 0, 8.5]} bailsFallen={isOut} />
        
        {/* Stumps at bowler end */}
        <Stumps position={[0, 0, -10]} />
        
        {/* Ball */}
        <CricketBall 
          ballState={ballState}
          bowlingProgress={bowlingProgress}
          hitResult={hitResult}
          onBallReachBat={onBallReachBat}
          onAnimationComplete={onAnimationComplete}
        />
        
        {/* Batsman */}
        <Batsman isSwinging={isSwinging} swingProgress={swingProgress} />
        
        {/* Bowler */}
        <Bowler isBowling={gameState === 'bowling' || gameState === 'out'} bowlingProgress={bowlingProgress} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#87CEEB', 30, 100]} />
      </Suspense>
    </Canvas>
  );
};
