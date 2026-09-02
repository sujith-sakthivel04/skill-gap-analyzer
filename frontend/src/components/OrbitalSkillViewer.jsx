import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Orbit, PlayCircle, Sparkles } from 'lucide-react';
import { getRoleVideo } from '../data/roleVideoLibrary';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const categories = [
  {
    key: 'Foundational',
    label: 'Foundational',
    shortLabel: 'Foundational',
    description: 'These are the base skills that support everything else in the role.',
    shape: 'polygon(12% 0%, 86% 0%, 100% 22%, 100% 78%, 88% 100%, 14% 100%, 0% 76%, 0% 22%)',
    desktop: {
      top: '8%',
      left: '47%',
      width: '178px',
      minHeight: '90px',
    },
    preview: {
      top: '9%',
      left: '57%',
    },
    mobileOrder: 0,
  },
  {
    key: 'Specialization',
    label: 'Specialization',
    shortLabel: 'Specialization',
    description: 'This is the deeper role-specific layer where the work becomes more domain-driven.',
    shape: 'polygon(10% 0%, 90% 0%, 100% 18%, 100% 72%, 84% 100%, 14% 100%, 0% 78%, 0% 24%)',
    desktop: {
      top: '35%',
      left: '6%',
      width: '232px',
      minHeight: '122px',
    },
    preview: {
      top: '40%',
      left: '25%',
    },
    mobileOrder: 1,
  },
  {
    key: 'Tools',
    label: 'Tools',
    shortLabel: 'Tools',
    description: 'These are the libraries and platforms used to apply the skill set in practice.',
    shape: 'polygon(18% 0%, 82% 0%, 100% 28%, 100% 76%, 80% 100%, 20% 100%, 0% 72%, 0% 20%)',
    desktop: {
      top: '69%',
      left: '56%',
      width: '156px',
      minHeight: '90px',
    },
    preview: {
      top: '73%',
      left: '66%',
    },
    mobileOrder: 2,
  },
];

const categoryMap = {
  Foundational: 'core_skills',
  Specialization: 'advanced_skills',
  Tools: 'tools_and_libraries',
};

const desktopOrbitPath = 'M392 0C320 54 262 112 203 182C142 255 106 331 118 413C129 492 193 569 283 639C358 697 401 759 430 840';
const mobileOrbitPath = 'M232 0C182 46 142 99 96 164C55 225 39 287 52 350C66 413 112 478 177 536C226 582 258 631 282 700';

