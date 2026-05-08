import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function CameraResponse() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [damping, setDamping] = useState(0.05);
  const controlsRef = useRef(null);

  const { containerRef, canvasRef, isReady, camera, renderer } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = damping;
      controls.autoRotate = autoRotate;
      controlsRef.current = controls;

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.3 });
      scene.add(new THREE.Mesh(geometry, material));

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);
    },
    onAnimate: () => {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.dampingFactor = damping;
    }
  }, [autoRotate, damping]);

  const codeSnippet = `// 1. Initialize OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const controls = new OrbitControls(camera, renderer.domElement);

// 2. Enable Damping (Smoothness)
controls.enableDamping = true;
controls.dampingFactor = ${damping};

// 3. Auto-rotation
controls.autoRotate = ${autoRotate};

// 4. In the animation loop:
function animate() {
  controls.update(); // Required if damping or autoRotate is enabled
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// 5. Responsive Resizing
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Orbit Controls">
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
            <ControlGroup label="Damping" valueDisplay={damping.toFixed(2)}>
              <input type="range" min="0" max="0.2" step="0.01" value={damping} onChange={(e) => setDamping(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Responsiveness">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              The canvas automatically resizes to fill its container. OrbitControls allows navigation in 3D space.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default CameraResponse;
