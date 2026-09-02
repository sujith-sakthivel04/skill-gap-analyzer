import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Loader2,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Lightbulb,
  Layers,
  RotateCcw,
} from 'lucide-react';

const MotionSection = motion.section;
const MotionDiv = motion.div;

// Dynamic subtopic content generator for rich stage expansion
function getSubtopicDetails(topic) {
  const cleanTopic = typeof topic === 'string' ? topic.trim() : '';
  return {
    understanding: `Gain a clear mastery of the core mechanisms, syntax, and foundational patterns of ${cleanTopic}.`,
    whyItMatters: `Essential for building scalable architecture, avoiding common runtime pitfalls, and writing production-ready code with ${cleanTopic}.`,
    keyConcepts: [
      `Core Principles & API Mechanics for ${cleanTopic}`,
      `Practical Implementation & Workflow Integration`,
      `Performance Optimization & Best Practices`,
    ],
  };
}

function RoadmapCard({
  stageNumber,
  topic,
  isCompleted,
  isCurrent,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
}) {
  const details = getSubtopicDetails(topic);

  return (
    <div
      onClick={onToggleExpand}
      className={`group relative cursor-pointer rounded-[1.5rem] border transition-all duration-300 ${
        isCompleted
          ? 'border-emerald-300 bg-emerald-50/50 shadow-sm hover:border-emerald-400'
          : isCurrent
          ? 'border-[var(--color-accent)] bg-white/95 shadow-[0_12px_32px_-12px_rgba(245,158,11,0.35)] ring-2 ring-[var(--color-accent)]/30'
          : 'border-[var(--color-line)] bg-white/85 shadow-[var(--shadow-card)] hover:border-[var(--color-accent)] hover:-translate-y-0.5'
      } p-5 sm:p-6`}
    >
      {/* Background glow for current stage */}
      {isCurrent && (
        <div className="pointer-events-none absolute -right-2 top-6 h-12 w-12 rounded-full bg-[var(--color-accent-faint)] blur-xl" />
      )}

      {/* Header badges & controls */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] ${
              isCompleted
                ? 'border border-emerald-300 bg-emerald-100 text-emerald-800'
                : isCurrent
                ? 'bg-[var(--color-accent)] text-white shadow-xs font-black'
                : 'border border-[var(--color-line)] bg-[var(--color-accent-faint)] text-[var(--color-accent-strong)]'
            }`}
          >
            Stage {stageNumber}
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[0.7rem] font-bold text-emerald-800 border border-emerald-200">
              <Check className="h-3 w-3 stroke-[3]" /> Learned
            </span>
          )}

          {isCurrent && !isCompleted && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100/90 px-2.5 py-0.5 text-[0.7rem] font-bold text-[var(--color-accent-strong)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Current Target
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={isExpanded ? 'Collapse stage details' : 'Expand stage details'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="rounded-full p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-accent-faint)] hover:text-[var(--color-ink)]"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Subtopic Title */}
      <h5 className="mt-3 text-lg font-semibold leading-7 text-[var(--color-ink)]">
        {topic}
      </h5>

      {/* Collapsed summary */}
      {!isExpanded && (
        <p className="mt-2 text-xs leading-5 text-[var(--color-muted)] line-clamp-2">
          {details.understanding}
        </p>
      )}

      {/* Expanded details with Framer Motion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 border-t border-[var(--color-line)] pt-4 text-left">
              {/* Understanding section */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-strong)]">
                  <Lightbulb className="h-3.5 w-3.5" /> What to understand
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">
                  {details.understanding}
                </p>
              </div>

              {/* Why it matters section */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-strong)]">
                  <Sparkles className="h-3.5 w-3.5" /> Why this topic matters
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  {details.whyItMatters}
                </p>
              </div>

              {/* Key concepts */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-strong)]">
                  <Layers className="h-3.5 w-3.5" /> Key Concepts
                </p>
                <ul className="mt-2 space-y-1.5">
                  {details.keyConcepts.map((concept, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink-soft)]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-line)]/60 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete();
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 shadow-sm ${
                    isCompleted
                      ? 'border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)] text-white hover:opacity-95 shadow-md hover:scale-[1.02]'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" /> Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" /> Mark as Learned
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                >
                  Collapse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillRoadmap({
  selectedSkill,
  selectedSkillDetails,
  roleName,
  learningProgress,
  onProgressChange,
  onResetProgress,
  detailsError,
  isDetailsLoading,
}) {
  const subtopics = Array.isArray(selectedSkillDetails?.subtopics)
    ? selectedSkillDetails.subtopics.filter(
        (topic) => typeof topic === 'string' && topic.trim()
      )
    : [];

  // Progression state
  const [completedStages, setCompletedStages] = useState(new Set());
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [expandedStageIndex, setExpandedStageIndex] = useState(null);

  // Refs for scroll observation
  const stageRefs = useRef([]);

  // Restore state from learningProgress / localStorage whenever selected skill or subtopics change
  useEffect(() => {
    if (!selectedSkill || !roleName) {
      setCompletedStages(new Set());
      setCurrentStageIndex(0);
      setExpandedStageIndex(null);
      return;
    }

    const storedData = learningProgress?.[roleName]?.[selectedSkill];
    const storedStages = Array.isArray(storedData?.completedStages)
      ? storedData.completedStages
      : [];

    // Filter to valid indices within subtopics length (Requirement 18)
    const validStages = subtopics.length > 0
      ? storedStages.filter((idx) => typeof idx === 'number' && idx < subtopics.length)
      : storedStages;

    const completedSet = new Set(validStages);
    setCompletedStages(completedSet);
    setExpandedStageIndex(null);

    // Intelligent current stage determination (Requirement 15)
    if (subtopics.length > 0) {
      if (completedSet.size === 0) {
        setCurrentStageIndex(0);
      } else if (completedSet.size < subtopics.length) {
        const firstIncomplete = subtopics.findIndex((_, idx) => !completedSet.has(idx));
        setCurrentStageIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
      } else {
        setCurrentStageIndex(subtopics.length - 1);
      }
    } else {
      setCurrentStageIndex(0);
    }
  }, [selectedSkill, roleName, subtopics.length]);

  // Scroll observer to update current active stage dynamically
  useEffect(() => {
    if (!subtopics.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.stageIndex);
            if (!isNaN(index)) {
              setCurrentStageIndex(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -35% 0px',
        threshold: 0.25,
      }
    );

    stageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [subtopics.length]);

  const toggleCompleteStage = (index) => {
    setCompletedStages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      const stageArray = Array.from(next);
      if (onProgressChange && roleName && selectedSkill) {
        onProgressChange(roleName, selectedSkill, stageArray, subtopics.length);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (!selectedSkill || !roleName) return;
    const confirmed = window.confirm(`Reset ${selectedSkill} progress?`);
    if (!confirmed) return;

    setCompletedStages(new Set());
    setCurrentStageIndex(0);
    setExpandedStageIndex(null);

    if (onResetProgress) {
      onResetProgress(roleName, selectedSkill);
    }
  };

  const toggleExpandStage = (index) => {
    setExpandedStageIndex((prev) => (prev === index ? null : index));
    setCurrentStageIndex(index);
  };

  const completedCount = completedStages.size;
  const totalCount = subtopics.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Highest index reached for connecting line progress
  const maxActiveIndex = Math.max(
    currentStageIndex,
    ...Array.from(completedStages),
    0
  );
  const lineProgressPercent =
    totalCount > 1
      ? Math.min(100, (maxActiveIndex / (totalCount - 1)) * 100)
      : 100;

  return (
    <MotionSection
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5 }}
      className="px-5 pb-16 pt-4 sm:px-8 lg:px-10 lg:pb-24"
    >
      <div className="mx-auto max-w-[1380px] rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,250,238,0.95))] p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-faint)] text-[var(--color-accent-strong)]">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-strong)]">
              Skill roadmap details
            </p>

            <h3 className="font-display mt-1 text-2xl text-[var(--color-ink)] sm:text-3xl">
              {selectedSkill || 'Choose a skill from the orbit'}
            </h3>
          </div>
        </div>

        {isDetailsLoading && (
          <MotionDiv
            className="mt-7 flex items-center gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white px-5 py-4 text-[var(--color-muted)]"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 0.8,
            }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading skill details...
          </MotionDiv>
        )}

        {!isDetailsLoading && detailsError && (
          <div className="mt-7 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{detailsError}</p>
            </div>
          </div>
        )}

        {!isDetailsLoading && !detailsError && selectedSkillDetails && (
          <div className="mt-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/85 p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-strong)]">
                  Description
                </p>

                <p className="mt-3 text-base leading-7 text-[var(--color-ink-soft)]">
                  {selectedSkillDetails.description ||
                    'No description available for this skill yet.'}
                </p>
              </div>

              <div className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/85 p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-strong)]">
                  Subtopics
                </p>

                {subtopics.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {subtopics.map((topic, index) => (
                      <span
                        key={`${topic}-${index}`}
                        className="rounded-full border border-[var(--color-line)] bg-[var(--color-accent-faint)] px-3 py-1.5 text-sm text-[var(--color-ink-soft)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    No subtopics available yet.
                  </p>
                )}
              </div>
            </div>

            {subtopics.length > 0 && (
              <div className="mt-12">
                <div className="mb-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent-strong)]">
                    Learning journey
                  </p>

                  <h4 className="font-display mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
                    {selectedSkill} Roadmap
                  </h4>

                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base">
                    Follow each stage in sequence to build your understanding
                    from fundamentals toward practical application.
                  </p>
                </div>

                {/* Compact Progress Tracker */}
                <div className="mb-10 rounded-[1.5rem] border border-[var(--color-line)] bg-white/90 p-5 shadow-xs sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
                        <Target className="h-4 w-4" />
                        <span>
                          {selectedSkill
                            ? `${selectedSkill.toUpperCase()} LEARNING JOURNEY`
                            : 'LEARNING JOURNEY'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                        <span className="font-bold text-[var(--color-accent-strong)]">
                          {completedCount}
                        </span>{' '}
                        / {totalCount} stages completed
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-[var(--color-accent-strong)]">
                        {progressPercent}%
                      </span>

                      {completedCount > 0 && (
                        <button
                          type="button"
                          onClick={handleReset}
                          title={`Reset ${selectedSkill} progress`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-muted)] shadow-xs transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset progress
                        </button>
                      )}

                      {completedCount === totalCount && totalCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          <Award className="h-3.5 w-3.5" /> Journey Complete!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Framer Motion Animated Progress Bar */}
                  <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full border border-[var(--color-line)] bg-[var(--color-accent-faint)]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[var(--color-accent)] to-[var(--color-accent-strong)] shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,252,245,0.98),rgba(255,248,232,0.82))] px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
                  {/* Desktop Central Path - Base dashed */}
                  <div className="pointer-events-none absolute bottom-12 left-1/2 top-12 hidden w-[3px] -translate-x-1/2 border-l-[3px] border-dashed border-[rgba(221,144,38,0.35)] lg:block" />

                  {/* Desktop Central Path - Dynamic Active Progress Fill */}
                  <div className="pointer-events-none absolute bottom-12 left-1/2 top-12 hidden w-[5px] -translate-x-1/2 overflow-hidden rounded-full lg:block">
                    <motion.div
                      className="w-full bg-gradient-to-b from-amber-400 via-[var(--color-accent)] to-[var(--color-accent-strong)] shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${lineProgressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Mobile Left Path */}
                  <div className="pointer-events-none absolute bottom-8 left-8 top-8 w-[3px] border-l-[3px] border-dashed border-[rgba(221,144,38,0.35)] sm:left-10 lg:hidden" />
                  <div className="pointer-events-none absolute bottom-8 left-8 top-8 w-[4px] overflow-hidden rounded-full sm:left-10 lg:hidden">
                    <motion.div
                      className="w-full bg-gradient-to-b from-amber-400 to-[var(--color-accent-strong)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${lineProgressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="relative">
                    {subtopics.map((topic, index) => {
                      const stageNumber = String(index + 1).padStart(2, '0');
                      const isLeft = index % 2 === 0;
                      const isCompleted = completedStages.has(index);
                      const isCurrent = index === currentStageIndex;
                      const isExpanded = index === expandedStageIndex;

                      return (
                        <MotionDiv
                          key={`${topic}-${index}`}
                          data-stage-index={index}
                          ref={(el) => (stageRefs.current[index] = el)}
                          initial={{
                            opacity: 0,
                            x: isLeft ? -30 : 30,
                            y: 20,
                          }}
                          whileInView={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                          }}
                          viewport={{
                            once: true,
                            amount: 0.15,
                          }}
                          transition={{
                            duration: 0.55,
                            delay: Math.min(index * 0.04, 0.25),
                          }}
                          className="relative my-6 lg:grid lg:min-h-[190px] lg:grid-cols-[1fr_90px_1fr] lg:items-center"
                        >
                          {/* Desktop Left Card Slot */}
                          <div className="hidden lg:block">
                            {isLeft && (
                              <div className="pr-10">
                                <RoadmapCard
                                  stageNumber={stageNumber}
                                  topic={topic}
                                  isCompleted={isCompleted}
                                  isCurrent={isCurrent}
                                  isExpanded={isExpanded}
                                  onToggleExpand={() => toggleExpandStage(index)}
                                  onToggleComplete={() => toggleCompleteStage(index)}
                                />
                              </div>
                            )}
                          </div>

                          {/* Milestone Icon Center */}
                          <div
                            onClick={() => toggleExpandStage(index)}
                            className="relative z-20 flex cursor-pointer items-center justify-center py-2"
                          >
                            {/* Pulse Glow for current stage */}
                            {isCurrent && (
                              <div className="absolute h-20 w-20 animate-pulse rounded-full bg-[rgba(245,158,11,0.22)] blur-lg" />
                            )}

                            <div
                              className={`relative flex h-14 w-14 items-center justify-center rounded-full border-[5px] transition-all duration-300 ${
                                isCompleted
                                  ? 'border-emerald-100 bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                                  : isCurrent
                                  ? 'scale-110 border-white bg-gradient-to-tr from-[var(--color-accent-strong)] to-amber-400 text-white shadow-[0_0_0_4px_rgba(245,158,11,0.3),0_8px_25px_rgba(180,83,9,0.3)]'
                                  : 'border-white bg-amber-100/80 text-[var(--color-accent-strong)] shadow-sm hover:scale-105'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="h-6 w-6 stroke-[3]" />
                              ) : (
                                <span className="text-sm font-black">{stageNumber}</span>
                              )}
                            </div>
                          </div>

                          {/* Desktop Right Card Slot */}
                          <div className="hidden lg:block">
                            {!isLeft && (
                              <div className="pl-10">
                                <RoadmapCard
                                  stageNumber={stageNumber}
                                  topic={topic}
                                  isCompleted={isCompleted}
                                  isCurrent={isCurrent}
                                  isExpanded={isExpanded}
                                  onToggleExpand={() => toggleExpandStage(index)}
                                  onToggleComplete={() => toggleCompleteStage(index)}
                                />
                              </div>
                            )}
                          </div>

                          {/* Mobile Card Layout */}
                          <div className="ml-14 py-2 lg:hidden sm:ml-16">
                            <RoadmapCard
                              stageNumber={stageNumber}
                              topic={topic}
                              isCompleted={isCompleted}
                              isCurrent={isCurrent}
                              isExpanded={isExpanded}
                              onToggleExpand={() => toggleExpandStage(index)}
                              onToggleComplete={() => toggleCompleteStage(index)}
                            />
                          </div>
                        </MotionDiv>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isDetailsLoading && !detailsError && !selectedSkillDetails && (
          <div className="mt-7 rounded-[1.2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,255,255,0.75)] px-5 py-6">
            <div className="flex items-start gap-3 text-[var(--color-muted)]">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-strong)]" />

              <p className="leading-7">
                Select any skill from the orbit above to view explanation and
                subtopics here.
              </p>
            </div>
          </div>
        )}
      </div>
    </MotionSection>
  );
}

export default SkillRoadmap;