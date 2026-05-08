import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function AudioVideoLesson() {
  const [color, setColor] = useState('#4ecdc4');
  const [particleSize, setParticleSize] = useState(0.1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const particlesRef = useRef(null);
  const velocitiesRef = useRef([]);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ THREE, scene }) => {
      scene.background = new THREE.Color(0x1a1a2e);
      
      const count = 500;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        velocitiesRef.current.push({
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01
        });
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: particleSize,
        transparent: true,
        opacity: 0.8
      });

      const particles = new THREE.Points(geometry, material);
      particlesRef.current = particles;
      scene.add(particles);
    },
    onAnimate: () => {
      if (!particlesRef.current) return;

      const positions = particlesRef.current.geometry.attributes.position.array;
      let level = 0;

      if (audioEnabled && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        level = (dataArray.reduce((a, b) => a + b) / dataArray.length) / 255;
        setAudioLevel(level);
      }

      const audioScale = 1 + level * 3;
      for (let i = 0; i < 500; i++) {
        positions[i * 3] += velocitiesRef.current[i].x * audioScale;
        positions[i * 3 + 1] += velocitiesRef.current[i].y * audioScale;
        positions[i * 3 + 2] += velocitiesRef.current[i].z * audioScale;

        if (Math.abs(positions[i * 3]) > 5) velocitiesRef.current[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 5) velocitiesRef.current[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 2.5) velocitiesRef.current[i].z *= -1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.material.size = particleSize * audioScale;
      particlesRef.current.rotation.y += 0.001;
    }
  });

  const handleEnableAudio = async () => {
    if (!audioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        ctx.createMediaStreamSource(stream).connect(analyser);
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        audioContextRef.current = ctx;
        setAudioEnabled(true);
      } catch (err) {
        alert('Mic access denied');
      }
    } else {
      if (audioContextRef.current) audioContextRef.current.close();
      setAudioEnabled(false);
      setAudioLevel(0);
    }
  };

  useEffect(() => {
    if (particlesRef.current) particlesRef.current.material.color.set(color);
  }, [color]);

  const codeSnippet = `// 1. Audio Visualization
const analyser = audioContext.createAnalyser()
analyser.getByteFrequencyData(dataArray)
const level = average(dataArray) / 255
mesh.scale.setScalar(1 + level * 2)

// 2. Video Texture (Alternative)
const video = document.getElementById('video')
const videoTexture = new THREE.VideoTexture(video)
const material = new THREE.MeshBasicMaterial({ map: videoTexture })`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Visuals">
            <ControlGroup label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Size" valueDisplay={particleSize.toFixed(2)}>
              <input type="range" min="0.02" max="0.3" step="0.01" value={particleSize} onChange={(e) => setParticleSize(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Audio">
            <button onClick={handleEnableAudio} style={{ width: '100%', padding: '10px', background: audioEnabled ? '#ff6b6b' : '#4ecdc4', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold' }}>
              {audioEnabled ? 'Disable Mic' : 'Enable Mic'}
            </button>
            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '10px' }}>
              Level: {(audioLevel * 100).toFixed(0)}%
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default AudioVideoLesson;
