import { useState, useCallback, useRef, type ReactNode } from "react";
import styles from "./CreateEvaluationPage.module.css";

/* ─── Icons ─── */

function ScorecardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="12" height="12" rx="2.5" fill="#818cf8" />
      <path d="M5.25 7.5L6.75 9L9.75 6" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Sub-components ─── */

function BreadcrumbChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Breadcrumb({
  parent,
  current,
  onParentClick,
}: {
  parent: string;
  current: string;
  onParentClick?: () => void;
}) {
  return (
    <nav className={styles.breadcrumb}>
      <button type="button" className={styles.breadcrumbParent} onClick={onParentClick}>
        {parent}
      </button>
      <span className={styles.breadcrumbSep}><BreadcrumbChevron /></span>
      <span className={styles.breadcrumbCurrent}>{current}</span>
    </nav>
  );
}

function StepperItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? styles.stepperItemActive : styles.stepperItem}
      onClick={onClick}
    >
      {label}
      {active && <span className={styles.stepperArrow}>▸</span>}
    </button>
  );
}

function FormGroup({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.formGroup}>
      <label className={optional ? styles.formLabelOptional : styles.formLabel}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectWithIcon({
  placeholder,
  icon,
}: {
  placeholder: string;
  icon: ReactNode;
}) {
  return (
    <div className={styles.formSelectWrap}>
      <span className={styles.formSelectIcon}>{icon}</span>
      <select className={styles.formSelectWithIcon} defaultValue="">
        <option value="" disabled>{placeholder}</option>
      </select>
    </div>
  );
}

function Switch({ on, onToggle }: { on?: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.switch}${on ? ` ${styles.switchOn}` : ""}`}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
    >
      <span className={styles.switchTrack} />
      <span className={styles.switchHandle} />
    </button>
  );
}

/* ─── Section components ─── */

function SetupSection() {
  return (
    <div className={styles.section} id="section-setup">
      <p className={styles.sectionHeading}>Setup</p>
      <p className={styles.sectionDesc}>
        Select where conversations come from and what to score them against.
      </p>
      <div className={styles.sectionFields}>
        <FormGroup label="Title">
          <input
            type="text"
            className={styles.formInput}
            placeholder="New evaluation"
          />
        </FormGroup>
        <FormGroup label="Source">
          <select className={styles.formSelect} defaultValue="">
            <option value="" disabled>Select source</option>
          </select>
        </FormGroup>
        <FormGroup label="Scorecard">
          <SelectWithIcon
            placeholder="Select scorecard"
            icon={<ScorecardIcon />}
          />
        </FormGroup>
        <FormGroup label="Frequency">
          <select className={styles.formSelect} defaultValue="">
            <option value="" disabled>Select timeframe</option>
          </select>
        </FormGroup>
      </div>
    </div>
  );
}

function FiltersSection() {
  return (
    <div className={styles.section} id="section-filters">
      <p className={styles.sectionHeading}>Filters</p>
      <p className={styles.sectionDesc}>
        Define which conversations should be included in this evaluation.
      </p>
      <div className={styles.emptyState}>
        <button type="button" className={styles.emptyStateBtn}>
          Add filter
        </button>
      </div>
    </div>
  );
}

function WorkflowsSection() {
  return (
    <div className={styles.section} id="section-workflows">
      <p className={styles.sectionHeading}>Workflows</p>
      <p className={styles.sectionDesc}>
        Automate actions like escalations and notifications based on specific evaluation results.
      </p>
      <div className={styles.sectionFields}>
        <FormGroup label="Workflows" optional>
          <select className={styles.formSelect} defaultValue="">
            <option value="" disabled>Select</option>
          </select>
        </FormGroup>
      </div>
    </div>
  );
}

function TestingSection() {
  const [testingOn, setTestingOn] = useState(false);

  return (
    <div className={styles.card} id="section-testing">
      <div className={styles.cardTop}>
        <div className={styles.cardHeading}>
          <p className={styles.cardTitle}>Testing</p>
          <p className={styles.cardDesc}>Team members score conversations to train AI</p>
        </div>
        <Switch on={testingOn} onToggle={() => setTestingOn((v) => !v)} />
      </div>
      <div className={styles.cardDivider} />
      <div className={styles.cardBody}>
        <div className={styles.cardBodyFields}>
          <FormGroup label="Team members">
            <select className={styles.formSelect} defaultValue="">
              <option value="" disabled>Select team members</option>
            </select>
          </FormGroup>
          <FormGroup label="Conversations per member">
            <select className={styles.formSelect} defaultValue="">
              <option value="" disabled>Select amount</option>
            </select>
          </FormGroup>
          <FormGroup label="Deadline">
            <select className={styles.formSelect} defaultValue="">
              <option value="" disabled>Select deadline</option>
            </select>
          </FormGroup>
        </div>
        <button type="button" className={styles.outlineBtn}>
          Add team members
        </button>
      </div>
    </div>
  );
}

/* ─── Props ─── */

export interface CreateEvaluationPageProps {
  onBack?: () => void;
  onCreate?: () => void;
  className?: string;
}

/* ─── Main component ─── */

const STEPS = ["Setup", "Filters", "Workflows", "Testing"] as const;

export function CreateEvaluationPage({
  onBack,
  onCreate,
  className,
}: CreateEvaluationPageProps) {
  const [activeStep, setActiveStep] = useState<string>("Setup");
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((step: string) => {
    setActiveStep(step);
    const id = `section-${step.toLowerCase()}`;
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      const container = contentRef.current;
      const top = el.offsetTop - container.offsetTop;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className={`${styles.container}${className ? ` ${className}` : ""}`}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <Breadcrumb parent="Evaluations" current="New evaluation" onParentClick={onBack} />
        <button type="button" className={styles.createBtn} onClick={onCreate}>
          Create
        </button>
      </div>

      {/* Three-column body */}
      <div className={styles.body}>
        {/* Page sidebar (stepper) */}
        <div className={styles.sidebar}>
          {STEPS.map((step) => (
            <StepperItem
              key={step}
              label={step}
              active={activeStep === step}
              onClick={() => scrollToSection(step)}
            />
          ))}
        </div>

        {/* Inner body (scrollable form) */}
        <div className={styles.content} ref={contentRef}>
          <div className={styles.contentInner}>
            <SetupSection />
            <FiltersSection />
            <WorkflowsSection />
            <TestingSection />
          </div>
        </div>

        {/* Preview panel */}
        <div className={styles.preview}>
          <p className={styles.previewTitle}>Preview</p>
          <p className={styles.previewEmpty}>No conversations to show</p>
        </div>
      </div>
    </div>
  );
}
