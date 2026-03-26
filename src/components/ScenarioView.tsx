'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Scenario } from '../data/types';
import { lessonSlugAt } from '../lib/routes';
import { track } from '../lib/analytics';
import { CodeEditor } from './CodeEditor';
import { WhyItMattersSection } from './WhyItMattersSection';
import { ShareSiteMenu } from './ShareSiteMenu';
import { SplitPanes } from './SplitPanes';
import { scenarioContextHtml } from '../lib/scenarioContext';

interface Props {
  scenario: Scenario;
  savedCode: Record<string, string>;
  onSaveCode: (key: string, code: string) => void;
  onOpenNav?: () => void;
  completedScenarios: Set<string>;
  onCompleteScenario: (id: string) => void;
  toast: (msg: string) => void;
}

export function ScenarioView({ scenario, savedCode, onSaveCode, onOpenNav, completedScenarios, onCompleteScenario, toast }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    setHintOpen(false);
  }, [scenario.id, currentStep]);

  const step = scenario.steps[currentStep];
  const isScenarioDone = completedScenarios.has(scenario.id);
  const allStepsDone = completedSteps.size === scenario.steps.length;

  const handleStepPass = () => {
    const next = new Set(completedSteps);
    next.add(currentStep);
    setCompletedSteps(next);

    if (next.size === scenario.steps.length) {
      onCompleteScenario(scenario.id);
    }
  };

  const codeKey = `scenario_${scenario.id}_step${currentStep}`;

  return (
    <SplitPanes
      left={
        <div className="learn">
        <div className="learn-pill-row">
          <button
            type="button"
            className="badge badge--nav-trigger"
            onClick={onOpenNav}
          >
            Scenario <span className="badge-caret" aria-hidden>▾</span>
          </button>
          <ShareSiteMenu
            title={`${scenario.title} · NumPy Dojo`}
            text={`Try the scenario "${scenario.title}" on NumPy Dojo—short multi-step NumPy exercises.`}
            ariaLabel={`Share this scenario: ${scenario.title}`}
            variant="compact"
          />
        </div>
        <h2>{scenario.title}</h2>

        <div className="scenario-intro">
          <h4>📋 Context</h4>
          <WhyItMattersSection
            html={scenarioContextHtml(scenario.context)}
            collapsible={false}
            lightboxTitle="Context"
          />
        </div>

        {/* Step indicators */}
        <div className="step-indicator">
          {scenario.steps.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === currentStep ? 'active' : ''} ${completedSteps.has(i) ? 'done' : ''}`}
              onClick={() => setCurrentStep(i)}
              style={{ cursor: 'pointer' }}
            >
              {completedSteps.has(i) ? '✓' : i + 1}
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 12 }}>{step.title}</h3>

        <div className="task">
          <div className="task-label">🎯 Task</div>
          <p dangerouslySetInnerHTML={{ __html: step.task }} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="hint-btn"
            aria-expanded={hintOpen}
            onClick={() =>
              setHintOpen((o) => {
                const next = !o;
                track('hint_toggled', { open: next, surface: 'scenario' });
                return next;
              })
            }
          >
            {hintOpen ? '💡 Hide Hint' : '💡 Show Hint'}
          </button>
        </div>
        <div className={`hint-box${hintOpen ? ' show' : ''}`}>{step.hint}</div>

        {/* Related lessons */}
        {scenario.lessonsUsed.length > 0 && (
          <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text-lo)' }}>
            <strong style={{ color: 'var(--text-mid)' }}>Related lessons:</strong>{' '}
            {scenario.lessonsUsed.map((idx, i) => (
              <span key={idx}>
                <Link href={`/lessons/${lessonSlugAt(idx)}`} className="lesson-link">
                  Lesson {idx + 1}
                </Link>
                {i < scenario.lessonsUsed.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        {allStepsDone && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--success-dim)', border: '1px solid var(--success)', borderRadius: 10, color: 'var(--success)', fontWeight: 600 }}>
            ✅ Scenario Complete! All steps passed.
          </div>
        )}

        {isScenarioDone && !allStepsDone && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--success-dim)', border: '1px solid var(--success)', borderRadius: 10, color: 'var(--success)', fontWeight: 600 }}>
            ✅ Previously completed
          </div>
        )}
        </div>
      }
      right={
        <CodeEditor
          key={codeKey}
          codeKey={codeKey}
          savedCode={savedCode[codeKey] || step.starter}
          validate={step.validate}
          onSaveCode={(code) => onSaveCode(codeKey, code)}
          onPass={handleStepPass}
          onNext={currentStep < scenario.steps.length - 1 ? () => setCurrentStep(s => s + 1) : undefined}
          toast={toast}
        />
      }
    />
  );
}
