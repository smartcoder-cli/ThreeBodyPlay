import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function BufferGeometryLab() {
  const [amplitude, setAmplitude] = useState(0.5);
  const meshRef = useRef(null);
  const initialPositions = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x0a0a1a);
      const geometry = new THREE.BufferGeometry();
      const count = 60 * 60;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < 60; i++) {
        for (let j = 0; j < 60; j++) {
          const idx = (i * 60 + j) * 3;
          positions[idx] = (i - 30) * 0.15;
          positions[idx + 1] = 0;
          positions[idx + 2] = (j - 30) * 0.15;
          colors[idx] = i / 60;
          colors[idx + 1] = j / 60;
          colors[idx + 2] = 0.8;
        }
      }

      initialPositions.current = new Float32Array(positions);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({ size: 0.08, vertexColors: true });
      const points = new THREE.Points(geometry, material);
      meshRef.current = points;
      scene.add(points);
    },
    onAnimate: ({ clock }) => {
      if (meshRef.current && initialPositions.current) {
        const positions = meshRef.current.geometry.attributes.position.array;
        const time = clock.getElapsedTime();
        for (let i = 0; i < 60 * 60; i++) {
          const idx = i * 3;
          const x = initialPositions.current[idx];
          const z = initialPositions.current[idx + 2];
          positions[idx + 1] = Math.sin(x + time) * Math.cos(z + time) * amplitude;
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const codeSnippet = `// 1. Create Raw BufferGeometry
const geometry = new THREE.BufferGeometry();
const count = 3600; // 60x60 grid
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const x = (i % 60 - 30) * 0.15;
  const z = (Math.floor(i / 60) - 30) * 0.15;
  positions[i * 3 + 0] = x;
  positions[i * 3 + 1] = 0; // Y
  positions[i * 3 + 2] = z;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 2. Animate Vertices in Loop
function animate(time) {
  const array = geometry.attributes.position.array;
  for (let i = 0; i < count; i++) {
    const x = array[i * 3 + 0];
    const z = array[i * 3 + 2];
    // Create wave effect
    array[i * 3 + 1] = Math.sin(x + time) * ${amplitude};
  }
  // CRITICAL: Signal update to GPU
  geometry.attributes.position.needsUpdate = true;
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Vertex Animation">
            <ControlGroup label="Wave Amplitude" valueDisplay={amplitude.toFixed(2)}>
              <input type="range" min="0" max="2" step="0.1" value={amplitude} onChange={(e) => setAmplitude(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Points & Geometry">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              BufferGeometry allows low-level access to vertex attributes. Here we update 3,600 positions every frame.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default BufferGeometryLab;
