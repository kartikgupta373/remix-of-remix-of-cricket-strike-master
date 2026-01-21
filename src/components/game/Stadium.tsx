import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Stadium = () => {
  return (
    <group>
      {/* Sky dome */}
      <mesh position={[0, 0, 0]} scale={[-1, 1, 1]}>
        <sphereGeometry args={[120, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <primitive
            attach="map"
            object={createGradientTexture('#4da6ff', '#87CEEB')}
          />
        </meshBasicMaterial>
      </mesh>

      {/* Sun */}
      <mesh position={[50, 70, -40]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial color="#FFF8E0" />
      </mesh>
      <pointLight position={[50, 70, -40]} intensity={1.5} color="#FFF5E0" />

      {/* Main ground - grass field (oval shape) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -2]} receiveShadow>
        <circleGeometry args={[55, 64]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>

      {/* Inner circle grass (slightly different shade) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -2]} receiveShadow>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#388E3C" />
      </mesh>

      {/* Boundary rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -2]}>
        <ringGeometry args={[52, 53, 64]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Cricket Pitch - clay/brown */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]} receiveShadow>
        <planeGeometry args={[3.05, 22]} />
        <meshStandardMaterial color="#C4A35A" roughness={0.8} />
      </mesh>

      {/* Pitch markings - batting crease */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 6]}>
        <planeGeometry args={[2.6, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Popping crease */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 5]}>
        <planeGeometry args={[2.6, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Return creases */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.3, 0.025, 5.5]}>
        <planeGeometry args={[0.05, 1.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.3, 0.025, 5.5]}>
        <planeGeometry args={[0.05, 1.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Bowler's crease */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -10]}>
        <planeGeometry args={[2.6, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Stadium stands - simplified background without detailed crowd (crowd is 2D overlay now) */}
      {/* <StadiumStand position={[-55, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
      <StadiumStand position={[55, 0, -2]} rotation={[0, -Math.PI / 2, 0]} /> */}
      <StadiumStand position={[0, 0, -60]} rotation={[0, 0, 0]} />

      {/* Sightscreen behind bowler */}
      <mesh position={[0, 8, -65]}>
        <boxGeometry args={[20, 16, 1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Floodlights */}
      <FloodLight position={[-45, 0, -45]} />
      <FloodLight position={[45, 0, -45]} />
      <FloodLight position={[-45, 0, 40]} />
      <FloodLight position={[45, 0, 40]} />
    </group>
  );
};

const StadiumStand = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {/* Lower tier - solid color for crowd PNG overlay */}
    <mesh position={[0, 8, 0]}>
      <boxGeometry args={[90, 16, 12]} />
      <meshStandardMaterial color="#455A64" />
    </mesh>
    {/* Upper tier */}
    <mesh position={[0, 22, -3]}>
      <boxGeometry args={[85, 12, 8]} />
      <meshStandardMaterial color="#37474F" />
    </mesh>
    {/* Roof */}
    <mesh position={[0, 30, -5]}>
      <boxGeometry args={[88, 2, 15]} />
      <meshStandardMaterial color="#263238" />
    </mesh>
  </group>
);

const FloodLight = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pole */}
    <mesh position={[0, 20, 0]}>
      <cylinderGeometry args={[0.6, 1.2, 40, 8]} />
      <meshStandardMaterial color="#607D8B" />
    </mesh>
    {/* Light array */}
    <mesh position={[0, 42, 0]}>
      <boxGeometry args={[4, 3, 2]} />
      <meshStandardMaterial color="#ECEFF1" emissive="#FFFDE7" emissiveIntensity={0.3} />
    </mesh>
    <spotLight
      position={[0, 40, 0]}
      angle={0.5}
      penumbra={0.6}
      intensity={0.2}
      color="#FFFDE7"
      target-position={[0, 0, -2]}
    />
  </group>
);

function createGradientTexture(topColor: string, bottomColor: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.6, bottomColor);
  gradient.addColorStop(1, '#B3E5FC');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
