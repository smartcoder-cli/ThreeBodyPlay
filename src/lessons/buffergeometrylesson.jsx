import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function BufferGeometryLesson() {
  const [amplitude, setAmplitude] = useState(0.5);
  const [frequency, setFrequency] = useState(1.0);
  const meshRef = useRef(null);
  const initialPositions = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x0a0a1a);
      
      const geometry = new THREE.BufferGeometry();
      const count = 50 * 50;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
          const idx = (i * 50 + j) * 3;
          positions[idx] = (i - 25) * 0.2;     // X
          positions[idx + 1] = 0;              // Y (Height)
          positions[idx + 2] = (j - 25) * 0.2; // Z
          
          colors[idx] = i / 50;
          colors[idx + 1] = j / 50;
          colors[idx + 2] = 1.0;
        }
      }

      initialPositions.current = new Float32Array(positions);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true
      });

      const points = new THREE.Points(geometry, material);
      meshRef.current = points;
      scene.add(points);
    },
    onAnimate: ({ clock }) => {
      if (meshRef.current && initialPositions.current) {
        const positions = meshRef.current.geometry.attributes.position.array;
        const time = clock.getElapsedTime();

        for (let i = 0; i < 50 * 50; i++) {
          const idx = i * 3;
          const x = initialPositions.current[idx];
          const z = initialPositions.current[idx + 2];
          
          // Apply a wave formula
          positions[idx + 1] = Math.sin(x * frequency + time) * Math.cos(z * frequency + time) * amplitude;
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      sidebar={
        <>
          <ControlPanel title="Wave Controls">
            <ControlGroup label="Amplitude" valueDisplay={amplitude.toFixed(2)}>
              <input type="range" min="0" max="2" step="0.1" value={amplitude} onChange={(e) => setAmplitude(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Frequency" valueDisplay={frequency.toFixed(1)}>
              <input type="range" min="0.1" max="5" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Performance">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Updating 2,500 vertices directly in the BufferAttribute. This is how you create complex animations like water, grass, or custom particles.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default BufferGeometryLesson;
