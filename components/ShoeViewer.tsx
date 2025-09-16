'use client';

import { useRef, useEffect, Suspense, useState } from 'react';
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

// Define 4 scroll stages with different alignments (outside component to avoid dependency issues)
const scrollStages = [
  // Stage 1: Vertical and horizontal aligned (center)
  { position: [0, 0, 0], rotation: [0, Math.PI / 1.5, 0], scale: [1, 1, 1] },
  // Stage 2: Aligned to the left
  { position: [1.5, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1] },
  // Stage 3: Aligned to the right
  {
    position: [-1, 0, 0],
    rotation: [Math.PI / 1.8, 0, -Math.PI / 0.9],
    scale: [0.8, 0.8, 0.8],
  },

  // Stage 4: Vertical and horizontal aligned (center)
  { position: [0, 0, 0], rotation: [0, Math.PI / 1.5, 0], scale: [1, 1, 1] },
];

function ShoeModel({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/shoe.glb');

  useEffect(() => {
    if (!meshRef.current) return;

    const entranceTl = gsap.timeline();

    entranceTl.fromTo(
      meshRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' },
      '<'
    );

    entranceTl.fromTo(
      meshRef.current.rotation,
      { x: 2, y: 4, z: 2 },
      {
        x: 0,
        y: Math.PI / 1.5,
        z: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      },
      '<'
    );

    // Create scroll-triggered stage-based animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: self => {
          if (meshRef.current) {
            const progress = self.progress;
            const stageProgress = progress * (scrollStages.length - 1);
            const currentStage = Math.floor(stageProgress);
            const nextStage = Math.min(
              currentStage + 1,
              scrollStages.length - 1
            );
            const stageBlend = stageProgress - currentStage;

            // Interpolate between current and next stage
            const currentStageData = scrollStages[currentStage];
            const nextStageData = scrollStages[nextStage];

            // Smooth position interpolation
            const baseX =
              currentStageData.position[0] +
              (nextStageData.position[0] - currentStageData.position[0]) *
                stageBlend;
            const baseY =
              currentStageData.position[1] +
              (nextStageData.position[1] - currentStageData.position[1]) *
                stageBlend;
            const baseZ =
              currentStageData.position[2] +
              (nextStageData.position[2] - currentStageData.position[2]) *
                stageBlend;

            // Interpolate rotation between stages
            const baseRotationX =
              currentStageData.rotation[0] +
              (nextStageData.rotation[0] - currentStageData.rotation[0]) *
                stageBlend;
            const baseRotationY =
              currentStageData.rotation[1] +
              (nextStageData.rotation[1] - currentStageData.rotation[1]) *
                stageBlend;
            const baseRotationZ =
              currentStageData.rotation[2] +
              (nextStageData.rotation[2] - currentStageData.rotation[2]) *
                stageBlend;

            // Interpolate scale between stages
            const baseScaleX =
              currentStageData.scale[0] +
              (nextStageData.scale[0] - currentStageData.scale[0]) * stageBlend;
            const baseScaleY =
              currentStageData.scale[1] +
              (nextStageData.scale[1] - currentStageData.scale[1]) * stageBlend;
            const baseScaleZ =
              currentStageData.scale[2] +
              (nextStageData.scale[2] - currentStageData.scale[2]) * stageBlend;

            // Store base position, rotation, and scale for magnetic effect
            meshRef.current.userData.basePosition = {
              x: baseX,
              y: baseY,
              z: baseZ,
            };
            meshRef.current.userData.baseRotation = {
              x: baseRotationX,
              y: baseRotationY,
              z: baseRotationZ,
            };
            meshRef.current.userData.baseScale = {
              x: baseScaleX,
              y: baseScaleY,
              z: baseScaleZ,
            };

            // Set position (magnetic effect will be applied in useFrame)
            meshRef.current.position.x = baseX;
            meshRef.current.position.y = baseY;
            meshRef.current.position.z = baseZ;

            // Set rotation from stages only (no dynamic movement)
            meshRef.current.rotation.x = baseRotationX;
            meshRef.current.rotation.y = baseRotationY;
            meshRef.current.rotation.z = baseRotationZ;

            // Set scale from stages
            meshRef.current.scale.x = baseScaleX;
            meshRef.current.scale.y = baseScaleY;
            meshRef.current.scale.z = baseScaleZ;

            console.log(
              '[v0] Scroll progress:',
              progress,
              'Stage:',
              currentStage,
              'Blend:',
              stageBlend
            );
          }
        },
      },
    });

    return () => {
      scrollTl.kill();
      entranceTl.kill();
    };
  }, []);

  // Auto-rotate when not scrolling and magnetic effect
  useFrame(state => {
    if (meshRef.current) {
      // Initialize base position if not set
      if (!meshRef.current.userData.basePosition) {
        meshRef.current.userData.basePosition = { x: 0, y: 0, z: 0 };
      }

      // Get the base position from scroll (set by scroll trigger)
      const currentBaseX = meshRef.current.userData.basePosition.x;
      const currentBaseY = meshRef.current.userData.basePosition.y;
      const currentBaseZ = meshRef.current.userData.basePosition.z;

      // Add subtle floating animation to Y position
      const floatingY =
        currentBaseY + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Magnetic effect - move away from cursor position (opposite direction)
      const magneticOffsetX = -(mousePosition.x - 0.5) * 0.3; // Reduced intensity for better balance
      const magneticOffsetZ = -(mousePosition.y - 0.5) * 0.3;

      // Apply all effects: base position + floating + magnetic
      meshRef.current.position.x = currentBaseX + magneticOffsetX;
      meshRef.current.position.y = floatingY;
      meshRef.current.position.z = currentBaseZ + magneticOffsetZ;
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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

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

    // Mouse tracking for magnetic effect
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
          <ShoeModel mousePosition={mousePosition} />
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
