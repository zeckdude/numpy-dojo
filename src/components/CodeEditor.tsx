'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { executeCode } from '../lib/executor';
import { captureClientError, track } from '../lib/analytics';

const OUTPUT_SPLIT_STORAGE_KEY = 'np_dojo_editor_output_pct';
const OUTPUT_SPLIT_DEFAULT = 58;
const OUTPUT_SPLIT_MIN = 22;
const OUTPUT_SPLIT_MAX = 78;

function clampSplit(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function readOutputSplitPct(): number {
  try {
    const v = parseFloat(localStorage.getItem(OUTPUT_SPLIT_STORAGE_KEY) ?? '');
    if (Number.isFinite(v)) return clampSplit(v, OUTPUT_SPLIT_MIN, OUTPUT_SPLIT_MAX);
  } catch {
    /* ignore */
  }
  return OUTPUT_SPLIT_DEFAULT;
}

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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileEditorExpanded, setMobileEditorExpanded] = useState(false);
  const [editorPct, setEditorPct] = useState(OUTPUT_SPLIT_DEFAULT);
  const [outputSplitDragging, setOutputSplitDragging] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const codePaneRef = useRef<HTMLDivElement>(null);
  const outputSplitRef = useRef<HTMLDivElement>(null);
  const editorPctRef = useRef(editorPct);

  editorPctRef.current = editorPct;

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

  useEffect(() => {
    setMobileEditorExpanded(false);
  }, [codeKey]);

  useEffect(() => {
    setEditorPct(readOutputSplitPct());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const sync = () => {
      const m = mq.matches;
      setIsMobile(m);
      if (!m) setMobileEditorExpanded(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const pane = codePaneRef.current?.closest('.panes');
    if (!pane) return;
    if (isMobile && mobileEditorExpanded) pane.classList.add('panes--mobile-code-expanded');
    else pane.classList.remove('panes--mobile-code-expanded');
    return () => pane.classList.remove('panes--mobile-code-expanded');
  }, [isMobile, mobileEditorExpanded]);

  const runCode = useCallback(() => {
    onSaveCode(code);
    const context = codeKey.startsWith('scenario_')
      ? 'scenario'
      : codeKey.startsWith('lesson_')
        ? 'lesson'
        : 'other';
    try {
      const { output: lines, scope } = executeCode(code);
      const txt = lines.join('\n');
      const validation = validate(scope);
      const validationOk = validation === true;
      track('code_run', { context, code_key: codeKey, validation_ok: validationOk });

      if (validationOk) {
        setOutput(txt || 'All checks passed!');
        setOutputClass('ok');
        setResult('pass');
        onPass();
      } else {
        setOutput((txt ? txt + '\n\n' : '') + '❌ ' + validation);
        setOutputClass('err');
        setResult('fail');
      }
    } catch (err: unknown) {
      captureClientError(err, { surface: 'code_run', context, code_key: codeKey });
      track('code_run', { context, code_key: codeKey, validation_ok: false, runtime_error: true });
      const msg = err instanceof Error ? err.message : String(err);
      setOutput('⚠️ Error:\n' + msg);
      setOutputClass('err');
      setResult('fail');
    }

    if (!outputOpen) setOutputOpen(true);
  }, [code, codeKey, validate, onSaveCode, onPass, outputOpen]);

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

  const applyOutputSplitPct = useCallback((raw: number) => {
    const c = clampSplit(raw, OUTPUT_SPLIT_MIN, OUTPUT_SPLIT_MAX);
    setEditorPct(c);
    try {
      localStorage.setItem(OUTPUT_SPLIT_STORAGE_KEY, String(Math.round(c * 10) / 10));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!outputSplitDragging || isMobile) return;

    const applyFromClientY = (clientY: number) => {
      const el = outputSplitRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = rect.height;
      if (h <= 0) return;
      const y = clientY - rect.top;
      applyOutputSplitPct((y / h) * 100);
    };

    const onMouseMove = (e: MouseEvent) => applyFromClientY(e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) applyFromClientY(e.touches[0].clientY);
    };
    const end = () => setOutputSplitDragging(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', end);
      document.removeEventListener('touchcancel', end);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [outputSplitDragging, applyOutputSplitPct, isMobile]);

  const onOutputGutterKeyDown = (e: KeyboardEvent) => {
    if (isMobile) return;
    const p = editorPctRef.current;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      applyOutputSplitPct(p - 3);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      applyOutputSplitPct(p + 3);
    } else if (e.key === 'Home') {
      e.preventDefault();
      applyOutputSplitPct(OUTPUT_SPLIT_MIN);
    } else if (e.key === 'End') {
      e.preventDefault();
      applyOutputSplitPct(OUTPUT_SPLIT_MAX);
    }
  };

  return (
    <div className="code-pane" ref={codePaneRef}>
      <div className="code-bar">
        <div className="code-bar-left">
          <span className="file-tab">exercise.py</span>
        </div>
        <div className="code-bar-right">
          <button className="icon-btn" onClick={copyCode} title="Copy code">📋</button>
          {isMobile ? (
            <button
              type="button"
              className={`icon-btn${mobileEditorExpanded ? ' icon-btn--active' : ''}`}
              onClick={() =>
                setMobileEditorExpanded((v) => {
                  const next = !v;
                  track('mobile_code_pane_expand', { expanded: next });
                  return next;
                })
              }
              title={mobileEditorExpanded ? 'Show lesson and editor' : 'Expand editor height'}
              aria-label={mobileEditorExpanded ? 'Show lesson and editor' : 'Expand editor height'}
              aria-pressed={mobileEditorExpanded}
            >
              ↕️
            </button>
          ) : null}
          <button className="icon-btn" onClick={() => changeFontSize(-1)} title="Smaller font">➖</button>
          <button className="icon-btn" onClick={() => changeFontSize(1)} title="Larger font">➕</button>
          <button className="run" onClick={runCode}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Run
          </button>
        </div>
      </div>

      <div
        ref={outputSplitRef}
        className={`code-editor-split${outputSplitDragging ? ' code-editor-split--dragging' : ''}`}
        style={{
          gridTemplateRows: isMobile
            ? 'minmax(0, 1fr) auto'
            : `minmax(0, ${editorPct}fr) 6px minmax(0, ${100 - editorPct}fr)`,
        }}
      >
        <div className="code-split-top">
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
                <button type="button" className="next-btn" onClick={onNext}>
                  Next →
                </button>
              )}
            </div>
          )}
        </div>

        {!isMobile ? (
          <div
            className="output-split-gutter"
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize editor and output height"
            aria-valuenow={Math.round(editorPct)}
            aria-valuemin={OUTPUT_SPLIT_MIN}
            aria-valuemax={OUTPUT_SPLIT_MAX}
            tabIndex={0}
            onMouseDown={(e) => {
              e.preventDefault();
              setOutputSplitDragging(true);
            }}
            onTouchStart={() => setOutputSplitDragging(true)}
            onKeyDown={onOutputGutterKeyDown}
          />
        ) : null}

        <div className="output">
          <div
            className="output-label"
            onClick={() => setOutputOpen(!outputOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: outputOpen ? 'rotate(90deg)' : 'none',
                transition: '0.2s',
                fontSize: 8,
              }}
            >
              ▶
            </span>{' '}
            Output
          </div>
          {outputOpen && <div className={`output-text ${outputClass}`}>{output}</div>}
        </div>
      </div>
    </div>
  );
}
