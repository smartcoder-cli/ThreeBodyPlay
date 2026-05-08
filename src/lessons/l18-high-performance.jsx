import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function PerformanceLesson() {
  const [objectCount, setObjectCount] = useState(100);
  const [fps, setFps] = useState(60);
  
  const meshesRef = useRef([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene, camera }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      camera.position.z = 30;
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      updateObjects(scene, objectCount);
    },
    onAnimate: () => {
      meshesRef.current.forEach((mesh, i) => {
        mesh.rotation.x += 0.01 * (i % 3 + 1);
        mesh.rotation.y += 0.02 * (i % 3 + 1);
      });

      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    }
  });

  const updateObjects = (targetScene, count) => {
    meshesRef.current.forEach(m => targetScene.remove(m));
    meshesRef.current = [];

    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
      targetScene.add(mesh);
      meshesRef.current.push(mesh);
    }
  };

  useEffect(() => {
    if (isReady && scene) updateObjects(scene, objectCount);
  }, [objectCount, isReady, scene]);

  const codeSnippet = `// Optimization: InstancedMesh
const mesh = new THREE.InstancedMesh(geometry, material, count)
for(let i=0; i<count; i++) {
  mesh.setMatrixAt(i, matrix)
}
scene.add(mesh)`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Stress Test">
            <ControlGroup label="Object Count" valueDisplay={objectCount}>
              <input type="range" min="10" max="1000" step="10" value={objectCount} onChange={(e) => setObjectCount(parseInt(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Performance">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: fps < 30 ? '#ff6b6b' : '#4ecdc4' }}>
              {fps} FPS
            </div>
          </ControlPanel>
        </>
      }
    />
  );
}

export default PerformanceLesson;
