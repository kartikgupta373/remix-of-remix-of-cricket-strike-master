import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CricketBallProps {
  ballState: 'idle' | 'bowling' | 'hit' | 'out';
  bowlingProgress: number;
  hitResult: number | null;
  onBallReachBat: () => void;
  onAnimationComplete: () => void;
}

export const CricketBall = ({ 
  ballState, 
  bowlingProgress, 
  hitResult,
  onBallReachBat,
  onAnimationComplete 
}: CricketBallProps) => {
  const ballRef = useRef<THREE.Group>(null);
  const hitProgressRef = useRef(0);
  const hasReachedBat = useRef(false);
  const hasCalledComplete = useRef(false);
  
  // Realistic ball trajectory during bowling with bounce
  const getBowlingPosition = (t: number): [number, number, number] => {
    // Bowler releases from around z = -10, ball reaches batsman at z = 6
    const startZ = -10;
    const endZ = 6.5;
    const bounceZ = -1; // Where ball pitches/bounces
    
    const z = startZ + (endZ - startZ) * t;
    
    // Calculate height with realistic bounce physics
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ); // ~0.55
    
    if (t < 0.15) {
      // Ball released from bowler's hand height
      y = 2.2 - t * 3;
    } else if (t < bounceT) {
      // Descending to pitch
      const localT = (t - 0.15) / (bounceT - 0.15);
      y = 1.75 - 1.65 * localT; // Goes down to 0.1 (just above ground)
    } else {
      // After bounce - rises to batting height
      const localT = (t - bounceT) / (1 - bounceT);
      // Parabolic rise after bounce
      const bounceHeight = 0.1;
      const peakHeight = 0.9; // Waist-stump height
      y = bounceHeight + (peakHeight - bounceHeight) * Math.sin(localT * Math.PI * 0.55);
    }
    
    // Slight lateral movement (swing/seam)
    const x = Math.sin(t * Math.PI * 0.5) * 0.15;
    
    return [x, Math.max(0.05, y), z];
  };
  
  // Ball trajectory when hit - different for each run value
  const getHitPosition = (runs: number, t: number): [number, number, number] => {
    const startPos: [number, number, number] = [0, 0.85, 6];
    const easeT = 1 - Math.pow(1 - t, 2); // Ease out
    
    switch(runs) {
      case 1:
        // Soft defensive push - rolls to fielder
        return [
          startPos[0] + easeT * 6,
          Math.max(0.05, startPos[1] * (1 - easeT * 0.9)),
          startPos[2] - easeT * 12
        ];
      case 2:
        // Ground shot through gap
        return [
          startPos[0] - easeT * 12,
          Math.max(0.05, startPos[1] * (1 - easeT * 0.8) + Math.sin(t * Math.PI * 2) * 0.2),
          startPos[2] - easeT * 22
        ];
      case 3:
        // Lofted shot, lands in outfield
        return [
          startPos[0] + easeT * 18,
          startPos[1] + Math.sin(t * Math.PI) * 4,
          startPos[2] - easeT * 32
        ];
      case 4:
        // FOUR - racing along ground to boundary
        return [
          startPos[0] - easeT * 22,
          Math.max(0.05, startPos[1] * (1 - easeT * 0.5) + Math.sin(t * Math.PI * 3) * 0.15),
          startPos[2] - easeT * 48
        ];
      case 5:
        // Almost a six - lands just inside rope
        return [
          startPos[0] + easeT * 15,
          startPos[1] + Math.sin(t * Math.PI * 0.8) * 12,
          startPos[2] - easeT * 42
        ];
      case 6:
        // SIX! - soars into the stands
        const sixT = Math.min(t * 1.2, 1);
        return [
          startPos[0] + Math.sin(sixT * Math.PI * 0.4) * 8,
          startPos[1] + sixT * 25 + Math.sin(sixT * Math.PI) * 12,
          startPos[2] - sixT * 65
        ];
      default:
        return startPos;
    }
  };
  
  // Ball trajectory when batsman misses - hits stumps
  const getOutPosition = (t: number): [number, number, number] => {
    const startZ = -10;
    const endZ = 7; // Through to stumps
    const bounceZ = -1;
    
    const z = startZ + (endZ - startZ) * t;
    
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ);
    
    if (t < 0.15) {
      y = 2.2 - t * 3;
    } else if (t < bounceT) {
      const localT = (t - 0.15) / (bounceT - 0.15);
      y = 1.75 - 1.55 * localT;
    } else {
      const localT = (t - bounceT) / (1 - bounceT);
      // Lower trajectory to hit stumps
      y = 0.2 + Math.sin(localT * Math.PI * 0.4) * 0.35;
    }
    
    return [0, Math.max(0.05, y), z];
  };
  
  useFrame((state, delta) => {
    if (!ballRef.current) return;
    
    // Spin the ball realistically
    ballRef.current.rotation.x += delta * 20;
    ballRef.current.rotation.z += delta * 8;
    
    if (ballState === 'bowling') {
      const pos = getBowlingPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
      
      // Check if ball reached batting zone
      if (bowlingProgress > 0.82 && !hasReachedBat.current) {
        hasReachedBat.current = true;
        onBallReachBat();
      }
    } else if (ballState === 'hit' && hitResult !== null) {
      hitProgressRef.current += delta * 0.7;
      const clampedProgress = Math.min(hitProgressRef.current, 1);
      const pos = getHitPosition(hitResult, clampedProgress);
      ballRef.current.position.set(...pos);
      
      if (hitProgressRef.current >= 1.1 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onAnimationComplete();
      }
    } else if (ballState === 'out') {
      const pos = getOutPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
    } else if (ballState === 'idle') {
      // Ball at bowler's hand position
      ballRef.current.position.set(0.3, 2.3, -14);
    }
  });
  
  useEffect(() => {
    if (ballState === 'idle') {
      hasReachedBat.current = false;
      hasCalledComplete.current = false;
      hitProgressRef.current = 0;
    }
  }, [ballState]);
  
  return (
    <group ref={ballRef} position={[0, 2.3, -14]}>
      {/* Main ball - larger and more visible */}
      <mesh castShadow>
        <sphereGeometry args={[0.038, 24, 24]} />
        <meshStandardMaterial 
          color="#CC0000" 
          roughness={0.25} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Seam - primary */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.038, 0.004, 8, 32]} />
        <meshStandardMaterial color="#FFFEF0" roughness={0.4} />
      </mesh>
      
      {/* Seam - secondary (cricket balls have two halves) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.038, 0.002, 8, 32]} />
        <meshStandardMaterial color="#FFFEF0" roughness={0.4} />
      </mesh>
      
      {/* Subtle glow for visibility */}
      <pointLight intensity={0.3} distance={2} color="#ff3333" />
    </group>
  );
};
