import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StumpsProps {
  position: [number, number, number];
  bailsFallen?: boolean;
}

export const Stumps = ({ position, bailsFallen = false }: StumpsProps) => {
  const bailsRef = useRef<THREE.Group>(null);
  const leftStumpRef = useRef<THREE.Mesh>(null);
  const middleStumpRef = useRef<THREE.Mesh>(null);
  const rightStumpRef = useRef<THREE.Mesh>(null);
  
  const animationProgress = useRef(0);
  const bailVelocity = useRef({ y: 0, z: 0, rotX: 0, rotZ: 0 });
  const stumpVelocities = useRef([
    { rot: 0, vel: 0 },
    { rot: 0, vel: 0 },
    { rot: 0, vel: 0 }
  ]);
  
  // Reset animation when bailsFallen changes
  useEffect(() => {
    if (!bailsFallen) {
      animationProgress.current = 0;
      bailVelocity.current = { y: 0, z: 0, rotX: 0, rotZ: 0 };
      stumpVelocities.current = [
        { rot: 0, vel: 0 },
        { rot: 0, vel: 0 },
        { rot: 0, vel: 0 }
      ];
    } else {
      // Initialize fall velocities
      bailVelocity.current = { y: 3, z: -2, rotX: 8, rotZ: 12 };
      stumpVelocities.current = [
        { rot: 0, vel: 2.5 },  // Left stump
        { rot: 0, vel: 4 },    // Middle stump - hit hardest
        { rot: 0, vel: 1.8 }   // Right stump
      ];
    }
  }, [bailsFallen]);
  
  useFrame((state, delta) => {
    if (!bailsFallen) return;
    
    animationProgress.current += delta;
    const t = animationProgress.current;
    
    // Animate bails flying off
    if (bailsRef.current && t < 2) {
      bailVelocity.current.y -= delta * 12; // Gravity
      
      bailsRef.current.position.y += bailVelocity.current.y * delta;
      bailsRef.current.position.z += bailVelocity.current.z * delta;
      bailsRef.current.rotation.x += bailVelocity.current.rotX * delta;
      bailsRef.current.rotation.z += bailVelocity.current.rotZ * delta;
      
      // Clamp to ground
      if (bailsRef.current.position.y < -0.5) {
        bailsRef.current.position.y = -0.5;
        bailVelocity.current.y = 0;
        bailVelocity.current.rotX *= 0.3;
        bailVelocity.current.rotZ *= 0.3;
      }
    }
    
    // Animate stumps falling backward
    const stumps = [leftStumpRef, middleStumpRef, rightStumpRef];
    stumps.forEach((stumpRef, i) => {
      if (stumpRef.current && t < 1.5) {
        const vel = stumpVelocities.current[i];
        vel.rot += vel.vel * delta;
        vel.vel -= delta * 2; // Deceleration
        
        // Max rotation (fallen)
        vel.rot = Math.min(vel.rot, 0.6);
        
        stumpRef.current.rotation.x = -vel.rot;
        stumpRef.current.position.z = -vel.rot * 0.2;
        stumpRef.current.position.y = 0.36 - vel.rot * 0.1;
      }
    });
  });
  
  const stumpHeight = 0.72;
  const stumpRadius = 0.016;
  const stumpSpacing = 0.115;
  
  return (
    <group position={position}>
      {/* Left stump */}
      <mesh 
        ref={leftStumpRef} 
        position={[-stumpSpacing, stumpHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[stumpRadius, stumpRadius * 1.15, stumpHeight, 12]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.55} metalness={0.05} />
      </mesh>
      
      {/* Middle stump */}
      <mesh 
        ref={middleStumpRef} 
        position={[0, stumpHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[stumpRadius, stumpRadius * 1.15, stumpHeight, 12]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.55} metalness={0.05} />
      </mesh>
      
      {/* Right stump */}
      <mesh 
        ref={rightStumpRef} 
        position={[stumpSpacing, stumpHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[stumpRadius, stumpRadius * 1.15, stumpHeight, 12]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.55} metalness={0.05} />
      </mesh>
      
      {/* Stump tops */}
      {[-stumpSpacing, 0, stumpSpacing].map((offset, i) => (
        <mesh key={`top-${i}`} position={[offset, stumpHeight + 0.012, 0]} castShadow>
          <cylinderGeometry args={[stumpRadius * 1.25, stumpRadius, 0.025, 12]} />
          <meshStandardMaterial color="#E8D4A8" />
        </mesh>
      ))}
      
      {/* Bails */}
      <group ref={bailsRef} position={[0, stumpHeight + 0.028, 0]}>
        {/* Left bail */}
        <mesh position={[-stumpSpacing / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, stumpSpacing * 0.88, 8]} />
          <meshStandardMaterial color="#CD853F" roughness={0.45} />
        </mesh>
        {/* Right bail */}
        <mesh position={[stumpSpacing / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, stumpSpacing * 0.88, 8]} />
          <meshStandardMaterial color="#CD853F" roughness={0.45} />
        </mesh>
      </group>
      
      {/* Crease line */}
      <mesh position={[0, 0.006, 0.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.85, 0.045]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
      </mesh>
    </group>
  );
};
