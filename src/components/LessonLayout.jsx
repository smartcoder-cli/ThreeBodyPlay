import React, { useState } from 'react';

export function LessonLayout({ children, containerRef, canvasRef, sidebar, isReady, codeSnippet }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="lesson-layout">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas" ref={canvasRef} />
        {!isReady && <div className="loading-overlay">Loading 3D Scene...</div>}
        
        <button 
          className="code-toggle-btn"
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? '✕ Close Code' : '</> View Code'}
        </button>
      </div>

      <aside className="sidebar">
        {sidebar}
        {children}
      </aside>

      <div className={`code-drawer ${showCode ? 'open' : ''}`}>
        <div className="code-drawer-header">
          <h3>Source Code</h3>
          <button onClick={() => setShowCode(false)}>✕</button>
        </div>
        <div className="code-drawer-content">
          <pre>
            <code>{codeSnippet || '// No code snippet available for this lesson yet.'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function ControlPanel({ title, children }) {
  return (
    <div className="control-panel">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export function ControlGroup({ label, children, valueDisplay }) {
  return (
    <div className="control-group">
      <label>
        {label} {valueDisplay !== undefined && `(${valueDisplay})`}
      </label>
      {children}
    </div>
  );
}
