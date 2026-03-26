'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EditorView, keymap, placeholder as cmPlaceholder } from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const darkHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#ff7b72' },
  { tag: tags.controlKeyword, color: '#ff7b72' },
  { tag: tags.operatorKeyword, color: '#ff7b72' },
  { tag: tags.definitionKeyword, color: '#ff7b72' },
  { tag: tags.moduleKeyword, color: '#ff7b72' },
  { tag: tags.operator, color: '#ff7b72' },
  { tag: tags.string, color: '#a5d6ff' },
  { tag: tags.number, color: '#79c0ff' },
  { tag: tags.bool, color: '#79c0ff' },
  { tag: tags.comment, color: '#8b949e', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#d2a8ff' },
  { tag: tags.function(tags.definition(tags.variableName)), color: '#d2a8ff' },
  { tag: tags.className, color: '#f0c674' },
  { tag: tags.definition(tags.className), color: '#f0c674' },
  { tag: tags.variableName, color: '#e1e4e8' },
  { tag: tags.propertyName, color: '#79c0ff' },
  { tag: tags.self, color: '#ff7b72' },
  { tag: tags.null, color: '#79c0ff' },
  { tag: tags.typeName, color: '#f0c674' },
  { tag: tags.special(tags.string), color: '#a5d6ff' },
]);

const lightHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#d73a49' },
  { tag: tags.controlKeyword, color: '#d73a49' },
  { tag: tags.operatorKeyword, color: '#d73a49' },
  { tag: tags.definitionKeyword, color: '#d73a49' },
  { tag: tags.moduleKeyword, color: '#d73a49' },
  { tag: tags.operator, color: '#d73a49' },
  { tag: tags.string, color: '#032f62' },
  { tag: tags.number, color: '#005cc5' },
  { tag: tags.bool, color: '#005cc5' },
  { tag: tags.comment, color: '#6a737d', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#6f42c1' },
  { tag: tags.function(tags.definition(tags.variableName)), color: '#6f42c1' },
  { tag: tags.className, color: '#e36209' },
  { tag: tags.definition(tags.className), color: '#e36209' },
  { tag: tags.variableName, color: '#24292e' },
  { tag: tags.propertyName, color: '#005cc5' },
  { tag: tags.self, color: '#d73a49' },
  { tag: tags.null, color: '#005cc5' },
  { tag: tags.typeName, color: '#e36209' },
  { tag: tags.special(tags.string), color: '#032f62' },
]);

const baseTheme = EditorView.baseTheme({
  '&': {
    height: '100%',
    fontSize: 'var(--editor-fs)',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: '1.7',
    padding: '18px',
    overflow: 'auto',
  },
  '.cm-content': {
    caretColor: 'var(--text-hi)',
    padding: '0',
  },
  '.cm-line': {
    padding: '0',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--text-hi)',
  },
  '.cm-selectionBackground': {
    background: 'rgba(100, 140, 200, 0.25) !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    background: 'rgba(100, 140, 200, 0.35) !important',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent',
  },
  '.cm-placeholder': {
    color: 'var(--text-lo)',
    fontStyle: 'normal',
  },
});

const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--bg-editor)',
    color: 'var(--text-hi)',
  },
}, { dark: true });

const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--bg-editor)',
    color: 'var(--text-hi)',
  },
}, { dark: false });

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  placeholder?: string;
}

export function CodeMirrorEditor({ value, onChange, onRun, placeholder }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const isDark = useCallback(() => {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const dark = isDark();

    const runKeyBinding = Prec.highest(keymap.of([{
      key: 'Mod-Enter',
      run: () => {
        onRunRef.current?.();
        return true;
      },
    }]));

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const extensions = [
      runKeyBinding,
      baseTheme,
      dark ? darkTheme : lightTheme,
      syntaxHighlighting(dark ? darkHighlight : lightHighlight),
      python(),
      keymap.of([indentWithTab, ...defaultKeymap]),
      updateListener,
      EditorView.lineWrapping,
      EditorState.tabSize.of(4),
      ...(placeholder ? [cmPlaceholder(placeholder)] : []),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only create the view once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. lesson switch)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  // Sync theme when data-theme changes
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      const view = viewRef.current;
      if (!view) return;

      const dark = isDark();
      const doc = view.state.doc.toString();

      const extensions = [
        Prec.highest(keymap.of([{
          key: 'Mod-Enter',
          run: () => {
            onRunRef.current?.();
            return true;
          },
        }])),
        baseTheme,
        dark ? darkTheme : lightTheme,
        syntaxHighlighting(dark ? darkHighlight : lightHighlight),
        python(),
        keymap.of([indentWithTab, ...defaultKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
        EditorState.tabSize.of(4),
        ...(placeholder ? [cmPlaceholder(placeholder)] : []),
      ];

      view.setState(EditorState.create({ doc, extensions }));
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [isDark, placeholder]);

  return <div ref={containerRef} className="cm-editor-container" />;
}
