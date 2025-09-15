'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Html,
} from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type * as THREE from 'three';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function ShoeModel() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/shoe.glb');

  useEffect(() => {
    if (!meshRef.current) return;

    // Create scroll-triggered rotation animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: self => {
          if (meshRef.current) {
            // Rotate on Y-axis based on scroll progress, starting from 45 degrees
            meshRef.current.rotation.y =
              Math.PI / 1.5 + self.progress * Math.PI * 4;
            // Add subtle X-axis rotation for more dynamic movement
            meshRef.current.rotation.x =
              Math.sin(self.progress * Math.PI * 2) * 0.2;
            console.log('[v0] Scroll progress:', self.progress);
          }
        },
      },
    });

    return () => {
      scrollTl.kill();
    };
  }, []);

  // Auto-rotate when not scrolling
  useFrame(state => {
    if (meshRef.current) {
      // Add subtle floating animation
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </Html>
  );
}

export default function ShoeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('[v0] ShoeViewer component rendering');

  useEffect(() => {
    if (!containerRef.current) return;

    // Fade in the entire canvas
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.2,
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 2]} />

        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <Suspense fallback={<Loader />}>
          <ShoeModel />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/shoe.glb');
