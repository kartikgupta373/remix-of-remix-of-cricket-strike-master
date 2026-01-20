import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Stadium = () => {
  const crowdRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (crowdRef.current) {
      // Subtle crowd animation
      crowdRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.02;
      });
    }
  });

  return (
    <group>
      {/* Sky dome */}
      <mesh position={[0, 0, 0]} scale={[-1, 1, 1]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <primitive 
            attach="map" 
            object={createGradientTexture('#4da6ff', '#87CEEB')} 
          />
        </meshBasicMaterial>
      </mesh>

      {/* Sun */}
      <mesh position={[40, 60, -30]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color="#FFF5E0" />
      </mesh>
      <pointLight position={[40, 60, -30]} intensity={1.5} color="#FFF5E0" />

      {/* Main ground - grass field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>

      {/* Boundary rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[44, 45, 64]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3, 22]} />
        <meshStandardMaterial color="#C4A35A" />
      </mesh>

      {/* Pitch crease lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 8]}>
        <planeGeometry args={[2.5, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -8]}>
        <planeGeometry args={[2.5, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Stadium stands - simplified */}
      <StadiumStand position={[-50, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <StadiumStand position={[50, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <StadiumStand position={[0, 0, -55]} rotation={[0, 0, 0]} />
      <StadiumStand position={[0, 0, 55]} rotation={[0, Math.PI, 0]} />

      {/* Crowd dots */}
      <group ref={crowdRef}>
        <CrowdSection position={[-45, 8, 0]} />
        <CrowdSection position={[45, 8, 0]} />
        <CrowdSection position={[0, 8, -50]} />
      </group>

      {/* Floodlights */}
      <FloodLight position={[-40, 30, -40]} />
      <FloodLight position={[40, 30, -40]} />
      <FloodLight position={[-40, 30, 40]} />
      <FloodLight position={[40, 30, 40]} />

      {/* Ambient and directional light */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 40, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};

const StadiumStand = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 10, 0]}>
      <boxGeometry args={[80, 20, 10]} />
      <meshStandardMaterial color="#455A64" />
    </mesh>
    <mesh position={[0, 22, -2]}>
      <boxGeometry args={[75, 5, 6]} />
      <meshStandardMaterial color="#37474F" />
    </mesh>
  </group>
);

const CrowdSection = ({ position }: { position: [number, number, number] }) => {
  const colors = ['#1E88E5', '#E53935', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'];
  const dots = [];
  
  for (let i = 0; i < 100; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    dots.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
  
  return <group position={position}>{dots}</group>;
};

const FloodLight = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh>
      <cylinderGeometry args={[0.5, 1, 30, 8]} />
      <meshStandardMaterial color="#78909C" />
    </mesh>
    <mesh position={[0, 16, 0]}>
      <boxGeometry args={[3, 2, 1]} />
      <meshStandardMaterial color="#E0E0E0" emissive="#FFFDE7" emissiveIntensity={0.5} />
    </mesh>
    <spotLight
      position={[0, 15, 0]}
      angle={0.6}
      penumbra={0.5}
      intensity={0.3}
      color="#FFFDE7"
      castShadow={false}
    />
  </group>
);

function createGradientTexture(topColor: string, bottomColor: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 256);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
