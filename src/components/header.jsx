import React from 'react'

function Header({ nextLesson, prevLesson }) {
  const base = '/ThreeBodyPlay'

  return (
    <header className="header">
      <div className="header-left">
        <a href={`${base}/`} className="logo">ThreeBodyPlay</a>
        <span className="tagline">Interactive Three.js Learning</span>
      </div>
      <nav className="nav-links">
        <a href={`${base}/`}>Home</a>
        {prevLesson && (
          <a href={`${base}/#${prevLesson.id}`} className="prev-lesson-link">
            ← {prevLesson.title}
          </a>
        )}
        {nextLesson ? (
          <a href={`${base}/#${nextLesson.id}`} className="next-lesson-link">
            {nextLesson.title} →
          </a>
        ) : (
          <a href={`${base}/#lessons`}>All Lessons</a>
        )}
        <a href="https://threejs.org" target="_blank" rel="noopener">Three.js</a>
      </nav>
    </header>
  )
}

export default Header