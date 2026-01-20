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
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!batGroupRef.current || !bodyRef.current) return;
    
    if (isSwinging) {
      const swingPhase = swingProgress;
      
      // Bat rotation - dramatic backswing to follow-through
      const batRotationZ = -Math.PI / 2.5 + swingPhase * Math.PI * 1.5;
      const batRotationY = -0.4 + swingPhase * 1.2;
      const batRotationX = swingPhase * 0.8;
      
      batGroupRef.current.rotation.set(batRotationX, batRotationY, batRotationZ);
      batGroupRef.current.position.x = 0.4 + swingPhase * 0.3;
      batGroupRef.current.position.z = 0.2 + swingPhase * 0.4;
      
      // Body rotation during swing
      bodyRef.current.rotation.y = swingPhase * 0.6;
      bodyRef.current.position.x = swingPhase * 0.1;
      
      // Arms follow the swing
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.5 - swingPhase * 0.8;
        leftArmRef.current.rotation.z = -0.4 + swingPhase * 0.6;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.3 - swingPhase * 0.6;
        rightArmRef.current.rotation.z = 0.4 - swingPhase * 0.5;
      }
    } else {
      // Ready stance
      batGroupRef.current.rotation.set(0.1, -0.3, -Math.PI / 2.5);
      batGroupRef.current.position.set(0.55, 0.95, 0.1);
      bodyRef.current.rotation.y = -0.1;
      bodyRef.current.position.x = 0;
      
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.5, 0, -0.4);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.3, 0, 0.4);
      }
    }
  });
  
  return (
    // Batsman shifted left of wicket, bat clearly visible on the right
    <group ref={groupRef} position={[-0.7, 0, 5.5]} rotation={[0, Math.PI * 0.15, 0]}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1565C0" />
        </mesh>
        
        {/* Head with helmet */}
        <group position={[0, 1.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#1565C0" />
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
        
        {/* Legs with pads */}
        <mesh position={[-0.15, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#EEEEEE" />
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
        
        {/* Left arm - single cylinder with glove */}
        <mesh 
          ref={leftArmRef} 
          position={[-0.28, 1.05, 0.15]} 
          rotation={[-0.5, 0, -0.4]} 
          castShadow
        >
          <capsuleGeometry args={[0.055, 0.45, 8, 16]} />
          <meshStandardMaterial color="#1565C0" />
        </mesh>
        
        {/* Right arm - single cylinder with glove */}
        <mesh 
          ref={rightArmRef} 
          position={[0.28, 1.05, 0.15]} 
          rotation={[-0.3, 0, 0.4]} 
          castShadow
        >
          <capsuleGeometry args={[0.055, 0.45, 8, 16]} />
          <meshStandardMaterial color="#1565C0" />
        </mesh>
        
        {/* Bat group - positioned to the right of batsman */}
        <group ref={batGroupRef} position={[0.55, 0.95, 0.1]} rotation={[0.1, 0.3, -Math.PI / 2.5]}>
          {/* Handle grip */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.2, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.022, 0.15, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Blade shoulder */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.09, 0.14, 0.04]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Blade main */}
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry args={[0.12, 0.48, 0.045]} />
            <meshStandardMaterial color="#DEB887" />
          </mesh>
          {/* Blade toe */}
          <mesh position={[0, -0.52, 0]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.04]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Bat sticker */}
          <mesh position={[0, -0.2, 0.024]} castShadow>
            <boxGeometry args={[0.09, 0.28, 0.002]} />
            <meshStandardMaterial color="#CC0000" />
          </mesh>
          {/* Gloves holding bat */}
          <mesh position={[0, 0.38, 0.02]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0.28, 0.02]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
