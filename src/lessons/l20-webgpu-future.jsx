import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function WebGPULesson() {
  const [color, setColor] = useState('#4ecdc4');
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      const mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
      meshRef.current = mesh;
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const p1 = new THREE.PointLight(0x4ecdc4, 40, 15); p1.position.set(3, 3, 3); scene.add(p1);
      const p2 = new THREE.PointLight(0xff6b6b, 30, 15); p2.position.set(-3, -3, 3); scene.add(p2);
    },
    onAnimate: () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005 * rotationSpeed;
        meshRef.current.rotation.y += 0.01 * rotationSpeed;
      }
    }
  });

  useEffect(() => {
    if (meshRef.current) meshRef.current.material.color.set(color);
  }, [color]);

  const codeSnippet = `// 1. WebGPU Initialization (Theoretical)
// Note: Three.js WebGPURenderer is currently in development (JSM)

/* 
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';

const renderer = new WebGPURenderer({ 
  canvas: myCanvas,
  antialias: true 
});
await renderer.init();
*/

// 2. TSL (Three Shading Language)
// WebGPU uses TSL for cross-platform shading
// mesh.material = new MeshStandardNodeMaterial({ ... });

// 3. Current State
// Most Three.js features are being ported to support
// both WebGL and WebGPU seamlessly.`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Visuals">
            <ControlGroup label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Rotation" valueDisplay={rotationSpeed.toFixed(1)}>
              <input type="range" min="0" max="2" step="0.1" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="WebGPU">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Future tech: WebGPU offers compute shaders and lower CPU overhead.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default WebGPULesson;
