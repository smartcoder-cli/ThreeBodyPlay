import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ResponsiveDesignLesson() {
  const [color, setColor] = useState('#4ecdc4');
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const controlsRef = useRef(null);
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene, camera, renderer, container }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      camera.position.z = 5;
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;

      const group = new THREE.Group();
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.3 })
      );
      sphere.name = 'main';
      group.add(sphere);

      for (let i = 0; i < 6; i++) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0xff6b6b }));
        cube.userData = { orbitRadius: 2, orbitSpeed: 0.5 + i * 0.1, orbitIdx: i };
        group.add(cube);
      }
      meshRef.current = group;
      scene.add(group);
      scene.add(new THREE.GridHelper(30, 30, 0x333333, 0x222222));
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      const updateSize = () => setViewportSize({ width: container.clientWidth, height: container.clientHeight });
      window.addEventListener('resize', updateSize);
      updateSize();
    },
    onAnimate: () => {
      if (controlsRef.current) controlsRef.current.update();
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.children.forEach(child => {
          if (child.userData.orbitIdx !== undefined) {
            const angle = Date.now() * 0.001 * child.userData.orbitSpeed;
            child.position.set(Math.cos(angle) * 2, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2);
          }
        });
      }
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      const main = meshRef.current.getObjectByName('main');
      if (main) main.material.color.set(color);
    }
  }, [color]);

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      sidebar={
        <>
          <ControlPanel title="Responsive">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Size: {viewportSize.width}x{viewportSize.height}
            </p>
            <ControlGroup label="Sphere Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ResponsiveDesignLesson;
