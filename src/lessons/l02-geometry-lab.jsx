import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

const GEOMETRY_TYPES = {
  'Box': () => new THREE.BoxGeometry(1, 1, 1),
  'Sphere': () => new THREE.SphereGeometry(0.8, 32, 32),
  'Cylinder': () => new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
  'Cone': () => new THREE.ConeGeometry(0.8, 1.5, 32),
  'Torus': () => new THREE.TorusGeometry(0.8, 0.3, 16, 100),
  'TorusKnot': () => new THREE.TorusKnotGeometry(0.7, 0.25, 128, 32),
  'Dodecahedron': () => new THREE.DodecahedronGeometry(1),
  'Octahedron': () => new THREE.OctahedronGeometry(1),
  'Tetrahedron': () => new THREE.TetrahedronGeometry(1),
  'Icosahedron': () => new THREE.IcosahedronGeometry(1),
  'Capsule': () => new THREE.CapsuleGeometry(0.5, 1, 4, 16),
  'Torus (Thin)': () => new THREE.TorusGeometry(1, 0.05, 16, 100),
};

function GeometryLab() {
  const [selectedType, setSelectedType] = useState('Box');
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState('#4ecdc4');
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const pl = new THREE.PointLight(0xffffff, 1);
      pl.position.set(5, 5, 5);
      scene.add(pl);
      updateGeometry(scene);
    },
    onAnimate: () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const updateGeometry = (targetScene) => {
    if (!targetScene) return;
    if (meshRef.current) {
      meshRef.current.geometry.dispose();
      targetScene.remove(meshRef.current);
    }
    const geometry = GEOMETRY_TYPES[selectedType]();
    const material = new THREE.MeshStandardMaterial({ color, wireframe });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    targetScene.add(mesh);
  };

  useEffect(() => {
    if (isReady && scene) updateGeometry(scene);
  }, [selectedType, isReady, scene]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color);
      meshRef.current.material.wireframe = wireframe;
    }
  }, [color, wireframe]);

  const codeSnippet = `// Select Geometry
const geometry = new THREE.${selectedType.split(' ')[0]}Geometry();

// Create Material
const material = new THREE.MeshStandardMaterial({ 
  color: '${color}', 
  wireframe: ${wireframe} 
});

// Create Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Shape Selection">
            <ControlGroup label="Type">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: '100%', padding: '8px', background: '#1a1a2e', color: '#eee' }}>
                {Object.keys(GEOMETRY_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Appearance">
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

export default GeometryLab;
