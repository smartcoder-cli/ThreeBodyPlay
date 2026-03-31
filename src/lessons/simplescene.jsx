import React, { useRef, useEffect } from 'react'

function SimpleScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 手动添加 Three.js 脚本
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r183/three.min.js'
    document.head.appendChild(script)

    script.onload = () => {
      const { THREE } = window
      
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a2e)
      
      const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
      camera.position.z = 5
      
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      containerRef.current.appendChild(renderer.domElement)
      
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      
      const animate = () => {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
    }
  }, [])

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '500px' }}></div>
      <div>最简单的 Three.js 场景</div>
    </div>
  )
}

export default SimpleScene