import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function Materials() {
  const [materialType, setMaterialType] = useState('standard');
  const [color, setColor] = useState('#4ecdc4');
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.5);
  
  const meshRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 15);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
      
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = createMaterial('standard', color, roughness, metalness);
      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);
    },
    onAnimate: () => {
      if (meshRef.current) meshRef.current.rotation.y += 0.005;
    }
  });

  const createMaterial = (type, c, r, m) => {
    switch(type) {
      case 'basic': return new THREE.MeshBasicMaterial({ color: c });
      case 'lambert': return new THREE.MeshLambertMaterial({ color: c });
      case 'phong': return new THREE.MeshPhongMaterial({ color: c, shininess: 100, specular: 0x444444 });
      default: return new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    }
  };

  useEffect(() => {
    if (meshRef.current) {
      const oldMat = meshRef.current.material;
      meshRef.current.material = createMaterial(materialType, color, roughness, metalness);
      oldMat.dispose();
    }
  }, [materialType]);

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material;
      if (mat.color) mat.color.set(color);
      if (materialType === 'standard') {
        mat.roughness = roughness;
        mat.metalness = metalness;
      }
    }
  }, [color, roughness, metalness]);

  const codeSnippet = `// Material Comparison
let material;
switch('${materialType}') {
  case 'basic': 
    material = new THREE.MeshBasicMaterial({ color: '${color}' });
    break;
  case 'phong':
    material = new THREE.MeshPhongMaterial({ color: '${color}', shininess: 100 });
    break;
  case 'standard':
    material = new THREE.MeshStandardMaterial({ 
      color: '${color}', 
      roughness: ${roughness}, 
      metalness: ${metalness} 
    });
    break;
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Material Type">
            <ControlGroup label="Type">
              <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} style={{ width: '100%', padding: '8px', background: '#1a1a2e', color: '#eee' }}>
                <option value="standard">Standard (PBR)</option>
                <option value="phong">Phong (Shiny)</option>
                <option value="lambert">Lambert (Matte)</option>
                <option value="basic">Basic (Flat)</option>
              </select>
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Properties">
            <ControlGroup label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
            {materialType === 'standard' && (
              <>
                <ControlGroup label="Roughness" valueDisplay={roughness.toFixed(2)}>
                  <input type="range" min="0" max="1" step="0.01" value={roughness} onChange={(e) => setRoughness(parseFloat(e.target.value))} />
                </ControlGroup>
                <ControlGroup label="Metalness" valueDisplay={metalness.toFixed(2)}>
                  <input type="range" min="0" max="1" step="0.01" value={metalness} onChange={(e) => setMetalness(parseFloat(e.target.value))} />
                </ControlGroup>
              </>
            )}
          </ControlPanel>
        </>
      }
    />
  );
}

export default Materials;
