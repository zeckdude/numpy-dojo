import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeEditor } from '../CodeEditor';
import { stubMatchMedia } from '../../test/matchMedia';

vi.mock('../CodeMirrorEditor', () => ({
  CodeMirrorEditor: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock('../../lib/analytics', () => ({
  track: vi.fn(),
  captureClientError: vi.fn(),
}));

const OUTPUT_SPLIT_KEY = 'np_dojo_editor_output_pct';

function desktopMatchMedia(q: string) {
  if (q.includes('max-width: 768px')) return false;
  return false;
}

function mobileMatchMedia(q: string) {
  if (q.includes('max-width: 768px')) return true;
  return false;
}

describe('CodeEditor', () => {
  let restoreMq: () => void;

  const toast = vi.fn();
  const onSaveCode = vi.fn();
  const onPass = vi.fn();

  beforeEach(() => {
    localStorage.removeItem(OUTPUT_SPLIT_KEY);
    toast.mockClear();
    onSaveCode.mockClear();
    onPass.mockClear();
    restoreMq = stubMatchMedia(desktopMatchMedia);
  });

  afterEach(() => {
    restoreMq();
    localStorage.removeItem(OUTPUT_SPLIT_KEY);
  });

  function renderInPanes(ui: ReactElement) {
    return render(<div className="panes">{ui}</div>);
  }

  it('Run shows execution output in the output panel', async () => {
    const user = userEvent.setup();
    renderInPanes(
      <CodeEditor
        codeKey="lesson_ce1"
        savedCode="print(1)"
        validate={() => true}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    await user.click(screen.getByRole('button', { name: /^Run$/i }));

    const outputText = document.querySelector('.output-text');
    expect(outputText).toBeTruthy();
    expect(outputText?.textContent).toMatch(/1/);
  });

  it('shows pass result bar and calls onPass when validation passes', async () => {
    const user = userEvent.setup();
    renderInPanes(
      <CodeEditor
        codeKey="lesson_ce2"
        savedCode="x = 1"
        validate={(scope) => (scope.x === 1 ? true : 'fail')}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    await user.click(screen.getByRole('button', { name: /^Run$/i }));

    expect(screen.getByText(/exercise complete/i)).toBeInTheDocument();
    expect(onPass).toHaveBeenCalled();
  });

  it('shows fail result bar and validation message when validation fails', async () => {
    const user = userEvent.setup();
    renderInPanes(
      <CodeEditor
        codeKey="lesson_ce3"
        savedCode="x = 2"
        validate={(scope) => (scope.x === 1 ? true : 'need x = 1')}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    await user.click(screen.getByRole('button', { name: /^Run$/i }));

    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    const outputText = document.querySelector('.output-text');
    expect(outputText?.textContent).toMatch(/need x = 1/);
    expect(onPass).not.toHaveBeenCalled();
  });

  it('toggles output body when clicking the Output label', async () => {
    const user = userEvent.setup();
    renderInPanes(
      <CodeEditor
        codeKey="lesson_ce4"
        savedCode="print('hi')"
        validate={() => true}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    await user.click(screen.getByRole('button', { name: /^Run$/i }));
    expect(document.querySelector('.output-text')).toBeInTheDocument();

    const outputBlock = document.querySelector('.output');
    const label = within(outputBlock as HTMLElement).getByText('Output', { exact: false });
    await user.click(label);
    expect(document.querySelector('.output-text')).not.toBeInTheDocument();

    await user.click(label);
    expect(document.querySelector('.output-text')).toBeInTheDocument();
  });

  it('adjusts editor/output split with keyboard on the gutter and saves to localStorage', async () => {
    const user = userEvent.setup();
    renderInPanes(
      <CodeEditor
        codeKey="lesson_ce5"
        savedCode="x=1"
        validate={() => true}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    const gutter = screen.getByRole('separator', { name: /^resize editor and output height$/i });
    gutter.focus();
    await user.keyboard('{ArrowDown}');

    const pct = parseFloat(localStorage.getItem(OUTPUT_SPLIT_KEY) ?? '0');
    expect(pct).toBeGreaterThan(58);
  });

  it('mobile expand toggles panes--mobile-code-expanded on the parent .panes', async () => {
    restoreMq();
    restoreMq = stubMatchMedia(mobileMatchMedia);
    const user = userEvent.setup();

    const { container } = renderInPanes(
      <CodeEditor
        codeKey="lesson_ce6"
        savedCode="x=1"
        validate={() => true}
        onSaveCode={onSaveCode}
        onPass={onPass}
        toast={toast}
      />
    );

    const panes = container.querySelector('.panes');
    expect(panes).toBeTruthy();

    const expandBtn = screen.getByRole('button', { name: /expand editor height/i });
    await user.click(expandBtn);
    expect(panes?.classList.contains('panes--mobile-code-expanded')).toBe(true);

    await user.click(screen.getByRole('button', { name: /show lesson and editor/i }));
    expect(panes?.classList.contains('panes--mobile-code-expanded')).toBe(false);
  });
});
