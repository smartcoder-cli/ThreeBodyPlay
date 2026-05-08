import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function PhysicsLesson() {
  const [gravity, setGravity] = useState(0.001);
  const [bounciness, setBounciness] = useState(0.8);
  const [ballColor, setBallColor] = useState('#ff6b6b');
  const [ballCount, setBallCount] = useState(1);
  
  const ballsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const GROUND_Y = -1.5;
  const BALL_RADIUS = 0.5;

  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene, camera, renderer }) => {
      scene.background = new THREE.Color(0x050508);
      camera.position.set(0, 4, 12);
      camera.lookAt(0, 0, 0);

      // 1. Better Ground: Metallic with Grid
      const groundGroup = new THREE.Group();
      const groundGeo = new THREE.PlaneGeometry(30, 30);
      const groundMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = GROUND_Y;
      ground.receiveShadow = true;
      groundGroup.add(ground);

      const grid = new THREE.GridHelper(30, 30, 0x4ecdc4, 0x222222);
      grid.position.y = GROUND_Y + 0.01;
      groundGroup.add(grid);
      scene.add(groundGroup);

      // 2. Enhanced Lighting
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene.add(new THREE.AmbientLight(0xffffff, 0.2));
      
      const mainLight = new THREE.DirectionalLight(0xffffff, 3);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      scene.add(mainLight);

      const fillLight = new THREE.PointLight(0xff6b6b, 10);
      fillLight.position.set(-5, 2, 2);
      scene.add(fillLight);

      resetBalls(scene);
    },
    onAnimate: () => {
      ballsRef.current.forEach((ball, index) => {
        if (!ball) return;
        
        let velocity = velocitiesRef.current[index];
        velocity -= gravity;
        
        let newY = ball.position.y + velocity;
        
        if (newY <= GROUND_Y + BALL_RADIUS) {
          ball.position.y = GROUND_Y + BALL_RADIUS;
          if (velocity < -0.01) {
            velocity = -velocity * bounciness;
          } else {
            velocity = 0;
          }
        } else {
          ball.position.y = newY;
        }
        
        velocitiesRef.current[index] = velocity;
      });
    }
  });

  const resetBalls = (targetScene) => {
    if (!targetScene) return;
    
    ballsRef.current.forEach(ball => {
      targetScene.remove(ball);
      ball.geometry.dispose();
      ball.material.dispose();
    });
    ballsRef.current = [];
    velocitiesRef.current = [];
    
    for (let i = 0; i < ballCount; i++) {
      const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
      const ballMat = new THREE.MeshStandardMaterial({ color: ballColor });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      
      ball.position.set((Math.random() - 0.5) * 8, 4 + Math.random() * 2, (Math.random() - 0.5) * 4);
      ball.castShadow = true;
      
      targetScene.add(ball);
      ballsRef.current.push(ball);
      velocitiesRef.current.push(0);
    }
  };

  useEffect(() => {
    if (isReady && scene) resetBalls(scene);
  }, [ballCount, isReady, scene]);

  useEffect(() => {
    ballsRef.current.forEach(ball => {
      if (ball) ball.material.color.set(ballColor);
    });
  }, [ballColor]);

  const codeSnippet = `// 1. Gravity & Velocity
velocity -= gravity; // Accelerated fall
ball.position.y += velocity;

// 2. Collision with Floor
const floorY = ${GROUND_Y} + radius;
if (ball.position.y <= floorY) {
  ball.position.y = floorY;
  // Reverse velocity with energy loss (bounciness)
  velocity = -velocity * ${bounciness}; 
}`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Physics Settings">
            <ControlGroup label="Gravity" valueDisplay={gravity.toFixed(4)}>
              <input type="range" min="0" max="0.005" step="0.0005" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Bounciness" valueDisplay={(bounciness * 100).toFixed(0) + '%'}>
              <input type="range" min="0.3" max="0.99" step="0.01" value={bounciness} onChange={(e) => setBounciness(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Color">
              <input type="color" value={ballColor} onChange={(e) => setBallColor(e.target.value)} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Simulation">
            <ControlGroup label="Balls" valueDisplay={ballCount}>
              <input type="range" min="1" max="10" step="1" value={ballCount} onChange={(e) => setBallCount(parseInt(e.target.value))} />
            </ControlGroup>
            <button className="reset-button" onClick={() => resetBalls(scene)} style={{ width: '100%', padding: '10px', background: '#4ecdc4', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Reset Simulation
            </button>
          </ControlPanel>
        </>
      }
    />
  );
}

export default PhysicsLesson;
