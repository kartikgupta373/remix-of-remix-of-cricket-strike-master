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

// Ball release happens at 55% of bowling progress (after bowler completes delivery action)
const BALL_RELEASE_POINT = 0.55;

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
  // Ball only starts moving after release point
  const getBowlingPosition = (progress: number): [number, number, number] => {
    // Before release, ball stays in bowler's hand at proper hand height
    if (progress < BALL_RELEASE_POINT) {
      // Follow bowler's hand position during run-up and delivery
      const runProgress = Math.min(progress / 0.4, 1);
      const bowlerZ = -14 + runProgress * 4;
      
      // Bowler's arm group is at position [0.28, 1.25, 0] 
      // Hand is at relative position [0.08, 0.55, 0] from arm pivot
      // So absolute hand Y = 1.25 + 0.55 = 1.8 during idle
      
      // During delivery stride (0.4 - 0.55), arm rotates in windmill motion
      if (progress >= 0.4) {
        const deliveryProgress = (progress - 0.4) / 0.15;
        // Arm does full windmill rotation: armRef.rotation.x = -deliveryProgress * Math.PI * 2
        const armAngle = -deliveryProgress * Math.PI * 2;
        // Hand orbits around shoulder pivot (at Y=1.25)
        const shoulderY = 1.25;
        const armLength = 0.55; // distance from shoulder to hand
        const handY = shoulderY + Math.sin(armAngle + Math.PI/2) * armLength;
        const handZ = bowlerZ + Math.cos(armAngle + Math.PI/2) * armLength * 0.5;
        return [0.35, Math.max(0.8, handY), handZ];
      }
      
      // During run-up, ball is in bowler's hand at side (arm down position)
      return [0.35, 1.8, bowlerZ];
    }
    
    // After release - ball travels to batsman
    const t = (progress - BALL_RELEASE_POINT) / (1 - BALL_RELEASE_POINT);
    
    const startZ = -10;
    const endZ = 5.5;
    const bounceZ = -1;
    
    const z = startZ + (endZ - startZ) * t;
    
    // Calculate height with realistic bounce physics
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ); // ~0.58
    
    if (t < 0.08) {
      // Ball just released from hand
      y = 2.3 - t * 4;
    } else if (t < bounceT) {
      // Descending to pitch - clear arc
      const localT = (t - 0.08) / (bounceT - 0.08);
      const startHeight = 1.98;
      const endHeight = 0.06;
      y = startHeight - (startHeight - endHeight) * Math.pow(localT, 1.4);
    } else if (t < bounceT + 0.1) {
      // BOUNCE moment - visible compression and spring up
      const bounceLocalT = (t - bounceT) / 0.1;
      y = 0.06 + Math.sin(bounceLocalT * Math.PI) * 0.4;
    } else {
      // After bounce - rises to batting height
      const localT = (t - bounceT - 0.1) / (1 - bounceT - 0.1);
      const bounceHeight = 0.4;
      const peakHeight = 0.9;
      y = bounceHeight + (peakHeight - bounceHeight) * Math.sin(localT * Math.PI * 0.5);
    }
    
    // Slight lateral movement (swing/seam)
    const x = Math.sin(t * Math.PI * 0.4) * 0.1;
    
    return [x, Math.max(0.06, y), z];
  };
  
  // Ball trajectory when hit - different for each run value
  const getHitPosition = (runs: number, t: number): [number, number, number] => {
    const startPos: [number, number, number] = [0, 0.85, 5.5];
    const easeT = 1 - Math.pow(1 - t, 2.5);
    
    switch(runs) {
      case 1:
        return [
          startPos[0] + easeT * 5,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.92)),
          startPos[2] - easeT * 10
        ];
      case 2:
        return [
          startPos[0] - easeT * 10,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.85) + Math.sin(t * Math.PI * 2) * 0.15),
          startPos[2] - easeT * 20
        ];
      case 3:
        return [
          startPos[0] + easeT * 15,
          startPos[1] + Math.sin(t * Math.PI) * 5,
          startPos[2] - easeT * 28
        ];
      case 4:
        return [
          startPos[0] - easeT * 20,
          Math.max(0.06, startPos[1] * (1 - easeT * 0.6) + Math.sin(t * Math.PI * 3) * 0.12),
          startPos[2] - easeT * 45
        ];
      case 5:
        return [
          startPos[0] + easeT * 12,
          startPos[1] + Math.sin(t * Math.PI * 0.75) * 14,
          startPos[2] - easeT * 40
        ];
      case 6:
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
  const getOutPosition = (progress: number): [number, number, number] => {
    if (progress < BALL_RELEASE_POINT) {
      const runProgress = Math.min(progress / 0.4, 1);
      const bowlerZ = -14 + runProgress * 4;
      if (progress >= 0.4) {
        const deliveryProgress = (progress - 0.4) / 0.15;
        const armAngle = deliveryProgress * Math.PI * 1.5;
        const handY = 1.25 + Math.sin(armAngle) * 0.8;
        const handZ = bowlerZ + Math.cos(armAngle) * 0.5;
        return [0.35, Math.max(1.5, handY + 0.8), handZ];
      }
      return [0.35, 2.5, bowlerZ];
    }
    
    const t = (progress - BALL_RELEASE_POINT) / (1 - BALL_RELEASE_POINT);
    
    const startZ = -10;
    const endZ = 6.5;
    const bounceZ = -1;
    
    const z = startZ + (endZ - startZ) * t;
    
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ);
    
    if (t < 0.08) {
      y = 2.3 - t * 4;
    } else if (t < bounceT) {
      const localT = (t - 0.08) / (bounceT - 0.08);
      y = 1.98 - 1.88 * Math.pow(localT, 1.4);
    } else if (t < bounceT + 0.1) {
      const bounceLocalT = (t - bounceT) / 0.1;
      y = 0.08 + Math.sin(bounceLocalT * Math.PI) * 0.3;
    } else {
      const localT = (t - bounceT - 0.1) / (1 - bounceT - 0.1);
      y = 0.35 + Math.sin(localT * Math.PI * 0.35) * 0.2;
    }
    
    return [0, Math.max(0.06, y), z];
  };
  
  useFrame((state, delta) => {
    if (!ballRef.current) return;
    
    // Only spin when ball is in flight (after release)
    if (bowlingProgress >= BALL_RELEASE_POINT || ballState === 'hit') {
      ballRef.current.rotation.x += delta * 25;
      ballRef.current.rotation.z += delta * 10;
    }
    
    if (ballState === 'bowling') {
      const pos = getBowlingPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
      
      // Check if ball reached batting zone
      if (bowlingProgress > 0.88 && !hasReachedBat.current) {
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
      // Ball at bowler's hand position (proper hand height)
      ballRef.current.position.set(0.35, 1.8, -14);
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
    <group ref={ballRef} position={[0.35, 1.8, -14]}>
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
      
      {/* Seam - secondary */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.003, 8, 32]} />
        <meshStandardMaterial color="#FFFEF0" roughness={0.3} />
      </mesh>
      
      {/* Glow for better visibility */}
      <pointLight intensity={0.5} distance={3} color="#ff4444" />
    </group>
  );
};
