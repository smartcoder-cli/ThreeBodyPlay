import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function AdvancedFogLesson() {
  const [fogDensity, setFogDensity] = useState(0.05);
  const [fogColor, setFogColor] = useState('#ffffff');
  const [autoMove, setAutoMove] = useState(true);

  const { containerRef, canvasRef, isReady, scene, camera } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(fogColor);
      scene.fog = new THREE.FogExp2(fogColor, fogDensity);

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      
      // Create an infinite-like corridor of boxes
      for (let i = 0; i < 100; i++) {
        const material = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5) 
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          -i * 2.5
        );
        mesh.rotation.set(Math.random(), Math.random(), 0);
        scene.add(mesh);
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.2));
      const light = new THREE.PointLight(0xffffff, 20, 50);
      light.position.set(0, 0, 5);
      scene.add(light);
    },
    onAnimate: ({ clock, camera }) => {
      if (autoMove && camera) {
        // Move camera forward infinitely (resetting position)
        camera.position.z = 5 - (clock.getElapsedTime() % 20) * 2;
      }
    }
  });

  useEffect(() => {
    if (scene) {
      scene.background.set(fogColor);
      if (scene.fog) {
        scene.fog.color.set(fogColor);
        scene.fog.density = fogDensity;
      }
    }
  }, [fogColor, fogDensity, scene]);

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      sidebar={
        <>
          <ControlPanel title="Atmosphere">
            <ControlGroup label="Density" valueDisplay={fogDensity.toFixed(3)}>
              <input type="range" min="0" max="0.3" step="0.005" value={fogDensity} onChange={(e) => setFogDensity(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Color">
              <input type="color" value={fogColor} onChange={(e) => setFogColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Camera Move">
              <input type="checkbox" checked={autoMove} onChange={(e) => setAutoMove(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Depth Effect">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Exp2 Fog is more realistic than linear fog. It grows exponentially thicker with distance. Adjust the color to match the background for a seamless horizon.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default AdvancedFogLesson;
