import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function SceneGraphLesson() {
  const [orbitSpeed, setOrbitSpeed] = useState(1.0);
  const [earthDistance, setEarthDistance] = useState(4);
  const [moonDistance, setMoonDistance] = useState(1.2);
  const [showGrid, setShowGrid] = useState(true);
  
  const earthSystemRef = useRef(null);
  const earthMeshRef = useRef(null);
  const moonMeshRef = useRef(null);
  const gridRef = useRef(null);
  const controlsRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene, camera } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      // 1. Setup Camera & Background
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
      scene.background = new THREE.Color(0x111122); // Dark blue instead of pitch black
      
      // 2. Setup Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // 3. Reference Grid
      const grid = new THREE.GridHelper(20, 20, 0x444444, 0x333333);
      grid.position.y = -0.5;
      gridRef.current = grid;
      scene.add(grid);

      // 4. Sun
      const sunGeo = new THREE.SphereGeometry(1, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      scene.add(sun);

      // 5. Earth System
      const earthSystem = new THREE.Group();
      earthSystemRef.current = earthSystem;
      scene.add(earthSystem);

      const earthGeo = new THREE.SphereGeometry(0.4, 32, 32);
      const earthMat = new THREE.MeshStandardMaterial({ color: 0x2233ff });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      earth.position.x = earthDistance;
      earthSystem.add(earth);
      earthMeshRef.current = earth;

      const moonGeo = new THREE.SphereGeometry(0.12, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.x = moonDistance;
      earth.add(moon);
      moonMeshRef.current = moon;

      // 6. Lights
      const sunLight = new THREE.PointLight(0xffffff, 5, 20);
      scene.add(sunLight);
      scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    },
    onAnimate: ({ clock }) => {
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      const time = clock.getElapsedTime() * orbitSpeed;
      
      if (earthSystemRef.current) {
        earthSystemRef.current.rotation.y = time * 0.5;
      }
      
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y = time * 2;
        earthMeshRef.current.position.x = earthDistance;
      }

      if (moonMeshRef.current) {
        moonMeshRef.current.position.x = moonDistance;
      }
    }
  });

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = showGrid;
    }
  }, [showGrid]);

  const codeSnippet = `// 1. Scene Graph Hierarchy
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Earth Group (Center of Earth's orbit)
const earthSystem = new THREE.Group();
scene.add(earthSystem);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.4), 
  new THREE.MeshStandardMaterial({ color: 0x2233ff })
);
earth.position.x = ${earthDistance};
earthSystem.add(earth); // Child of earthSystem

// Moon is Child of Earth
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.12),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
moon.position.x = ${moonDistance};
earth.add(moon); // Child of Earth

// 2. Animation Logic
function animate() {
  // Orbiting the sun
  earthSystem.rotation.y += 0.005;
  // Earth self-rotation
  earth.rotation.y += 0.02;
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="View Settings">
            <ControlGroup label="Reference Grid">
              <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Orbit Settings">
            <ControlGroup label="Global Speed" valueDisplay={orbitSpeed.toFixed(1)}>
              <input type="range" min="0" max="5" step="0.1" value={orbitSpeed} onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Earth Distance" valueDisplay={earthDistance.toFixed(1)}>
              <input type="range" min="2" max="8" step="0.1" value={earthDistance} onChange={(e) => setEarthDistance(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Moon Distance" valueDisplay={moonDistance.toFixed(1)}>
              <input type="range" min="0.5" max="2.5" step="0.1" value={moonDistance} onChange={(e) => setMoonDistance(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Scene Graph">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Interact with the scene by dragging to rotate and zooming with your scroll wheel.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default SceneGraphLesson;