function OrbitalSkillViewer({
  roleData,
  foundSkills,
  roleName,
  learningProgress,
  activeCategory,
  onCategoryChange,
  onSkillClick,
  isDetailsLoading,
  sectionRef,
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [panelMode, setPanelMode] = useState(roleData?.name ? 'video' : 'empty');

  const normalizedFoundSkills = new Set((foundSkills || []).map((skill) => String(skill).trim().toLowerCase()));
  const activeKey = categoryMap[activeCategory];
  const activeSkills = activeKey ? roleData?.[activeKey] || [] : [];
  const effectiveRoleName = roleName || roleData?.name || 'Selected role';
  const roleVideo = getRoleVideo(effectiveRoleName);
  const previewCategory =
    categories.find((category) => category.key === hoveredCategory) ||
    categories.find((category) => category.key === activeCategory) ||
    categories[1];
  const activeCategoryMeta = categories.find((category) => category.key === activeCategory);

  const openCategory = (categoryKey) => {
    onCategoryChange(categoryKey);
    setPanelMode('skills');
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,250,238,1),rgba(255,255,255,1)_28%,rgba(255,250,241,1)_100%)] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_55%)]" />

      <div
        ref={sectionRef}
        className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-stretch lg:gap-16"
      >
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="relative min-h-[640px] overflow-hidden rounded-[2.25rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,250,237,0.84))] p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:min-h-[760px] lg:p-10"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
              <Orbit className="h-4 w-4" />
              Skill browser
            </div>

            <h2 className="font-display mt-6 text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Explore the role through a sharper interactive orbit.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              The curve on the right behaves like a structured skill rail. Hover or click any block to
              preview the layer, then open the skills that belong to it.
            </p>
          </div>

          <div className="mt-10 flex min-h-[560px] flex-col rounded-[1.9rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.78)] p-5 sm:min-h-[620px] sm:p-6 lg:mt-12 lg:min-h-[680px] lg:p-7">
            {!roleData ? (
              <div className="relative flex h-full flex-col items-start justify-between overflow-hidden rounded-[1.55rem] border border-dashed border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,252,247,1),rgba(255,248,234,0.92))] p-6 sm:p-8">
                <div className="pointer-events-none absolute right-[-4rem] top-[14%] h-48 w-48 rounded-full border border-[rgba(245,158,11,0.16)]" />
                <div className="pointer-events-none absolute right-[2.8rem] top-[28%] h-28 w-28 rounded-full border border-[rgba(245,158,11,0.2)]" />
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-strong)]">
                    Waiting for your choice
                  </p>
                  <p className="mt-5 max-w-lg text-2xl leading-relaxed text-[var(--color-ink-soft)] sm:text-[2rem]">
                    The content panel is intentionally empty right now. Pick a category from the curve to reveal the skills.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-muted)]">
                  <Sparkles className="h-4 w-4 text-[var(--color-accent-strong)]" />
                  Verified and missing skills will appear here after selection.
                </div>
              </div>
            ) : panelMode === 'video' ? (
              <div className="flex h-full flex-col">
                <div className="flex flex-col gap-4 border-b border-[var(--color-line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-strong)]">
                      Role video
                    </p>
                    <p className="mt-3 max-w-xl text-lg leading-7 text-[var(--color-muted)]">
                      Start with a quick YouTube overview for {effectiveRoleName}, then jump into the orbit
                      when you want to inspect the required skills.
                    </p>
                  </div>
                  <div className="rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-muted)]">
                    Video first
                  </div>
                </div>

                <div className="mt-6 flex h-full flex-col gap-6">
                  <div className="overflow-hidden rounded-[1.7rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.85)] shadow-[var(--shadow-card)]">
                    <div className="aspect-video h-full min-h-[260px] w-full bg-[rgba(28,25,23,0.04)] sm:min-h-[300px] lg:min-h-[330px]">
                      <iframe
                        className="h-full w-full"
                        src={roleVideo.embedUrl}
                        title={`${effectiveRoleName} YouTube overview`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 rounded-[1.45rem] border border-[var(--color-line)] bg-white/88 p-5 sm:p-6">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
                        Now playing
                      </p>
                      <p className="mt-3 text-lg font-semibold leading-7 text-[var(--color-ink)] sm:text-[1.25rem]">
                        {roleVideo.title}
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        {roleVideo.channel}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--color-accent-strong)]">
                        {roleVideo.socialProof}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <a
                        href={roleVideo.watchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Open on YouTube
                      </a>
                      <a
                        href={roleVideo.searchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-accent-faint)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-strong)] transition hover:border-[var(--color-accent)]"
                      >
                        More {effectiveRoleName} videos
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex flex-col gap-6 border-b border-[var(--color-line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setPanelMode('video')}
                      className="inline-flex min-h-[50px] items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-accent-strong)] shadow-[var(--shadow-card)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-faint)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to video
                    </button>
                    <div className="mt-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-strong)]">
                        {activeCategoryMeta?.label}
                      </p>
                      <p className="mt-3 max-w-xl text-lg leading-7 text-[var(--color-muted)]">
                        {activeCategoryMeta?.description}
                      </p>
                    </div>
                  </div>
                  <div className="self-start rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-muted)] sm:self-auto">
                    {activeSkills.length} skill{activeSkills.length === 1 ? '' : 's'}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 overflow-y-auto pr-1">
                  {activeSkills.map((skill, index) => {
                    const isFound = normalizedFoundSkills.has(String(skill).trim().toLowerCase());

                    // Calculate role-aware learning status
                    const skillProg = learningProgress?.[effectiveRoleName]?.[skill] || null;
                    const completedCount = Array.isArray(skillProg?.completedStages) ? skillProg.completedStages.length : 0;
                    const totalStages = typeof skillProg?.totalStages === 'number' ? skillProg.totalStages : 0;
                    const isLearned = totalStages > 0 && completedCount >= totalStages;
                    const isInProgress = completedCount > 0 && !isLearned;
                    const percent = totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0;

                    let badgeText = '';
                    let badgeClass = '';
                    let badgeSubtitle = '';

                    if (isFound) {
                      if (isLearned) {
                        badgeText = 'Completed';
                        badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
                      } else if (isInProgress) {
                        badgeText = 'Verified';
                        badgeSubtitle = `Learning ${percent}%`;
                        badgeClass = 'bg-[rgba(16,185,129,0.12)] text-emerald-700 border border-emerald-200';
                      } else {
                        badgeText = 'Verified';
                        badgeClass = 'bg-[rgba(16,185,129,0.12)] text-emerald-700';
                      }
                    } else {
                      if (isLearned) {
                        badgeText = 'Learned';
                        badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
                      } else if (isInProgress) {
                        badgeText = 'In Progress';
                        badgeSubtitle = percent > 0 ? `${percent}% done` : '';
                        badgeClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
                      } else {
                        badgeText = 'Missing';
                        badgeClass = 'bg-[var(--color-accent-faint)] text-[var(--color-accent-strong)]';
                      }
                    }

                    return (
                      <MotionButton
                        key={skill}
                        type="button"
                        onClick={() => onSkillClick(skill)}
                        whileHover={{ x: 4 }}
                        className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.35rem] border border-[var(--color-line)] bg-white/82 px-4 py-4 text-left shadow-[var(--shadow-card)] transition hover:border-[var(--color-accent)] hover:bg-white sm:px-5"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-faint)] text-sm font-semibold text-[var(--color-accent-strong)]">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <p className="text-lg font-medium text-[var(--color-ink)]">{skill}</p>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">
                            {isFound
                              ? isLearned
                                ? 'Evidenced in resume • Learning journey completed.'
                                : isInProgress
                                ? `Evidenced in resume • In progress (${completedCount}/${totalStages} stages).`
                                : 'Already evidenced in the uploaded resume.'
                              : isLearned
                              ? 'Missing from resume • Completed learning journey!'
                              : isInProgress
                              ? `Missing from resume • In progress (${completedCount}/${totalStages} stages).`
                              : 'Recommended next area to strengthen.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClass}`}
                            >
                              {badgeText}
                            </span>
                            {badgeSubtitle && (
                              <span className="mt-1 text-[0.7rem] font-bold text-[var(--color-accent-strong)]">
                                {badgeSubtitle}
                              </span>
                            )}
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[var(--color-muted)] transition group-hover:text-[var(--color-accent-strong)]" />
                        </div>
                      </MotionButton>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isDetailsLoading && (
            <p className="mt-4 text-sm text-[var(--color-muted)]">Loading skill details after selection...</p>
          )}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="relative min-h-[720px] overflow-visible lg:min-h-[760px]"
        >
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <svg viewBox="0 0 500 840" className="h-full w-full">
              <path
                d={desktopOrbitPath}
                fill="none"
                stroke="rgba(245,158,11,0.09)"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d={desktopOrbitPath}
                fill="none"
                stroke="rgba(221,144,38,0.58)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 lg:hidden">
            <svg viewBox="0 0 320 720" className="h-full w-full">
              <path
                d={mobileOrbitPath}
                fill="none"
                stroke="rgba(245,158,11,0.1)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d={mobileOrbitPath}
                fill="none"
                stroke="rgba(221,144,38,0.52)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <MotionDiv
              animate={{
                top: previewCategory.preview.top,
                left: previewCategory.preview.left,
              }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(245,158,11,0.28)] bg-[rgba(255,255,255,0.72)] shadow-[0_0_0_12px_rgba(245,158,11,0.08)]"
            >
              <div className="absolute inset-[13px] rounded-full bg-[var(--color-accent)] shadow-[0_0_22px_rgba(245,158,11,0.48)]" />
            </MotionDiv>
          </div>

          <div className="pointer-events-none absolute bottom-10 left-8 right-8 hidden rounded-[1.6rem] border border-[var(--color-line)] bg-white/82 p-5 shadow-[var(--shadow-card)] lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-strong)]">
              Orbit focus
            </p>
            <p className="mt-3 text-xl font-semibold text-[var(--color-ink)]">{previewCategory.shortLabel}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {previewCategory.description}
            </p>
          </div>

          <div className="relative hidden h-full lg:block">
            {categories.map((category) => {
              const isActive = activeCategory === category.key;
              const isPreview = previewCategory.key === category.key;

              return (
                <MotionButton
                  key={category.key}
                  type="button"
                  onClick={() => openCategory(category.key)}
                  onMouseEnter={() => setHoveredCategory(category.key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={category.desktop}
                  whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.985 }}
                  animate={isActive ? { boxShadow: ['0 0 0 rgba(245,158,11,0)', '0 0 0 12px rgba(245,158,11,0.12)', '0 0 0 rgba(245,158,11,0)'] } : {}}
                  transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                  className="absolute isolate overflow-visible bg-transparent text-center shadow-none"
                >
                  <span
                    className={`pointer-events-none absolute left-2 top-2 -z-10 transition ${
                      isActive || isPreview ? 'opacity-100' : 'opacity-70'
                    }`}
                    style={{
                      width: '100%',
                      height: '100%',
                      clipPath: category.shape,
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(255,255,255,0.08))',
                      transform: isActive ? 'rotate(-3deg)' : 'rotate(-2deg)',
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute -left-2 -top-2 -z-10 transition ${
                      isActive || isPreview ? 'opacity-90' : 'opacity-60'
                    }`}
                    style={{
                      width: '100%',
                      height: '100%',
                      clipPath: category.shape,
                      border: '1px solid rgba(180,83,9,0.22)',
                      transform: isActive ? 'rotate(2deg)' : 'rotate(1deg)',
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute -inset-3 opacity-0 blur-xl transition ${
                      isActive || isPreview ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      clipPath: category.shape,
                      background: isActive
                        ? 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.34), rgba(245,158,11,0.02) 72%)'
                        : 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.18), rgba(245,158,11,0.01) 72%)',
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute inset-0 transition ${
                      isActive ? 'opacity-100' : isPreview ? 'opacity-95' : 'opacity-90'
                    }`}
                    style={{
                      clipPath: category.shape,
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.98), rgba(252,211,77,0.96))'
                        : isPreview
                          ? 'linear-gradient(135deg, rgba(255,233,181,0.96), rgba(255,248,228,0.95))'
                          : 'linear-gradient(135deg, rgba(255,239,205,0.8), rgba(255,255,255,0.96))',
                    }}
                  />
                  <span
                    className="pointer-events-none absolute inset-[3px]"
                    style={{
                      clipPath: category.shape,
                      background: isActive
                        ? 'linear-gradient(180deg, rgba(255,251,242,0.95), rgba(255,243,213,0.82))'
                        : isPreview
                          ? 'linear-gradient(180deg, rgba(255,252,245,0.96), rgba(255,245,221,0.86))'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,248,232,0.86))',
                    }}
                  />
                  <span
                    className="pointer-events-none absolute inset-[12px] opacity-80"
                    style={{
                      clipPath: category.shape,
                      border: '1px solid rgba(180,83,9,0.18)',
                    }}
                  />
                  <span
                    className="pointer-events-none absolute right-4 top-3 h-[6px] w-10 rounded-full"
                    style={{
                      background: isActive ? 'rgba(180,83,9,0.8)' : 'rgba(180,83,9,0.45)',
                    }}
                  />
                  <span
                    className="pointer-events-none absolute left-5 top-4 h-[2px] w-8 rounded-full"
                    style={{
                      background: isActive ? 'rgba(180,83,9,0.42)' : 'rgba(180,83,9,0.22)',
                    }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-3 left-4 h-3 w-3 rounded-full border border-[rgba(180,83,9,0.3)] bg-white/80"
                  />
                  <span
                    className="pointer-events-none absolute bottom-4 right-5 h-[2px] w-7 rotate-[-24deg] rounded-full bg-[rgba(180,83,9,0.34)]"
                  />
                  <span
                    className="pointer-events-none absolute left-6 top-1/2 h-[1px] w-10 -translate-y-1/2 rotate-[-28deg] rounded-full bg-[rgba(180,83,9,0.18)]"
                  />
                  <span
                    className="pointer-events-none absolute right-6 top-1/2 h-[1px] w-9 -translate-y-1/2 rotate-[28deg] rounded-full bg-[rgba(180,83,9,0.18)]"
                  />
                  <div className="relative z-10 flex h-full items-center justify-center px-8 py-6">
                    <div className="space-y-3">
                      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(180,83,9,0.16)] bg-white/55 px-3 py-1">
                        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-strong)]">
                          Layer
                        </p>
                      </div>
                      <span className={`block font-semibold leading-tight text-[var(--color-ink)] ${category.key === 'Specialization' ? 'text-[1.7rem]' : 'text-[1.35rem]'}`}>
                        {category.label}
                      </span>
                    </div>
                  </div>
                </MotionButton>
              );
            })}
          </div>

          <div className="relative flex h-full flex-col justify-center gap-5 lg:hidden">
            {categories
              .slice()
              .sort((a, b) => a.mobileOrder - b.mobileOrder)
              .map((category) => {
                const isActive = activeCategory === category.key;

                return (
                  <MotionButton
                    key={category.key}
                    type="button"
                    onClick={() => openCategory(category.key)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="relative isolate ml-auto mr-4 min-h-[84px] w-[72%] overflow-visible bg-transparent text-center shadow-none"
                  >
                    <span
                      className={`pointer-events-none absolute left-1.5 top-1.5 -z-10 transition ${
                        isActive ? 'opacity-100' : 'opacity-70'
                      }`}
                      style={{
                        width: '100%',
                        height: '100%',
                        clipPath: category.shape,
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(255,255,255,0.08))',
                        transform: 'rotate(-2deg)',
                      }}
                    />
                    <span
                      className={`pointer-events-none absolute -inset-2 opacity-0 blur-lg transition ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        clipPath: category.shape,
                        background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.28), rgba(245,158,11,0.02) 72%)',
                      }}
                    />
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        clipPath: category.shape,
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.98), rgba(252,211,77,0.96))'
                          : 'linear-gradient(135deg, rgba(255,239,205,0.8), rgba(255,255,255,0.96))',
                      }}
                    />
                    <span
                      className="pointer-events-none absolute inset-[3px]"
                      style={{
                        clipPath: category.shape,
                        background: isActive
                          ? 'linear-gradient(180deg, rgba(255,251,242,0.95), rgba(255,243,213,0.82))'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,248,232,0.86))',
                      }}
                    />
                    <span
                      className="pointer-events-none absolute inset-[10px] opacity-80"
                      style={{
                        clipPath: category.shape,
                        border: '1px solid rgba(180,83,9,0.18)',
                      }}
                    />
                    <span className="pointer-events-none absolute right-4 top-3 h-[6px] w-10 rounded-full bg-[rgba(180,83,9,0.45)]" />
                    <span className="pointer-events-none absolute bottom-3 left-4 h-3 w-3 rounded-full border border-[rgba(180,83,9,0.3)] bg-white/80" />
                    <div className="relative z-10 flex min-h-[84px] items-center justify-center px-6 py-4">
                      <div className="space-y-2">
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(180,83,9,0.16)] bg-white/55 px-3 py-1">
                          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-strong)]">
                            Layer
                          </p>
                        </div>
                        <span className="text-xl font-semibold text-[var(--color-ink)]">{category.label}</span>
                      </div>
                    </div>
                  </MotionButton>
                );
              })}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}

export default OrbitalSkillViewer;
