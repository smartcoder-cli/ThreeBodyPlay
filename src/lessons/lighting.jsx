import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function Lighting() {
  const [lightType, setLightType] = useState('point');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [intensity, setIntensity] = useState(1);
  
  const lightRef = useRef(null);
  const meshRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene, renderer }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      const groundGeo = new THREE.PlaneGeometry(10, 10);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1;
      ground.receiveShadow = true;
      scene.add(ground);
      
      const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const cubeMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.y = 0.5;
      cube.castShadow = true;
      meshRef.current = cube;
      scene.add(cube);
      
      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);
      
      updateLight(scene);
    },
    onAnimate: () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const updateLight = (targetScene) => {
    if (lightRef.current) {
      targetScene.remove(lightRef.current);
      lightRef.current.dispose();
    }

    let light;
    switch(lightType) {
      case 'ambient': light = new THREE.AmbientLight(lightColor, intensity); break;
      case 'directional': 
        light = new THREE.DirectionalLight(lightColor, intensity); 
        light.position.set(5, 10, 7.5);
        light.castShadow = true;
        break;
      case 'spot':
        light = new THREE.SpotLight(lightColor, intensity);
        light.position.set(3, 5, 3);
        light.angle = Math.PI / 4;
        light.penumbra = 0.3;
        light.castShadow = true;
        break;
      default: // point
        light = new THREE.PointLight(lightColor, intensity);
        light.position.set(3, 5, 3);
        light.castShadow = true;
    }
    lightRef.current = light;
    targetScene.add(light);
  };

  useEffect(() => {
    if (isReady && scene) {
      updateLight(scene);
    }
  }, [lightType, isReady, scene]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.color.set(lightColor);
      lightRef.current.intensity = intensity;
    }
  }, [lightColor, intensity]);

  const codeSnippet = `const light = new THREE.${lightType.charAt(0).toUpperCase() + lightType.slice(1)}Light('${lightColor}', ${intensity})
${lightType !== 'ambient' ? 'light.position.set(3, 5, 3)\nlight.castShadow = true' : ''}
scene.add(light)`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Light Type">
            <ControlGroup label="Type">
              <select value={lightType} onChange={(e) => setLightType(e.target.value)}>
                <option value="point">Point Light</option>
                <option value="directional">Directional Light</option>
                <option value="spot">Spot Light</option>
                <option value="ambient">Ambient Light</option>
              </select>
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Settings">
            <ControlGroup label="Color">
              <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Intensity" valueDisplay={intensity.toFixed(1)}>
              <input type="range" min="0" max="3" step="0.1" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default Lighting;
