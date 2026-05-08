import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function EnvironmentMapLesson() {
  const [blur, setBlur] = useState(0);
  const [intensity, setIntensity] = useState(1);
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene, renderer } = useThree({
    onInit: ({ scene, renderer }) => {
      // Create a procedural environment using PMREMGenerator
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      // Create a fancy procedural background
      const data = new Uint8Array(4);
      data.set([25, 25, 46, 255]); // Dark navy
      const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
      tex.needsUpdate = true;

      scene.background = new THREE.Color(0x1a1a2e);
      
      // Let's create some shiny objects to reflect
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 256, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0,
        envMapIntensity: intensity
      });

      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      // Add lights to make it pop
      const light = new THREE.PointLight(0xffffff, 10);
      light.position.set(5, 5, 5);
      scene.add(light);
      
      // Attempt to load a real env map, but provide fallback logic
      const loader = new THREE.CubeTextureLoader();
      loader.setPath('https://threejs.org/examples/textures/cube/Park2/');
      loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'], 
        (texture) => {
          scene.background = texture;
          scene.environment = texture;
        },
        undefined,
        () => {
          console.warn('CDN EnvMap failed, using procedural fallback');
          scene.background = new THREE.Color(0x1a1a2e);
        }
      );
    },
    onAnimate: ({ clock }) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
        meshRef.current.rotation.z = clock.getElapsedTime() * 0.3;
      }
    }
  });

  useEffect(() => {
    if (scene) {
      scene.backgroundBlurriness = blur;
      if (meshRef.current) {
        meshRef.current.material.envMapIntensity = intensity;
      }
    }
  }, [blur, intensity, scene]);

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      sidebar={
        <>
          <ControlPanel title="Environment Settings">
            <ControlGroup label="BG Blur" valueDisplay={blur.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.01" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Reflect Intensity" valueDisplay={intensity.toFixed(1)}>
              <input type="range" min="0" max="5" step="0.1" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Observation">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Environment maps (EnvMaps) provide 360-degree lighting and reflections. High metalness + low roughness makes the object look like a mirror.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default EnvironmentMapLesson;
