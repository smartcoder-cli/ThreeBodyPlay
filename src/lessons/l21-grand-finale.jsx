import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function GrandFinale() {
  const [powerLevel, setPowerLevel] = useState(1.0);
  const [coreColor, setCoreColor] = useState('#4ecdc4');
  const [showParticles, setShowGrid] = useState(true);
  
  const coreRef = useRef(null);
  const ringsRef = useRef([]);
  const particlesRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const controlsRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene, camera, renderer } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      // 1. Atmosphere & Background
      scene.background = new THREE.Color(0x020205);
      scene.fog = new THREE.FogExp2(0x020205, 0.05);
      camera.position.set(0, 5, 12);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controlsRef.current = controls;

      // 2. Central Energy Core
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      const coreGeo = new THREE.IcosahedronGeometry(1, 15);
      const coreMat = new THREE.MeshStandardMaterial({
        color: coreColor,
        emissive: coreColor,
        emissiveIntensity: 2,
        roughness: 0,
        metalness: 1,
        wireframe: true
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      coreRef.current = core;
      coreGroup.add(core);

      // Inner glowing core
      const innerCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      coreGroup.add(innerCore);

      // 3. Nested Power Rings
      const ringGeos = [
        new THREE.TorusGeometry(2, 0.05, 16, 100),
        new THREE.TorusGeometry(2.5, 0.03, 16, 100),
        new THREE.TorusGeometry(3.2, 0.08, 16, 100)
      ];
      
      ringsRef.current = [];
      ringGeos.forEach((geo, i) => {
        const mat = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          metalness: 1, 
          roughness: 0.2,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        scene.add(ring);
        ringsRef.current.push({
          mesh: ring,
          speed: (i + 1) * 0.5
        });
      });

      // 4. Starfield Particles
      const starGeo = new THREE.BufferGeometry();
      const starCount = 5000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 50;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 });
      const stars = new THREE.Points(starGeo, starMat);
      particlesRef.current = stars;
      scene.add(stars);

      // 5. Lights
      const pLight = new THREE.PointLight(coreColor, 10, 20);
      scene.add(pLight);
      scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    },
    onAnimate: ({ clock }) => {
      const time = clock.getElapsedTime();
      if (controlsRef.current) controlsRef.current.update();

      // Animate Core
      if (coreRef.current) {
        coreRef.current.rotation.y = time * 0.2;
        coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05 * powerLevel);
        coreRef.current.material.emissiveIntensity = (1 + Math.sin(time * 4)) * powerLevel;
      }

      // Animate Rings
      ringsRef.current.forEach((item, i) => {
        item.mesh.rotation.x += 0.001 * item.speed * powerLevel;
        item.mesh.rotation.y += 0.002 * item.speed * powerLevel;
        item.mesh.scale.setScalar(1 + Math.sin(time + i) * 0.02);
      });

      // Animate Stars
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.02;
      }
    }
  });

  useEffect(() => {
    if (coreRef.current) {
      coreRef.current.material.color.set(coreColor);
      coreRef.current.material.emissive.set(coreColor);
    }
  }, [coreColor]);

  const codeSnippet = `// 1. Atmosphere (Exp Fog)
scene.fog = new THREE.FogExp2(0x020205, 0.05);

// 2. The Station Core
const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 15),
  new THREE.MeshStandardMaterial({ 
    color: '${coreColor}', 
    emissive: '${coreColor}',
    emissiveIntensity: ${powerLevel}
  })
);

// 3. Galactic Ring System
const rings = new THREE.Group();
[2, 2.5, 3.2].forEach(radius => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.05),
    material
  );
  rings.add(ring);
});
scene.add(rings);

// 4. Starfield (Points)
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// 5. Update Loop
function animate(time) {
  core.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
  rings.rotation.x += 0.001;
  stars.rotation.y += 0.0001;
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Core Energy">
            <ControlGroup label="Power Output" valueDisplay={powerLevel.toFixed(1)}>
              <input type="range" min="0" max="5" step="0.1" value={powerLevel} onChange={(e) => setPowerLevel(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Energy Color">
              <input type="color" value={coreColor} onChange={(e) => setCoreColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
          
          <ControlPanel title="Station Status">
            <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontSize: '0.8rem' }}>
              <p>● Status: <span style={{ color: powerLevel > 3 ? '#ff6b6b' : '#00ff88' }}>{powerLevel > 3 ? 'OVERLOAD' : 'STABLE'}</span></p>
              <p>● Particles: {5000}</p>
              <p>● Systems: ONLINE</p>
            </div>
          </ControlPanel>

          <ControlPanel title="The Grand Finale">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              This project combines Scene Graph hierarchy, BufferGeometry particles, PBR materials with emissive lighting, and smooth animation loops. You have mastered the fundamentals of Three.js!
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default GrandFinale;
