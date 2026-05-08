import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function RaycastingLesson() {
  const [hoverColor, setHoverColor] = useState('#ff6b6b');
  const [selectColor, setSelectColor] = useState('#4ecdc4');
  const [lastSelected, setLastSelected] = useState('None');
  
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const objectsRef = useRef([]);
  const hoveredObject = useRef(null);

  const { containerRef, canvasRef, isReady, scene, camera } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      objectsRef.current = []; // Reset the list to avoid duplicates
      
      // Create some random objects
      const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.TorusGeometry(0.5, 0.2, 16, 100)
      ];

      for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x888888,
          metalness: 0.3,
          roughness: 0.4
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 6;
        mesh.position.y = (Math.random() - 0.5) * 4;
        mesh.position.z = (Math.random() - 0.5) * 4;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Add random rotation speed for each object
        mesh.userData.rotationSpeed = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02
        };
        
        mesh.userData.originalColor = 0x888888;
        mesh.userData.id = `Object ${i + 1}`;
        
        scene.add(mesh);
        objectsRef.current.push(mesh);
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 5);
      scene.add(directionalLight);
    },
    onAnimate: () => {
      // Rotate objects
      objectsRef.current.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
      });

      // Raycasting logic
      if (camera && objectsRef.current.length > 0) {
        raycaster.current.setFromCamera(mouse.current, camera);
        const intersects = raycaster.current.intersectObjects(objectsRef.current);

        // Reset previous hover
        if (hoveredObject.current) {
          hoveredObject.current.material.color.set(hoveredObject.current.userData.originalColor);
          hoveredObject.current = null;
        }

        if (intersects.length > 0) {
          const first = intersects[0].object;
          hoveredObject.current = first;
          first.material.color.set(hoverColor);
        }
      }
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      if (hoveredObject.current) {
        const obj = hoveredObject.current;
        obj.userData.originalColor = selectColor;
        obj.material.color.set(selectColor);
        setLastSelected(obj.userData.id);
        
        const originalScale = obj.scale.x;
        obj.scale.set(originalScale * 1.2, originalScale * 1.2, originalScale * 1.2);
        setTimeout(() => {
          if (obj && obj.scale) obj.scale.set(originalScale, originalScale, originalScale);
        }, 100);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
    };
  }, [selectColor, containerRef]);

  const codeSnippet = `// 1. Raycaster & Mouse setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 2. Track Mouse Movement
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 3. Update Loop
function animate() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const firstObj = intersects[0].object;
    firstObj.material.color.set('${hoverColor}');
  }
}

// 4. Interaction (Click)
window.addEventListener('click', () => {
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    intersects[0].object.scale.setScalar(1.2);
  }
});`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Interaction Settings">
            <ControlGroup label="Hover Color">
              <input type="color" value={hoverColor} onChange={(e) => setHoverColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Select Color">
              <input type="color" value={selectColor} onChange={(e) => setSelectColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Selection Info">
            <ControlGroup label="Last Selected">
              <div style={{ color: selectColor, fontWeight: 'bold' }}>{lastSelected}</div>
            </ControlGroup>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
              Hover over objects to see them highlight. Click to select and permanently change their color.
            </p>
          </ControlPanel>

          <ControlPanel title="How it works">
            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>
              Raycasting projects a 3D ray from the camera through the mouse coordinates. Any object intersecting this ray is detected.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default RaycastingLesson;
