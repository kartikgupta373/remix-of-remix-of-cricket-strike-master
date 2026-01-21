import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BowlerProps {
  isBowling: boolean;
  bowlingProgress: number;
}

export const Bowler = ({ isBowling, bowlingProgress }: BowlerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!groupRef.current || !armRef.current) return;

    if (isBowling) {
      // Phase 1: Run-up (0 - 0.4)
      if (bowlingProgress < 0.4) {
        const runProgress = bowlingProgress / 0.4;

        // Move towards the crease
        groupRef.current.position.z = -14 + runProgress * 4;

        // Running leg animation
        if (leftLegRef.current && rightLegRef.current) {
          const legSwing = Math.sin(runProgress * Math.PI * 6) * 0.5;
          leftLegRef.current.rotation.x = legSwing;
          rightLegRef.current.rotation.x = -legSwing;
        }

        // Arm pumping during run
        if (armRef.current && leftArmRef.current) {
          armRef.current.rotation.x = Math.sin(runProgress * Math.PI * 6) * 0.3;
          leftArmRef.current.rotation.x = -Math.sin(runProgress * Math.PI * 6) * 0.3;
        }

        // Slight body bounce
        groupRef.current.position.y = Math.abs(Math.sin(runProgress * Math.PI * 6)) * 0.08;

        // Phase 2: Jump and delivery stride (0.4 - 0.6)
      } else if (bowlingProgress < 0.6) {
        const deliveryProgress = (bowlingProgress - 0.4) / 0.2;

        groupRef.current.position.z = -10;

        // Jump arc
        // groupRef.current.position.y = Math.sin(deliveryProgress * Math.PI) * 0.4;

        // Bowling arm windmill - full rotation
        if (armRef.current) {
          armRef.current.rotation.x = -deliveryProgress * Math.PI * 2;
        }

        // Non-bowling arm goes up for balance
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI / 2 * deliveryProgress;
          leftArmRef.current.rotation.z = -Math.PI / 4 * deliveryProgress;
        }

        // Front leg comes forward
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = -deliveryProgress * 0.8;
          rightLegRef.current.rotation.x = deliveryProgress * 0.3;
        }

        // Body lean back then forward
        groupRef.current.rotation.x = Math.sin(deliveryProgress * Math.PI) * 0.2;

        // Phase 3: Release and follow-through (0.6 - 1.0)
      } else {
        const followProgress = (bowlingProgress - 0.6) / 0.4;

        groupRef.current.position.z = -10 + followProgress * 0.5;
        groupRef.current.position.y = 0;

        // Arm comes down after release
        if (armRef.current) {
          armRef.current.rotation.x = -Math.PI * 2 - followProgress * Math.PI * 0.3;
        }

        // Body follows through
        groupRef.current.rotation.x = 0.2 - followProgress * 0.3;

        // Arms relax
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI / 2 * (1 - followProgress);
          leftArmRef.current.rotation.z = -Math.PI / 4 * (1 - followProgress);
        }

        // Legs settle
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = -0.8 * (1 - followProgress);
          rightLegRef.current.rotation.x = 0.3 * (1 - followProgress);
        }
      }
    } else {
      // Reset to starting position
      groupRef.current.position.set(0, 0, -14);
      groupRef.current.rotation.set(0, 0, 0);
      if (armRef.current) armRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        leftArmRef.current.rotation.z = 0;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -14]}>
      {/* Body/Torso */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        <meshStandardMaterial color="#D32F2F" /> {/* Red jersey */}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#FFCC80" /> {/* Skin */}
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.7, -0.02]} castShadow>
        <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Left Leg (front leg in delivery) */}
      <mesh ref={leftLegRef} position={[-0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Right Leg (back leg) */}
      <mesh ref={rightLegRef} position={[0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.1, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Bowling arm (right) */}
      <group ref={armRef} position={[0.28, 1.25, 0]}>
        {/* Upper arm */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 10]} castShadow>
          <capsuleGeometry args={[0.055, 0.25, 8, 16]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.05, 0.38, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
          <meshStandardMaterial color="#FFCC80" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.08, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#FFCC80" />
        </mesh>
      </group>

      {/* Non-bowling arm (left) */}
      <mesh ref={leftArmRef} position={[-0.28, 1.1, 0.08]} rotation={[0.2, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.055, 0.32, 8, 16]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>
    </group>
  );
};
