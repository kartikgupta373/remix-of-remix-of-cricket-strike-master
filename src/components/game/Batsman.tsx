import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BatsmanProps {
  isSwinging: boolean;
  swingProgress: number;
}

export const Batsman = ({ isSwinging, swingProgress }: BatsmanProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const batGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!batGroupRef.current || !bodyRef.current) return;
    
    if (isSwinging) {
      // Dynamic bat swing animation - more pronounced and visible
      const swingPhase = swingProgress;
      
      // Bat rotation - dramatic backswing to follow-through
      const batRotationZ = -Math.PI / 2.5 + swingPhase * Math.PI * 1.5;
      const batRotationY = -0.4 + swingPhase * 1.2;
      const batRotationX = swingPhase * 0.8;
      
      batGroupRef.current.rotation.set(batRotationX, batRotationY, batRotationZ);
      
      // Move bat forward during swing
      batGroupRef.current.position.x = -0.35 + swingPhase * 0.3;
      batGroupRef.current.position.z = 0.15 + swingPhase * 0.4;
      
      // Body rotation during swing - more pronounced
      bodyRef.current.rotation.y = swingPhase * 0.6;
      
      // Body lean into shot
      bodyRef.current.position.x = swingPhase * 0.15;
      bodyRef.current.position.z = swingPhase * 0.1;
      
      // Arms follow the bat
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.4 + swingPhase * 0.5;
        leftArmRef.current.rotation.z = -Math.PI / 5 + swingPhase * 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.3 + swingPhase * 0.6;
        rightArmRef.current.rotation.z = Math.PI / 5 - swingPhase * 0.3;
      }
    } else {
      // Ready stance - bat raised behind, ready to strike
      batGroupRef.current.rotation.set(0.1, -0.3, -Math.PI / 2.5);
      batGroupRef.current.position.set(-0.35, 0.9, 0.15);
      bodyRef.current.rotation.y = -0.1;
      bodyRef.current.position.x = 0;
      bodyRef.current.position.z = 0;
      
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(0.4, 0, -Math.PI / 5);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(0.3, 0, Math.PI / 5);
      }
    }
  });
  
  return (
    // Batsman shifted left of wicket, bat clearly visible on the right
    <group ref={groupRef} position={[-0.35, 0, 5.5]} rotation={[0, Math.PI * 0.92, 0]}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1565C0" /> {/* Blue jersey */}
        </mesh>
        
        {/* Head with helmet */}
        <group position={[0, 1.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#1565C0" /> {/* Blue helmet */}
          </mesh>
          {/* Helmet peak */}
          <mesh position={[0, -0.02, 0.14]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#0D47A1" />
          </mesh>
          {/* Helmet grill */}
          <mesh position={[0, -0.05, 0.15]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.02]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Face */}
          <mesh position={[0, -0.02, 0.12]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FFCC80" />
          </mesh>
        </group>
        
        {/* Legs with pads - wider stance */}
        <mesh position={[-0.15, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#EEEEEE" /> {/* Batting pads */}
        </mesh>
        <mesh position={[0.15, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#EEEEEE" />
        </mesh>
        
        {/* Shoes */}
        <mesh position={[-0.15, 0.05, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.15, 0.05, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Left arm (top hand on bat) - connected to bat */}
        <group ref={leftArmRef} position={[-0.32, 1.1, 0.1]} rotation={[0.4, 0, -Math.PI / 5]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.055, 0.28, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
          {/* Forearm */}
          <mesh position={[-0.08, -0.22, 0.05]} rotation={[0.3, 0, -0.2]} castShadow>
            <capsuleGeometry args={[0.045, 0.2, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
        </group>
        
        {/* Right arm (bottom hand on bat) */}
        <group ref={rightArmRef} position={[0.32, 1.1, 0.15]} rotation={[0.3, 0, Math.PI / 5]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.055, 0.28, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.06, -0.2, 0.05]} rotation={[0.2, 0, 0.2]} castShadow>
            <capsuleGeometry args={[0.045, 0.18, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
        </group>
        
        {/* Bat group - positioned in front of batsman, held by both hands */}
        <group ref={batGroupRef} position={[-0.35, 0.9, 0.15]} rotation={[0.1, -0.3, -Math.PI / 2.5]}>
          {/* Handle grip area (where hands hold) - top hand */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.12, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Handle grip - bottom hand */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.1, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.024, 0.12, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Blade shoulder */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.09, 0.14, 0.04]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Blade main - larger for visibility */}
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry args={[0.12, 0.48, 0.045]} />
            <meshStandardMaterial color="#DEB887" />
          </mesh>
          {/* Blade toe */}
          <mesh position={[0, -0.52, 0]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.04]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Bat sticker/brand */}
          <mesh position={[0, -0.2, 0.024]} castShadow>
            <boxGeometry args={[0.09, 0.28, 0.002]} />
            <meshStandardMaterial color="#CC0000" />
          </mesh>
          {/* Gloves holding bat - top hand */}
          <mesh position={[0.02, 0.4, 0.02]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Gloves - bottom hand */}
          <mesh position={[-0.02, 0.3, 0.02]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
