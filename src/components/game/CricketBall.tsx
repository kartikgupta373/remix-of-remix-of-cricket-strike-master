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
  const ballRef = useRef<THREE.Mesh>(null);
  const hitProgressRef = useRef(0);
  const hasReachedBat = useRef(false);
  
  // Ball trajectory during bowling (with bounce)
  const getBowlingPosition = (t: number): [number, number, number] => {
    // Bowler position to batsman position
    const startZ = -10;
    const endZ = 8;
    const bounceZ = -2; // Where ball bounces
    
    const z = startZ + (endZ - startZ) * t;
    
    // Ball height with bounce physics
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ); // ~0.44
    
    if (t < bounceT) {
      // Descending before bounce
      const localT = t / bounceT;
      y = 2 - 1.5 * localT; // From 2 to 0.5
    } else {
      // After bounce - rising then falling
      const localT = (t - bounceT) / (1 - bounceT);
      // Parabolic arc after bounce, peaks around waist height
      y = 0.5 + 0.6 * Math.sin(localT * Math.PI * 0.6);
    }
    
    // Slight lateral movement
    const x = Math.sin(t * Math.PI) * 0.1;
    
    return [x, y, z];
  };
  
  // Ball trajectory when hit (different based on runs)
  const getHitPosition = (runs: number, t: number): [number, number, number] => {
    const startPos: [number, number, number] = [0, 0.8, 8];
    
    switch(runs) {
      case 1:
        // Soft tap - rolls on ground
        return [
          startPos[0] + t * 8,
          Math.max(0.1, startPos[1] * (1 - t)),
          startPos[2] - t * 15
        ];
      case 2:
        // Ground shot through gap
        return [
          startPos[0] - t * 15,
          Math.max(0.1, startPos[1] * (1 - t) + Math.sin(t * Math.PI) * 0.3),
          startPos[2] - t * 20
        ];
      case 3:
        // Running between wickets shot
        return [
          startPos[0] + t * 20,
          startPos[1] + Math.sin(t * Math.PI) * 2,
          startPos[2] - t * 30
        ];
      case 4:
        // Boundary along ground - FOUR!
        return [
          startPos[0] - t * 25,
          Math.max(0.1, startPos[1] * (1 - t * 0.5)),
          startPos[2] - t * 45
        ];
      case 5:
        // Almost a six - lands just inside
        return [
          startPos[0] + t * 20,
          startPos[1] + Math.sin(t * Math.PI) * 8,
          startPos[2] - t * 40
        ];
      case 6:
        // SIX! - flies out of stadium
        return [
          startPos[0] + Math.sin(t * Math.PI * 0.5) * 5,
          startPos[1] + t * 20 + Math.sin(t * Math.PI) * 15,
          startPos[2] - t * 60
        ];
      default:
        return startPos;
    }
  };
  
  // Ball going to hit stumps (OUT!)
  const getOutPosition = (t: number): [number, number, number] => {
    const startZ = -10;
    const endZ = 8.5; // Past the batsman to stumps
    const bounceZ = -2;
    
    const z = startZ + (endZ - startZ) * t;
    
    let y: number;
    const bounceT = (bounceZ - startZ) / (endZ - startZ);
    
    if (t < bounceT) {
      const localT = t / bounceT;
      y = 2 - 1.5 * localT;
    } else {
      const localT = (t - bounceT) / (1 - bounceT);
      // Lower trajectory to hit stumps
      y = 0.5 + 0.3 * Math.sin(localT * Math.PI * 0.4);
    }
    
    return [0, y, z];
  };
  
  useFrame((state, delta) => {
    if (!ballRef.current) return;
    
    // Spin the ball
    ballRef.current.rotation.x += delta * 15;
    ballRef.current.rotation.z += delta * 5;
    
    if (ballState === 'bowling') {
      const pos = getBowlingPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
      
      // Check if ball reached batting zone
      if (bowlingProgress > 0.85 && !hasReachedBat.current) {
        hasReachedBat.current = true;
        onBallReachBat();
      }
    } else if (ballState === 'hit' && hitResult !== null) {
      hitProgressRef.current += delta * 0.8;
      const pos = getHitPosition(hitResult, Math.min(hitProgressRef.current, 1));
      ballRef.current.position.set(...pos);
      
      if (hitProgressRef.current >= 1.2) {
        onAnimationComplete();
        hitProgressRef.current = 0;
      }
    } else if (ballState === 'out') {
      const pos = getOutPosition(bowlingProgress);
      ballRef.current.position.set(...pos);
    } else if (ballState === 'idle') {
      // Reset
      hasReachedBat.current = false;
      hitProgressRef.current = 0;
      ballRef.current.position.set(0, 2, -10);
    }
  });
  
  useEffect(() => {
    if (ballState === 'idle') {
      hasReachedBat.current = false;
      hitProgressRef.current = 0;
    }
  }, [ballState]);
  
  return (
    <mesh ref={ballRef} position={[0, 2, -10]} castShadow>
      <sphereGeometry args={[0.036, 16, 16]} />
      <meshStandardMaterial color="#CC0000" roughness={0.3} />
      {/* Seam */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.036, 0.003, 8, 32]} />
        <meshStandardMaterial color="#FFFFEE" />
      </mesh>
    </mesh>
  );
};
