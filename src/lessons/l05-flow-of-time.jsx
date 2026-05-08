import React, { useState, useRef, useEffect } from 'react';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function AnimationLesson() {
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [scale, setScale] = useState(1);
  const [bounce, setBounce] = useState(true);
  const [color, setColor] = useState('#4ecdc4');
  
  const meshRef = useRef(null);
  
  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
    },
    onAnimate: ({ clock }) => {
      const time = clock.getElapsedTime();
      if (meshRef.current) {
        meshRef.current.rotation.x += rotationSpeed;
        meshRef.current.rotation.y += rotationSpeed;
        
        if (bounce) {
          meshRef.current.position.y = Math.sin(time * 3) * 0.5;
        } else {
          meshRef.current.position.y = 0;
        }
      }
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color);
      meshRef.current.scale.set(scale, scale, scale);
    }
  }, [color, scale]);

  const codeSnippet = `function animate() {
  requestAnimationFrame(animate)
  mesh.rotation.x += ${rotationSpeed}
  mesh.rotation.y += ${rotationSpeed}
  
  ${bounce ? 'mesh.position.y = Math.sin(Date.now() * 0.003) * 0.5' : 'mesh.position.y = 0'}
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Animation">
            <ControlGroup label="Rotation Speed" valueDisplay={rotationSpeed.toFixed(3)}>
              <input type="range" min="0" max="0.1" step="0.001" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Scale" valueDisplay={scale.toFixed(2)}>
              <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Bounce Animation">
              <input type="checkbox" checked={bounce} onChange={(e) => setBounce(e.target.checked)} />
            </ControlGroup>
            <ControlGroup label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
        </>
      }
    />
  );
}

export default AnimationLesson;
