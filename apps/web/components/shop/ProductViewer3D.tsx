'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

function ToyModel({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load the product image as a texture
  useState(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
        setLoaded(true);
      },
      undefined,
      () => setLoaded(true),
    );
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.3}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            color={loaded ? '#FF6B6B' : '#f0f0f0'}
            roughness={0.5}
            metalness={0.1}
            wireframe={!loaded}
          />
        )}
      </mesh>
      {/* Crayon-style wireframe border around the model */}
      <mesh>
        <boxGeometry args={[2.7, 2.7, 2.7]} />
        <meshBasicMaterial
          color="#2D2D2D"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={0.4} />
      <Suspense
        fallback={
          <Html center>
            <div className="font-body text-sm text-gray-500 animate-pulse">
              Loading 3D...
            </div>
          </Html>
        }
      >
        <ToyModel imageUrl={imageUrl} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={1.5}
        rotateSpeed={0.8}
        zoomSpeed={0.5}
      />
    </>
  );
}

interface ProductViewer3DProps {
  imageUrl: string;
  productName: string;
}

export function ProductViewer3D({ imageUrl, productName }: ProductViewer3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative rounded-[30px_12px_30px_12px] border-3 border-ink overflow-hidden bg-gradient-to-br from-crayon-yellow/10 to-crayon-red/5 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-[100]' : 'w-full aspect-square'
      }`}
    >
      <Canvas
        shadows
        camera={{ position: [4, 2, 4], fov: 45 }}
        className="w-full h-full"
        onCreated={() => setIsLoading(false)}
      >
        <Scene imageUrl={imageUrl} />
      </Canvas>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-paper/80">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">🧸</div>
            <p className="font-body text-sm text-gray-500">Preparing 3D view...</p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-white/90 border-2 border-ink rounded-full px-3 py-1.5 font-body text-xs font-semibold hover:bg-crayon-yellow/90 transition-colors shadow-comic-sm"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen view'}
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
        <p className="font-body text-[10px] text-gray-500 bg-white/70 px-2 py-1 rounded-full border border-ink/30 pointer-events-auto">
          ✋ Drag to rotate · Scroll to zoom
        </p>
      </div>

      {/* Product name badge */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="font-body text-xs font-semibold bg-white/90 border-2 border-ink rounded-full px-3 py-1">
          3D View
        </span>
      </div>
    </div>
  );
}
