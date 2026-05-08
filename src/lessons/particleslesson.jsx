import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ParticlesLesson() {
  const [particleCount, setParticleCount] = useState(500);
  const [particleSize, setParticleSize] = useState(0.05);
  const [particleColor, setParticleColor] = useState('#4ecdc4');
  
  const particlesRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      createParticles(scene);
    },
    onAnimate: () => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.002;
        particlesRef.current.rotation.x += 0.001;
      }
    }
  });

  const createParticles = (targetScene) => {
    if (particlesRef.current) {
      targetScene.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      particlesRef.current.material.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: particleSize,
      color: particleColor,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    targetScene.add(particles);
  };

  useEffect(() => {
    if (isReady && scene) {
      createParticles(scene);
    }
  }, [particleCount, isReady, scene]);

  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.material.size = particleSize;
      particlesRef.current.material.color.set(particleColor);
    }
  }, [particleSize, particleColor]);

  const codeSnippet = `const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(${particleCount} * 3)
// ... fill positions
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  size: ${particleSize},
  color: '${particleColor}',
  transparent: true,
  opacity: 0.8
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Particles">
            <ControlGroup label="Count" valueDisplay={particleCount}>
              <input type="range" min="100" max="2000" step="100" value={particleCount} onChange={(e) => setParticleCount(parseInt(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Size" valueDisplay={particleSize.toFixed(2)}>
              <input type="range" min="0.01" max="0.2" step="0.01" value={particleSize} onChange={(e) => setParticleSize(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Color">
              <input type="color" value={particleColor} onChange={(e) => setParticleColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ParticlesLesson;
