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
  
  // Realistic ball trajectory during bowling with CLEAR bounce
  const getBowlingPosition = (t: number): [number, number, number] => {
    // Bowler releases from z = -12, ball reaches batsman at z = 5.5
    const startZ = -12;
    const endZ = 5.5;
    const bounceZ = -2; // Where ball pitches/bounces - more visible
    
    const z = startZ + (endZ - startZ) * t;
    
    // Calculate height with realistic bounce physics
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ); // ~0.57
    
    if (t < 0.12) {
      // Ball released from bowler's hand at full height
      y = 2.4 - t * 2;
    } else if (t < bounceT) {
      // Descending to pitch - clear arc
      const localT = (t - 0.12) / (bounceT - 0.12);
      const startHeight = 2.16;
      const endHeight = 0.08; // Hits the ground
      // Smooth descent
      y = startHeight - (startHeight - endHeight) * Math.pow(localT, 1.5);
    } else if (t < bounceT + 0.08) {
      // BOUNCE moment - quick compression and spring up
      const bounceLocalT = (t - bounceT) / 0.08;
      // Sharp bounce up
      y = 0.08 + Math.sin(bounceLocalT * Math.PI) * 0.3;
    } else {
      // After bounce - rises to batting height
      const localT = (t - bounceT - 0.08) / (1 - bounceT - 0.08);
      // Parabolic rise after bounce
      const bounceHeight = 0.35;
      const peakHeight = 0.95; // Good batting height
      y = bounceHeight + (peakHeight - bounceHeight) * Math.sin(localT * Math.PI * 0.5);
    }
    
    // Slight lateral movement (swing/seam)
    const x = Math.sin(t * Math.PI * 0.4) * 0.12;
    
    return [x, Math.max(0.06, y), z];
  };
  
  // Ball trajectory when hit - different for each run value
  const getHitPosition = (runs: number, t: number): [number, number, number] => {
    const startPos: [number, number, number] = [0, 0.9, 5.5];
    const easeT = 1 - Math.pow(1 - t, 2.5); // Smoother ease out
    
    switch(runs) {
      case 1:
        // Soft defensive push - rolls to fielder
        return [
          startPos[0] + easeT * 5,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.92)),
          startPos[2] - easeT * 10
        ];
      case 2:
        // Ground shot through gap
        return [
          startPos[0] - easeT * 10,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.85) + Math.sin(t * Math.PI * 2) * 0.15),
          startPos[2] - easeT * 20
        ];
      case 3:
        // Lofted shot, lands in outfield
        return [
          startPos[0] + easeT * 15,
          startPos[1] + Math.sin(t * Math.PI) * 5,
          startPos[2] - easeT * 28
        ];
      case 4:
        // FOUR - racing along ground to boundary
        return [
          startPos[0] - easeT * 20,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.6) + Math.sin(t * Math.PI * 3) * 0.12),
          startPos[2] - easeT * 45
        ];
      case 5:
        // Almost a six - lands just inside rope
        return [
          startPos[0] + easeT * 12,
          startPos[1] + Math.sin(t * Math.PI * 0.75) * 14,
          startPos[2] - easeT * 40
        ];
      case 6:
        // SIX! - soars into the stands
        const sixT = Math.min(t * 1.15, 1);
        return [
          startPos[0] + Math.sin(sixT * Math.PI * 0.35) * 10,
          startPos[1] + sixT * 28 + Math.sin(sixT * Math.PI) * 15,
          startPos[2] - sixT * 60
        ];
      default:
        return startPos;
    }
  };
  
  // Ball trajectory when batsman misses - hits stumps
  const getOutPosition = (t: number): [number, number, number] => {
    const startZ = -12;
    const endZ = 6.5; // Through to stumps
    const bounceZ = -2;
    
    const z = startZ + (endZ - startZ) * t;
    
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ);
    
    if (t < 0.12) {
      y = 2.4 - t * 2;
    } else if (t < bounceT) {
      const localT = (t - 0.12) / (bounceT - 0.12);
      y = 2.16 - 2.06 * Math.pow(localT, 1.5);
    } else if (t < bounceT + 0.08) {
      const bounceLocalT = (t - bounceT) / 0.08;
      y = 0.1 + Math.sin(bounceLocalT * Math.PI) * 0.25;
    } else {
      const localT = (t - bounceT - 0.08) / (1 - bounceT - 0.08);
      // Lower trajectory to hit stumps
      y = 0.3 + Math.sin(localT * Math.PI * 0.35) * 0.25;
    }
    
    return [0, Math.max(0.06, y), z];
  };
  
  useFrame((state, delta) => {
    if (!ballRef.current) return;
    
    // Spin the ball realistically
    ballRef.current.rotation.x += delta * 25;
    ballRef.current.rotation.z += delta * 10;
    
    if (ballState === 'bowling') {
      const pos = getBowlingPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
      
      // Check if ball reached batting zone
      if (bowlingProgress > 0.85 && !hasReachedBat.current) {
        hasReachedBat.current = true;
        onBallReachBat();
      }
    } else if (ballState === 'hit' && hitResult !== null) {
      hitProgressRef.current += delta * 0.65;
      const clampedProgress = Math.min(hitProgressRef.current, 1);
      const pos = getHitPosition(hitResult, clampedProgress);
      ballRef.current.position.set(...pos);
      
      if (hitProgressRef.current >= 1.15 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onAnimationComplete();
      }
    } else if (ballState === 'out') {
      const pos = getOutPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
    } else if (ballState === 'idle') {
      // Ball at bowler's hand position
      ballRef.current.position.set(0.3, 2.5, -14);
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
    <group ref={ballRef} position={[0, 2.5, -14]}>
      {/* Main ball - larger and more visible */}
      <mesh castShadow>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial 
          color="#CC0000" 
          roughness={0.2} 
          metalness={0.15}
          emissive="#330000"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Seam - primary */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.055, 0.005, 8, 32]} />
        <meshStandardMaterial color="#FFFEF0" roughness={0.3} />
      </mesh>
      
      {/* Seam - secondary (cricket balls have two halves) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.003, 8, 32]} />
        <meshStandardMaterial color="#FFFEF0" roughness={0.3} />
      </mesh>
      
      {/* Glow for better visibility */}
      <pointLight intensity={0.5} distance={3} color="#ff4444" />
    </group>
  );
};
