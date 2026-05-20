import React, { useState, useContext } from 'react';
import { LessonMetaContext } from '../contexts/LessonMetaContext';

// ─── Regex-based syntax highlighter ────────────────────────────────────────
const KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|new|class|import|export|default|from|true|false|null|undefined|this|of|in|async|await|=\>)\b/g
const CLASSES   = /\bTHREE\.[A-Za-z]+\b/g
const STRINGS   = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
const COMMENTS  = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g
const NUMBERS   = /\b(\d+\.?\d*)\b/g

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlight(code) {
  // We process in passes using placeholder tokens to avoid re-matching
  const chunks = []
  let remaining = code

  // Helper: find earliest match among all patterns
  const patterns = [
    { re: new RegExp(COMMENTS.source, 'g'), cls: 'tok-comment' },
    { re: new RegExp(STRINGS.source, 'g'),  cls: 'tok-string'  },
    { re: new RegExp(CLASSES.source,  'g'), cls: 'tok-class'   },
    { re: new RegExp(KEYWORDS.source, 'g'), cls: 'tok-keyword' },
    { re: new RegExp(NUMBERS.source,  'g'), cls: 'tok-number'  },
  ]

  let result = ''
  let pos = 0
  const src = code

  // Build a list of all match ranges (non-overlapping, earliest wins)
  const allMatches = []
  for (const { re, cls } of patterns) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(src)) !== null) {
      allMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0], cls })
    }
  }

  // Sort by start, then by pattern priority (earlier in array = higher priority)
  allMatches.sort((a, b) => a.start - b.start || a.end - b.end)

  // Walk through, picking non-overlapping matches
  let cursor = 0
  for (const match of allMatches) {
    if (match.start < cursor) continue // overlaps previous
    if (match.start > cursor) {
      result += `<span class="tok-plain">${escHtml(src.slice(cursor, match.start))}</span>`
    }
    result += `<span class="${match.cls}">${escHtml(match.text)}</span>`
    cursor = match.end
  }
  if (cursor < src.length) {
    result += `<span class="tok-plain">${escHtml(src.slice(cursor))}</span>`
  }
  return result
}
// ───────────────────────────────────────────────────────────────────────────

export function LessonLayout({ children, containerRef, canvasRef, sidebar, isReady, codeSnippet, lessonMeta }) {
  const contextLessonMeta = useContext(LessonMetaContext);
  const activeMeta = lessonMeta || contextLessonMeta;
  const [showCode, setShowCode] = useState(false);
  const highlighted = codeSnippet ? highlight(codeSnippet) : null;

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
        {activeMeta && (
          <div className="lesson-info-panel">
            <div className="lesson-info-phase">{activeMeta.phase}</div>
            <div className="lesson-info-title">L{String(activeMeta.num).padStart(2, '0')} — {activeMeta.title}</div>
            <div className="lesson-info-objective">{activeMeta.objective}</div>
          </div>
        )}
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
            {highlighted
              ? <code dangerouslySetInnerHTML={{ __html: highlighted }} />
              : <code className="tok-plain">// No code snippet available for this lesson yet.</code>
            }
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
