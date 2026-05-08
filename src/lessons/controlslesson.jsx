import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ControlsLesson() {
  const [enableDamping, setEnableDamping] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(1);
  const [enableZoom, setEnableZoom] = useState(true);

  const controlsRef = useRef(null);
  const objectsRef = useRef([]);
  
  const { containerRef, canvasRef, isReady, camera, renderer } = useThree({
    onInit: ({ THREE, scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      camera.position.set(3, 3, 5);

      const objects = [];
      const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.ConeGeometry(0.7, 1.5, 32)
      ];
      const colors = [0x4ecdc4, 0xff6b6b, 0xffd93d];

      geometries.forEach((geo, i) => {
        const mat = new THREE.MeshStandardMaterial({ color: colors[i] });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = (i - 1) * 2.5;
        scene.add(mesh);
        objects.push(mesh);
      });
      objectsRef.current = objects;

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
    },
    onAnimate: () => {
      if (controlsRef.current) {
        controlsRef.current.enableDamping = enableDamping;
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = rotateSpeed;
        controlsRef.current.enableZoom = enableZoom;
        controlsRef.current.update();
      }

      if (autoRotate) {
        objectsRef.current.forEach((obj, i) => {
          obj.rotation.y += 0.005 * (i + 1);
        });
      }
    }
  });

  const codeSnippet = `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = ${enableDamping}
controls.autoRotate = ${autoRotate}
controls.autoRotateSpeed = ${rotateSpeed}
controls.enableZoom = ${enableZoom}

function animate() {
  controls.update()
  renderer.render(scene, camera)
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="OrbitControls">
            <ControlGroup label="Enable Damping">
              <input type="checkbox" checked={enableDamping} onChange={(e) => setEnableDamping(e.target.checked)} />
            </ControlGroup>
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
            <ControlGroup label="Enable Zoom">
              <input type="checkbox" checked={enableZoom} onChange={(e) => setEnableZoom(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Settings">
            <ControlGroup label="Rotate Speed" valueDisplay={rotateSpeed.toFixed(1)}>
              <input type="range" min="0.5" max="5" step="0.5" value={rotateSpeed} onChange={(e) => setRotateSpeed(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ControlsLesson;
