import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function Lighting() {
  const [lightType, setLightType] = useState('point');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [intensity, setIntensity] = useState(1);
  
  const lightsRef = useRef({});
  const meshRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene, renderer }) => {
      scene.background = new THREE.Color(0x050510);
      renderer.shadowMap.enabled = true;
      
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.5;
      ground.receiveShadow = true;
      scene.add(ground);
      
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      sphere.castShadow = true;
      meshRef.current = sphere;
      scene.add(sphere);
      
      // Pre-create all lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);
      lightsRef.current.ambient = ambient;

      const point = new THREE.PointLight(0xffffff, 50, 100);
      point.position.set(3, 5, 3);
      point.castShadow = true;
      scene.add(point);
      lightsRef.current.point = point;

      const directional = new THREE.DirectionalLight(0xffffff, 5);
      directional.position.set(5, 10, 5);
      directional.castShadow = true;
      scene.add(directional);
      lightsRef.current.directional = directional;

      const spot = new THREE.SpotLight(0xffffff, 100, 100, Math.PI / 4, 0.3);
      spot.position.set(3, 8, 3);
      spot.castShadow = true;
      scene.add(spot);
      lightsRef.current.spot = spot;

      // Set initial visibility
      Object.keys(lightsRef.current).forEach(key => {
        lightsRef.current[key].visible = (key === 'point');
      });
    },
    onAnimate: () => {
      if (meshRef.current) meshRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (isReady && lightsRef.current) {
      Object.keys(lightsRef.current).forEach(key => {
        const light = lightsRef.current[key];
        light.visible = (key === lightType);
        light.color.set(lightColor);
        
        // Intensity scaling for different types
        if (key === 'ambient') light.intensity = intensity;
        else if (key === 'directional') light.intensity = intensity * 5;
        else light.intensity = intensity * 100; // Point and Spot need high intensity in SI
      });
    }
  }, [lightType, lightColor, intensity, isReady]);

  const codeSnippet = `// Dynamic Lighting
const light = new THREE.${lightType.charAt(0).toUpperCase() + lightType.slice(1)}Light('${lightColor}', ${intensity});

${lightType !== 'ambient' ? `light.position.set(3, 5, 3);
light.castShadow = true; // Enable Shadows` : ''}

scene.add(light);

// Renderer setup for shadows
renderer.shadowMap.enabled = true;`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Light Source">
            <ControlGroup label="Type">
              <select value={lightType} onChange={(e) => setLightType(e.target.value)} style={{ width: '100%', padding: '8px', background: '#1a1a2e', color: '#eee' }}>
                <option value="point">Point Light</option>
                <option value="directional">Directional</option>
                <option value="spot">Spot Light</option>
                <option value="ambient">Ambient</option>
              </select>
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Settings">
            <ControlGroup label="Color">
              <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Intensity" valueDisplay={intensity.toFixed(1)}>
              <input type="range" min="0" max="10" step="0.1" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default Lighting;
