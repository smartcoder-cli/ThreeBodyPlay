import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function VrArLesson() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [vrSupported, setVrSupported] = useState(false);

  const cubesRef = useRef([]);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      camera.position.z = 7;

      // Check VR support
      if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then(setVrSupported);
      }

      const cubeSize = 0.6, gridSize = 3, spacing = 2.0;
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          for (let z = 0; z < gridSize; z++) {
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL((x + y + z) / 9 * 0.3 + 0.5, 0.7, 0.5),
              metalness: 0.8, roughness: 0.1
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set((x - 1) * spacing, (y - 1) * spacing, (z - 1) * spacing);
            cube.userData = { basePos: cube.position.clone(), phase: (x + y * 3 + z * 9) * 0.4 };
            scene.add(cube);
            cubesRef.current.push(cube);
          }
        }
      }

      // VIBRANT LIGHTING
      scene.add(new THREE.AmbientLight(0xffffff, 1.0));
      const p1 = new THREE.PointLight(0x00ffff, 80, 30); p1.position.set(10, 10, 10); scene.add(p1);
      const p2 = new THREE.PointLight(0xff00ff, 60, 30); p2.position.set(-10, 5, -10); scene.add(p2);
    },
    onAnimate: () => {
      const time = Date.now() * 0.001;
      cubesRef.current.forEach(cube => {
        if (autoRotate) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
        }
        cube.position.y = cube.userData.basePos.y + Math.sin(time + cube.userData.phase) * 0.4;
      });
    }
  });

  const codeSnippet = `// 1. Create Cube Grid
const gridSize = 3;
const spacing = 2.0;
const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);

for (let x = 0; x < gridSize; x++) {
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (x - 1) * spacing, 
        (y - 1) * spacing, 
        (z - 1) * spacing
      );
      scene.add(mesh);
    }
  }
}

// 2. Enable WebXR
renderer.xr.enabled = true;

// 3. XR Animation Loop
renderer.setAnimationLoop((time) => {
  // Update animations here
  renderer.render(scene, camera);
});`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Scene">
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="VR Info">
            <p style={{ fontSize: '0.8rem', color: vrSupported ? '#4ecdc4' : '#888' }}>
              {vrSupported ? '✓ VR Supported' : 'VR not detected'}
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default VrArLesson;
