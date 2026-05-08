import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function BasicScene() {
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [cubeColor, setCubeColor] = useState('#4ecdc4');
  const [autoRotate, setAutoRotate] = useState(true);
  
  const cubeRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(bgColor);
      
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: cubeColor });
      const cube = new THREE.Mesh(geometry, material);
      cubeRef.current = cube;
      scene.add(cube);
      
      // Boosted lights for modern Three.js
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 10);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
    },
    onAnimate: () => {
      if (autoRotate && cubeRef.current) {
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;
      }
    }
  });

  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(bgColor);
    }
  }, [bgColor, scene]);

  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.material.color.set(cubeColor);
    }
  }, [cubeColor]);

  const codeSnippet = `// 1. Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('${bgColor}');

// 2. Setup Camera
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5;

// 3. Add Object
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: '${cubeColor}' })
);
scene.add(cube);

// 4. Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.0));
scene.add(new THREE.PointLight(0xffffff, 10));`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Scene">
            <ControlGroup label="Background">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Cube">
            <ControlGroup label="Color">
              <input type="color" value={cubeColor} onChange={(e) => setCubeColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default BasicScene;
