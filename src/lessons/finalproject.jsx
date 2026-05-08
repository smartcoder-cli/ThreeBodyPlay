import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function FinalProject() {
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [color1, setColor1] = useState('#4ecdc4');
  const [color2, setColor2] = useState('#ff6b6b');

  const controlsRef = useRef(null);
  const groupRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      camera.position.z = 8;
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      const group = new THREE.Group();
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: color1, metalness: 0.5, roughness: 0.3 })
      ));

      for (let i = 0; i < 6; i++) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: color2 }));
        cube.userData = { orbitAngle: i * Math.PI / 3 };
        group.add(cube);
      }

      const pCount = 100;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const a = (i / pCount) * Math.PI * 2;
        pPos[i*3] = Math.cos(a) * 4; pPos[i*3+1] = (Math.random()-0.5)*0.5; pPos[i*3+2] = Math.sin(a) * 4;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })));

      groupRef.current = group;
      scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const pl = new THREE.PointLight(0xffffff, 1); pl.position.set(5, 5, 5); scene.add(pl);
    },
    onAnimate: () => {
      if (controlsRef.current) controlsRef.current.update();
      if (groupRef.current) {
        groupRef.current.rotation.y += rotationSpeed * 0.01;
        groupRef.current.children.forEach((child, i) => {
          if (i > 0 && i <= 6) {
            child.userData.orbitAngle += rotationSpeed * 0.02;
            child.position.set(Math.cos(child.userData.orbitAngle)*3, 0, Math.sin(child.userData.orbitAngle)*3);
          }
        });
      }
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children[0].material.color.set(color1);
      for(let i=1; i<=6; i++) groupRef.current.children[i].material.color.set(color2);
    }
  }, [color1, color2]);

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      sidebar={
        <>
          <ControlPanel title="Combined Scene">
            <ControlGroup label="Speed" valueDisplay={rotationSpeed.toFixed(1)}>
              <input type="range" min="0" max="2" step="0.1" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Colors">
            <ControlGroup label="Center"><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} /></ControlGroup>
            <ControlGroup label="Orbit"><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} /></ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default FinalProject;
