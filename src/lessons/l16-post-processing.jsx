import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function PostProcessingLesson() {
  const [blur, setBlur] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [color, setColor] = useState('#4ecdc4');
  
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const torusGeo = new THREE.TorusGeometry(1.5, 0.5, 32, 100);
      const torusMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      meshRef.current = torus;
      scene.add(torus);

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xff6b6b })
      );
      box.position.x = -3;
      scene.add(box);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xffd93d })
      );
      sphere.position.x = 3;
      scene.add(sphere);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
    },
    onAnimate: ({ scene }) => {
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.01;
        }
      });
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const blurValue = blur * 20;
      const saturateValue = 20 + saturation * 180;
      canvas.style.filter = `blur(${blurValue}px) saturate(${saturateValue}%)`;
    }
  }, [blur, saturation]);

  useEffect(() => {
    if (meshRef.current) meshRef.current.material.color.set(color);
  }, [color]);

  const codeSnippet = `// CSS-based Post-processing
canvas.style.filter = \`blur(\${blur * 20}px) saturate(\${20 + saturation * 180}%)\`

// For advanced effects in Three.js, use EffectComposer:
// const composer = new EffectComposer(renderer)
// composer.addPass(new RenderPass(scene, camera))
// composer.addPass(new UnrealBloomPass(...))`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="CSS Effects">
            <ControlGroup label="Blur" valueDisplay={blur.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.05" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Saturation" valueDisplay={saturation.toFixed(1)}>
              <input type="range" min="0" max="2" step="0.1" value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Scene">
            <ControlGroup label="Accent Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

// Added missing useRef import
import { useRef } from 'react';
export default PostProcessingLesson;
