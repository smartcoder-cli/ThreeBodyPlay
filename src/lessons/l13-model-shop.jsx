import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ModelLoadingLesson() {
  const [modelColor, setModelColor] = useState('#4ecdc4');
  const [autoRotate, setAutoRotate] = useState(true);
  const [scale, setScale] = useState(1);
  
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  
  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x0a0a1a);
      camera.position.set(4, 4, 8);
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);
      
      const light1 = new THREE.DirectionalLight(0xffffff, 2);
      light1.position.set(5, 10, 5);
      scene.add(light1);

      const light2 = new THREE.PointLight(modelColor, 20);
      light2.position.set(-3, 2, 3);
      scene.add(light2);
      
      // Complex Procedural Robot
      const robot = new THREE.Group();
      const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
      const mainMat = new THREE.MeshStandardMaterial({ color: modelColor, metalness: 0.5, roughness: 0.5 });
      
      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.6), mainMat);
      body.position.y = 1.6;
      body.name = 'body';
      robot.add(body);

      // Core
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      core.position.set(0, 1.8, 0.35);
      robot.add(core);
      
      // Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), metalMat);
      head.position.y = 2.5;
      robot.add(head);

      // Antenna
      const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), metalMat);
      antBase.position.y = 2.9;
      robot.add(antBase);
      const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      antTip.position.y = 3.1;
      robot.add(antTip);
      
      // Eyes (Relative to head)
      const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat); 
      eyeL.position.set(-0.15, 0.05, 0.25); // Relative to head center
      head.add(eyeL);
      
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat); 
      eyeR.position.set(0.15, 0.05, 0.25); // Relative to head center
      head.add(eyeR);

      // Arms
      const armGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
      const armL = new THREE.Mesh(armGeo, mainMat); armL.position.set(-0.7, 1.8, 0); robot.add(armL);
      const armR = new THREE.Mesh(armGeo, mainMat); armR.position.set(0.7, 1.8, 0); robot.add(armR);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.3, 1, 0.3);
      const legL = new THREE.Mesh(legGeo, metalMat); legL.position.set(-0.3, 0.5, 0); robot.add(legL);
      const legR = new THREE.Mesh(legGeo, metalMat); legR.position.set(0.3, 0.5, 0); robot.add(legR);
      
      modelRef.current = robot;
      scene.add(robot);
      scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222));
    },
    onAnimate: ({ clock }) => {
      if (controlsRef.current) controlsRef.current.update();
      if (autoRotate && modelRef.current) {
        modelRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
      }
    }
  });

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.name === 'body') {
          child.material.color.set(modelColor);
        }
      });
      modelRef.current.scale.setScalar(scale);
    }
  }, [modelColor, scale]);

  const codeSnippet = `// 1. Create Robot Group
const robot = new THREE.Group();

// 2. Body & Armor
const body = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.2, 0.6),
  new THREE.MeshStandardMaterial({ color: '${modelColor}' })
);
body.position.y = 1.6;
robot.add(body);

// 3. Head & Details
const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), metalMat);
head.position.y = 2.5;
robot.add(head);

// 4. Arms & Legs
const arm = new THREE.BoxGeometry(0.2, 0.8, 0.2);
const leftArm = new THREE.Mesh(arm, mainMat);
leftArm.position.set(-0.7, 1.8, 0);
robot.add(leftArm);

// 5. Hierarchy
scene.add(robot);

// 6. Interactive Observation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Robot Customization">
            <ControlGroup label="Primary Color">
              <input type="color" value={modelColor} onChange={(e) => setModelColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Size" valueDisplay={scale.toFixed(1)}>
              <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Auto Sway">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Navigation">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Drag to rotate the view. Scroll to zoom. Use the color picker to re-paint the robot's main armor.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ModelLoadingLesson;
