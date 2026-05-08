import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ModelLoadingLesson() {
  const [modelColor, setModelColor] = useState('#4ecdc4');
  const [autoRotate, setAutoRotate] = useState(true);
  const [scale, setScale] = useState(1);
  
  const modelRef = useRef(null);
  
  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 5);
      scene.add(directionalLight);
      
      // Procedural robot model
      const group = new THREE.Group();
      
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1, 0.5),
        new THREE.MeshStandardMaterial({ color: modelColor, metalness: 0.3, roughness: 0.7 })
      );
      body.position.y = 0.5;
      body.name = 'body';
      group.add(body);
      
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 })
      );
      head.position.y = 1.2;
      group.add(head);
      
      const createEye = (x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        eye.position.set(x, 1.25, 0.2);
        return eye;
      };
      group.add(createEye(-0.12), createEye(0.12));
      
      modelRef.current = group;
      scene.add(group);
      scene.add(new THREE.GridHelper(10, 10, 0x333333, 0x222222));
    },
    onAnimate: () => {
      if (autoRotate && modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }
    }
  });

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.name === 'body') child.material.color.set(modelColor);
      });
      modelRef.current.scale.setScalar(scale);
    }
  }, [modelColor, scale]);

  const codeSnippet = `import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()
loader.load('model.glb', (gltf) => {
  scene.add(gltf.scene)
})`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Model Settings">
            <ControlGroup label="Body Color">
              <input type="color" value={modelColor} onChange={(e) => setModelColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Scale" valueDisplay={scale.toFixed(1)}>
              <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Info">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Procedural model used for demo. Use <strong>GLTFLoader</strong> for external assets.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ModelLoadingLesson;
