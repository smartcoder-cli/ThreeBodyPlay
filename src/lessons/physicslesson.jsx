import React, { useEffect, useState, useRef } from 'react'

function PhysicsLesson() {
  const [gravity, setGravity] = useState(0.001)
  const [bounciness, setBounciness] = useState(0.8)
  const [ballColor, setBallColor] = useState('#ff6b6b')
  const [ballCount, setBallCount] = useState(1)
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const ballsRef = useRef([])
  const velocitiesRef = useRef([])
  const rendererRef = useRef(null)
  
  const gravityRef = useRef(gravity)
  gravityRef.current = gravity
  
  const bouncinessRef = useRef(bounciness)
  bouncinessRef.current = bounciness
  
  const colorRef = useRef(ballColor)
  colorRef.current = ballColor
  
  const GROUND_Y = -1.5
  const BALL_RADIUS = 0.5
  
  useEffect(() => {
    let mounted = true
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a2e)
      sceneRef.current = scene
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      )
      camera.position.set(0, 2, 12)
      camera.lookAt(0, 0, 0)
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      rendererRef.current = renderer
      
      // Ground
      const groundGeo = new THREE.PlaneGeometry(20, 20)
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = GROUND_Y
      ground.receiveShadow = true
      scene.add(ground)
      
      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      // Create ball function
      const createBall = () => {
        const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32)
        const ballMat = new THREE.MeshStandardMaterial({ color: colorRef.current })
        const ball = new THREE.Mesh(ballGeo, ballMat)
        
        // Spread in 3D space
        ball.position.x = (Math.random() - 0.5) * 8
        ball.position.y = 4 + Math.random() * 2
        ball.position.z = (Math.random() - 0.5) * 4
        ball.castShadow = true
        
        scene.add(ball)
        ballsRef.current.push(ball)
        velocitiesRef.current.push(0)
      }
      
      // Initialize balls
      for (let i = 0; i < ballCount; i++) {
        createBall()
      }
      
      let lastTime = performance.now()
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        const currentTime = performance.now()
        const deltaTime = Math.min((currentTime - lastTime) / 16, 3) // Cap delta
        lastTime = currentTime
        
        ballsRef.current.forEach((ball, index) => {
          if (!ball) return
          
          const velocity = velocitiesRef.current[index]
          const g = gravityRef.current
          const b = bouncinessRef.current
          
          // Apply gravity to velocity
          let newVelocity = velocity - (g * deltaTime)
          
          // Update position
          const newY = ball.position.y + (newVelocity * deltaTime)
          
          // Check ground collision
          if (newY <= GROUND_Y) {
            ball.position.y = GROUND_Y
            
            // Bounce! Only if moving downward with enough speed
            if (newVelocity < -0.01) {
              newVelocity = -newVelocity * b
            } else {
              newVelocity = 0
            }
          } else {
            ball.position.y = newY
          }
          
          velocitiesRef.current[index] = newVelocity
        })
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  // Reset balls function
  const resetBalls = () => {
    if (!sceneRef.current) return
    
    // Remove all balls
    ballsRef.current.forEach(ball => {
      if (ball) {
        sceneRef.current.remove(ball)
        ball.geometry.dispose()
        ball.material.dispose()
      }
    })
    ballsRef.current = []
    velocitiesRef.current = []
    
    const THREE = window.THREE
    
    // Create new balls with spread positions
    for (let i = 0; i < ballCount; i++) {
      const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32)
      const ballMat = new THREE.MeshStandardMaterial({ color: ballColor })
      const ball = new THREE.Mesh(ballGeo, ballMat)
      
      ball.position.x = (Math.random() - 0.5) * 8
      ball.position.y = 4 + Math.random() * 2
      ball.position.z = (Math.random() - 0.5) * 4
      ball.castShadow = true
      
      sceneRef.current.add(ball)
      ballsRef.current.push(ball)
      velocitiesRef.current.push(0)
    }
  }
  
  useEffect(() => {
    resetBalls()
  }, [ballCount])
  
  useEffect(() => {
    ballsRef.current.forEach(ball => {
      if (ball) {
        ball.material.color.set(ballColor)
      }
    })
  }, [ballColor])
  
  useEffect(() => {
    bouncinessRef.current = bounciness
  }, [bounciness])
  
  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])
  
  const codeSnippet = `// Physics simulation
let gravity = ${gravity}
let bounciness = ${bounciness}
let velocity = 0

function animate() {
  requestAnimationFrame(animate)
  
  // Apply gravity
  velocity -= gravity
  
  // Update position
  ball.position.y += velocity
  
  // Bounce off ground
  if (ball.position.y <= -1.5) {
    ball.position.y = -1.5
    velocity = -velocity * bounciness
  }
  
  renderer.render(scene, camera)
}
animate()`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: '#4ecdc4' }}>Physics Demo</span>
          <p style={{ color: '#888', marginTop: '5px' }}>
            Gravity: {(gravity * 1000).toFixed(1)} | Bounce: {(bounciness * 100).toFixed(0)}% | Balls: {ballCount}
          </p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Physics Settings</h3>
          <div className="control-group">
            <label>Gravity ({gravity.toFixed(4)})</label>
            <input 
              type="range" 
              min="0" 
              max="0.005" 
              step="0.0005"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>Bounciness ({(bounciness * 100).toFixed(0)}%)</label>
            <input 
              type="range" 
              min="0.3" 
              max="0.99" 
              step="0.01"
              value={bounciness}
              onChange={(e) => setBounciness(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>Ball Color</label>
            <input 
              type="color" 
              value={ballColor}
              onChange={(e) => setBallColor(e.target.value)}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Balls</h3>
          <div className="control-group">
            <label>Ball Count ({ballCount})</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1"
              value={ballCount}
              onChange={(e) => setBallCount(parseInt(e.target.value))}
            />
          </div>
          <button 
            onClick={resetBalls}
            style={{
              width: '100%',
              padding: '10px',
              background: '#4ecdc4',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Reset Balls
          </button>
        </div>
        
        <div className="panel">
          <h3>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowCode(!showCode)}>
              {showCode ? '▼' : '▶'} Code Example
            </span>
          </h3>
          {showCode && (
            <pre className="code-preview">
              <code>{codeSnippet}</code>
            </pre>
          )}
        </div>
      </aside>
    </div>
  )
}

export default PhysicsLesson