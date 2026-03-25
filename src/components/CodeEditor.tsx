'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from 'react';
import { executeCode } from '../lib/executor';

interface Props {
  codeKey: string;
  savedCode: string;
  validate: (scope: Record<string, any>) => string | true;
  onSaveCode: (code: string) => void;
  onPass: () => void;
  onNext?: () => void;
  toast: (msg: string) => void;
}

export function CodeEditor({ codeKey, savedCode, validate, onSaveCode, onPass, onNext, toast }: Props) {
  const [code, setCode] = useState(savedCode);
  const [output, setOutput] = useState('Run your code to see output here.');
  const [outputClass, setOutputClass] = useState('');
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [outputOpen, setOutputOpen] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Keep textarea in sync when switching exercise or when persisted code loads from storage.
  useEffect(() => {
    setCode(savedCode);
  }, [codeKey, savedCode]);

  // Clear run output only when the exercise changes — not when `savedCode` updates after Run
  // (onSaveCode bumps `savedCode` and was incorrectly wiping fresh output on the same frame).
  useEffect(() => {
    setOutput('Run your code to see output here.');
    setOutputClass('');
    setResult(null);
  }, [codeKey]);

  const runCode = useCallback(() => {
    onSaveCode(code);
    try {
      const { output: lines, scope } = executeCode(code);
      const txt = lines.join('\n');
      const validation = validate(scope);

      if (validation === true) {
        setOutput(txt || 'All checks passed!');
        setOutputClass('ok');
        setResult('pass');
        onPass();
      } else {
        setOutput((txt ? txt + '\n\n' : '') + '❌ ' + validation);
        setOutputClass('err');
        setResult('fail');
      }
    } catch (err: any) {
      setOutput('⚠️ Error:\n' + err.message);
      setOutputClass('err');
      setResult('fail');
    }

    if (!outputOpen) setOutputOpen(true);
  }, [code, validate, onSaveCode, onPass, outputOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  }, [code, runCode]);

  const copyCode = useCallback(() => {
    const text = code;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }, [code, toast]);

  function fallbackCopy(text: string) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('Copied!'); }
    catch { toast('Copy failed'); }
    document.body.removeChild(ta);
  }

  const changeFontSize = useCallback((delta: number) => {
    const root = document.documentElement;
    const cur = parseFloat(getComputedStyle(root).getPropertyValue('--editor-fs'));
    const next = Math.max(10, Math.min(22, cur + delta));
    root.style.setProperty('--editor-fs', next + 'px');
    try { localStorage.setItem('np_dojo_fs', String(next)); } catch { /* */ }
  }, []);

  return (
    <div className="code-pane">
      <div className="code-bar">
        <div className="code-bar-left">
          <span className="file-tab">exercise.py</span>
        </div>
        <div className="code-bar-right">
          <button className="icon-btn" onClick={copyCode} title="Copy code">📋</button>
          <button className="icon-btn" onClick={() => changeFontSize(-1)} title="Smaller">A-</button>
          <button className="icon-btn" onClick={() => changeFontSize(1)} title="Larger">A+</button>
          <button className="run" onClick={runCode}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Run
          </button>
        </div>
      </div>

      <div className="editor-wrap">
        <textarea
          ref={editorRef}
          className="editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="# Write code here..."
        />
        <div className="kb-hint">⌘⏎ run · ⌘← → nav</div>
      </div>

      {result && (
        <div className={`result-bar ${result}`}>
          <span>{result === 'pass' ? '✅ Exercise Complete!' : '❌ Not quite'}</span>
          {result === 'pass' && onNext && (
            <button className="next-btn" onClick={onNext}>Next →</button>
          )}
        </div>
      )}

      <div className="output">
        <div
          className="output-label"
          onClick={() => setOutputOpen(!outputOpen)}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ display: 'inline-block', transform: outputOpen ? 'rotate(90deg)' : 'none', transition: '0.2s', fontSize: 8 }}>▶</span>
          {' '}Output
        </div>
        {outputOpen && (
          <div className={`output-text ${outputClass}`}>{output}</div>
        )}
      </div>
    </div>
  );
}
