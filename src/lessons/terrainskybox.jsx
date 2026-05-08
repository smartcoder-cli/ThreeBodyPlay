import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function TerrainSkyboxLesson() {
  const [terrainColor, setTerrainColor] = useState('#3a5f0b');
  const [wireframe, setWireframe] = useState(false);
  
  const terrainRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene, camera }) => {
      // Sky
      const skyGeo = new THREE.SphereGeometry(500, 32, 32);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x0077ff) },
          bottomColor: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
          }
        `
      });
      scene.add(new THREE.Mesh(skyGeo, skyMat));

      // Terrain
      const terrainGeo = new THREE.PlaneGeometry(50, 50, 64, 64);
      const pos = terrainGeo.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 2] = Math.sin(pos[i] * 0.2) * Math.cos(pos[i+1] * 0.2) * 3 + Math.random() * 0.5;
      }
      terrainGeo.computeVertexNormals();

      const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ color: terrainColor, wireframe }));
      terrain.rotation.x = -Math.PI / 2;
      terrainRef.current = terrain;
      scene.add(terrain);

      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const sun = new THREE.DirectionalLight(0xffffff, 1); sun.position.set(10, 20, 10); scene.add(sun);
    },
    onAnimate: ({ camera }) => {
      camera.position.x = Math.cos(Date.now() * 0.0005) * 15;
      camera.position.z = Math.sin(Date.now() * 0.0005) * 15;
      camera.lookAt(0, 0, 0);
    }
  });

  useEffect(() => {
    if (terrainRef.current) {
      terrainRef.current.material.color.set(terrainColor);
      terrainRef.current.material.wireframe = wireframe;
    }
  }, [terrainColor, wireframe]);

  const codeSnippet = `// Procedural height
pos[i+2] = Math.sin(x*0.2) * Math.cos(y*0.2) * 3`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Terrain">
            <ControlGroup label="Color">
              <input type="color" value={terrainColor} onChange={(e) => setTerrainColor(e.target.value)} />
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

export default TerrainSkyboxLesson;
