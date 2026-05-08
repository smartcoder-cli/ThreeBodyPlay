import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function Geometries() {
  const [geometryType, setGeometryType] = useState('box');
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState('#4ecdc4');
  
  const meshRef = useRef(null);
  
  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
      
      updateMesh(scene);
    },
    onAnimate: () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const updateMesh = (targetScene) => {
    if (meshRef.current) {
      meshRef.current.geometry.dispose();
      meshRef.current.material.dispose();
      targetScene.remove(meshRef.current);
    }

    let geom;
    switch(geometryType) {
      case 'sphere': geom = new THREE.SphereGeometry(1.5, 32, 32); break;
      case 'cylinder': geom = new THREE.CylinderGeometry(1, 1, 2, 32); break;
      case 'cone': geom = new THREE.ConeGeometry(1, 2, 32); break;
      case 'torus': geom = new THREE.TorusGeometry(1, 0.4, 16, 100); break;
      default: geom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }

    const mat = new THREE.MeshStandardMaterial({ color, wireframe });
    const mesh = new THREE.Mesh(geom, mat);
    meshRef.current = mesh;
    targetScene.add(mesh);
  };

  useEffect(() => {
    if (isReady && scene) {
      updateMesh(scene);
    }
  }, [geometryType, isReady, scene]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color);
      meshRef.current.material.wireframe = wireframe;
    }
  }, [color, wireframe]);

  const codeSnippet = `const geometry = new THREE.${geometryType.charAt(0).toUpperCase() + geometryType.slice(1)}Geometry(...)
const material = new THREE.MeshStandardMaterial({ 
  color: '${color}', 
  wireframe: ${wireframe} 
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Geometry">
            <ControlGroup label="Shape">
              <select value={geometryType} onChange={(e) => setGeometryType(e.target.value)}>
                <option value="box">Box</option>
                <option value="sphere">Sphere</option>
                <option value="cylinder">Cylinder</option>
                <option value="cone">Cone</option>
                <option value="torus">Torus</option>
              </select>
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Material">
            <ControlGroup label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Wireframe">
              <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default Geometries;
