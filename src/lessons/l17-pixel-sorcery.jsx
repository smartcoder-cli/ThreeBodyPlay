import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ShadersLesson() {
  const [color1, setColor1] = useState('#ff6b6b');
  const [color2, setColor2] = useState('#4ecdc4');
  const [time, setTime] = useState(0);
  
  const materialRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const vertexShader = `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      
      const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vPosition;
        void main() {
          vec3 color = mix(uColor1, uColor2, sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `;
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
      });
      materialRef.current = material;
      
      const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.3, 128, 32), material);
      scene.add(mesh);
    },
    onAnimate: () => {
      if (materialRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        materialRef.current.uniforms.uTime.value = elapsed;
        setTime(elapsed);
      }
    }
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor1.value.set(color1);
      materialRef.current.uniforms.uColor2.value.set(color2);
    }
  }, [color1, color2]);

  const codeSnippet = `// 1. Vertex Shader (Passes position to Fragment)
const vertexShader = \`
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
\`;

// 2. Fragment Shader (The Visual Magic)
const fragmentShader = \`
  uniform float uTime;
  uniform vec3 uColor1;
  void main() {
    // Dynamic color mixing based on Y and Time
    float wave = sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5;
    gl_FragColor = vec4(mix(uColor1, vec3(1.0), wave), 1.0);
  }
\`;

// 3. Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('${color1}') }
  },
  vertexShader,
  fragmentShader
});`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Shader Colors">
            <ControlGroup label="Color 1">
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Color 2">
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Info">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>Time: {time.toFixed(2)}s</p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ShadersLesson;
