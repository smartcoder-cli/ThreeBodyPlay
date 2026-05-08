import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Custom hook to manage Three.js lifecycle
 * @param {Object} options 
 * @param {Function} options.onInit - Callback after Three.js is initialized
 * @param {Function} options.onAnimate - Callback called every frame
 */
export function useThree({ onInit, onAnimate } = {}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Use refs to store latest callbacks to avoid stale closures
  const onInitRef = useRef(onInit);
  const onAnimateRef = useRef(onAnimate);

  useEffect(() => {
    onInitRef.current = onInit;
  }, [onInit]);

  useEffect(() => {
    onAnimateRef.current = onAnimate;
  }, [onAnimate]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Modern Three.js Color & Tone Management
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    rendererRef.current = renderer;

    // Initialize callback
    if (onInitRef.current) {
      onInitRef.current({
        THREE,
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current,
        container: containerRef.current
      });
    }

    setIsReady(true);

    const clock = new THREE.Clock();

    // Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (onAnimateRef.current) {
        onAnimateRef.current({
          THREE,
          scene: sceneRef.current,
          camera: cameraRef.current,
          renderer: rendererRef.current,
          clock
        });
      }
      renderer.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Dispose resources
      while(sceneRef.current.children.length > 0){ 
        sceneRef.current.remove(sceneRef.current.children[0]); 
      }
      
      sceneRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      setIsReady(false);
    };
  }, []);

  return {
    containerRef,
    canvasRef,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    isReady
  };
}
