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
  'Ring': () => new THREE.RingGeometry(0.5, 1, 32),
  'Circle': () => new THREE.CircleGeometry(1, 32),
  'Plane': () => new THREE.PlaneGeometry(1.5, 1.5),
  'Torus (Thin)': () => new THREE.TorusGeometry(1, 0.05, 16, 100),
};

function GeometriesGallery() {
  const [selectedType, setSelectedType] = useState('TorusKnot');
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState('#4ecdc4');
  const [autoRotate, setAutoRotate] = useState(true);

  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(-5, 5, -5);
      scene.add(directionalLight);

      updateGeometry(scene);
    },
    onAnimate: () => {
      if (autoRotate && meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const updateGeometry = (targetScene) => {
    if (!targetScene) return;

    if (meshRef.current) {
      meshRef.current.geometry.dispose();
      meshRef.current.material.dispose();
      targetScene.remove(meshRef.current);
    }

    const geometry = GEOMETRY_TYPES[selectedType]();
    const material = new THREE.MeshStandardMaterial({ 
      color, 
      wireframe,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    targetScene.add(mesh);
  };

  useEffect(() => {
    if (isReady && scene) {
      updateGeometry(scene);
    }
  }, [selectedType, isReady, scene]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color);
      meshRef.current.material.wireframe = wireframe;
    }
  }, [color, wireframe]);

  const codeSnippet = `// Current Geometry: ${selectedType}
const geometry = new THREE.${selectedType.split(' ')[0]}Geometry(...)
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
          <ControlPanel title="Select Geometry">
            <ControlGroup label="Type">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: '100%', padding: '8px', background: '#1a1a2e', color: '#eee', border: '1px solid #333', borderRadius: '4px' }}
              >
                {Object.keys(GEOMETRY_TYPES).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
            <ControlGroup label="Auto Rotate">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            </ControlGroup>
          </ControlPanel>

          <ControlPanel title="Summary">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Three.js provides many built-in geometries. Each can be customized with various parameters during construction.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default GeometriesGallery;
