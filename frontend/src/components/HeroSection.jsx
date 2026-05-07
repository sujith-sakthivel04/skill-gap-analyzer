import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2, FileText, Orbit, Sparkles, UploadCloud } from 'lucide-react';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionButton = motion.button;

const promisePoints = [
  'Verify resume claims against the skills demanded by the target role.',
  'Reveal the next skills to learn in the order that actually makes sense.',
  'Explore a guided orbit of foundational, specialization, and tooling skills.',
];

function HeroSection({
  roles,
  roleQuery,
  selectedRole,
  selectedFile,
  isRoleDropdownOpen,
  filteredRoles,
  onRoleQueryChange,
  onRoleSelect,
  onRoleFocus,
  onRoleBlur,
  onFileChange,
  onFileDrop,
  onClearFile,
  onAnalyze,
  isLoading,
}) {
  const hasFile = Boolean(selectedFile);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragDepthRef = useRef(0);

  const handleDragEnter = (event) => {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragActive(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dragDepthRef.current = Math.max(dragDepthRef.current - 1, 0);
    if (dragDepthRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileDrop(droppedFile);
    }
  };

  return (
    <MotionSection
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24 lg:pt-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(120,113,108,0.1),transparent_24%),linear-gradient(180deg,rgba(255,252,245,1)_0%,rgba(255,250,238,1)_48%,rgba(255,248,233,1)_100%)]" />
      <div className="pointer-events-none absolute left-[6%] top-[8%] h-40 w-40 rounded-full border border-[var(--color-accent-soft)] bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-56 w-56 rounded-full bg-[rgba(245,158,11,0.12)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid min-h-[calc(100svh-3rem)] items-stretch gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <MotionDiv
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col justify-between rounded-[2.25rem] border border-[var(--color-line)] bg-[linear-gradient(140deg,rgba(255,255,255,0.95),rgba(255,249,235,0.86))] px-7 py-8 shadow-[var(--shadow-soft)] backdrop-blur md:px-10 md:py-10 lg:border-none lg:bg-transparent lg:px-4 lg:py-6 lg:shadow-none"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line-strong)] bg-white/80 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-strong)]">
                <Sparkles className="h-4 w-4" />
                Skill Gap Analyzer
              </div>

              <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[0.95] text-[var(--color-ink)] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                Turn a resume into a clear learning path you can actually follow.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                This app reads your resume, checks which skills are already supported by real evidence,
                and transforms the gap into an elegant, dependency-aware roadmap toward your next role.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {promisePoints.map((point, index) => (
                  <MotionDiv
                    key={point}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 + index * 0.1 }}
                    className="min-h-[172px] rounded-[1.75rem] border border-[var(--color-line)] bg-white/82 p-5 shadow-[var(--shadow-card)]"
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-faint)] text-[var(--color-accent-strong)]">
                      {index === 0 ? <FileText className="h-6 w-6" /> : index === 1 ? <CheckCircle2 className="h-6 w-6" /> : <Orbit className="h-6 w-6" />}
                    </div>
                    <p className="text-base leading-7 text-[var(--color-ink-soft)]">{point}</p>
                  </MotionDiv>
                ))}
              </div>
            </div>

            <MotionDiv
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="mt-10 rounded-[1.85rem] border border-[var(--color-line)] bg-[rgba(255,253,248,0.86)] px-6 py-5 shadow-[var(--shadow-card)] md:max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                <span>Why it feels trustworthy</span>
                <span className="h-px flex-1 bg-[var(--color-line)]" />
              </div>
              <p className="mt-4 text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                The experience is designed to go beyond resume buzzwords. It compares your resume against
                the role, highlights skills already evidenced, and surfaces the next learning steps in the
                order they should be tackled.
              </p>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, ease: 'easeOut', delay: 0.1 }}
            className="relative flex items-center"
          >
            <div className="absolute inset-x-[16%] top-[12%] hidden h-24 rounded-full border border-[var(--color-line)] bg-white/45 blur-2xl lg:block" />
            <div className="relative w-full rounded-[2.35rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,232,0.92))] p-6 shadow-[0_35px_120px_-50px_rgba(120,53,15,0.34)] sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
                  Start analysis
                </p>
                <h2 className="font-display mt-4 text-3xl leading-tight text-[var(--color-ink)] sm:text-[2.6rem]">
                  Upload your resume and let the orbit open below.
                </h2>
              </div>

              <form onSubmit={onAnalyze} className="mt-10 space-y-7">
                <div>
                  <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Target role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={roleQuery}
                      onChange={(e) => onRoleQueryChange(e.target.value)}
                      onFocus={onRoleFocus}
                      onBlur={onRoleBlur}
                      placeholder="Type or choose your target role"
                      className="w-full rounded-[1.35rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.96)] px-5 py-4 text-lg text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(245,158,11,0.14)]"
                    />

                    {isRoleDropdownOpen && (
                      <div className="absolute z-20 mt-3 max-h-72 w-full overflow-y-auto rounded-[1.35rem] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]">
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onMouseDown={() => onRoleSelect(role)}
                              className={`block w-full px-5 py-4 text-left text-base transition hover:bg-[var(--color-accent-faint)] ${
                                selectedRole === role ? 'bg-[var(--color-accent-faint)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
                              }`}
                            >
                              {role}
                            </button>
                          ))
                        ) : (
                          <p className="px-5 py-4 text-base text-[var(--color-muted)]">No matching roles found.</p>
                        )}
                      </div>
                    )}
                  </div>
                  {roles.length === 0 && <p className="mt-3 text-sm text-[var(--color-muted)]">Loading roles...</p>}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Resume PDF
                  </label>
                  <div className="rounded-[1.7rem] border border-dashed border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(255,252,244,1),rgba(255,247,225,0.9))] p-4 sm:p-5">
                    {!hasFile ? (
                      <label
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[1.35rem] border px-6 py-10 text-center transition ${
                          isDragActive
                            ? 'border-[rgba(245,158,11,0.44)] bg-white shadow-[0_0_0_8px_rgba(245,158,11,0.12)]'
                            : 'border-[rgba(245,158,11,0.18)] bg-white/65 hover:bg-white/85'
                        }`}
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-faint)] text-[var(--color-accent-strong)]">
                          <UploadCloud className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold text-[var(--color-ink)]">
                            {isDragActive ? 'Release to upload your resume' : 'Drop your resume here or browse'}
                          </p>
                          <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--color-muted)]">
                            Upload a PDF to analyze what you already know and what to learn next.
                          </p>
                        </div>
                        <input type="file" accept=".pdf" onChange={onFileChange} className="hidden" />
                      </label>
                    ) : (
                      <div
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex min-h-[280px] flex-col items-center justify-center rounded-[1.35rem] border px-6 py-10 text-center transition ${
                          isDragActive
                            ? 'border-[rgba(245,158,11,0.44)] bg-white shadow-[0_0_0_8px_rgba(245,158,11,0.12)]'
                            : 'border-transparent bg-white/80'
                        }`}
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(16,185,129,0.12)] text-emerald-600">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <p className="mt-5 max-w-md text-2xl font-semibold text-[var(--color-ink)]">{selectedFile.name}</p>
                        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                          {isDragActive
                            ? 'Release to replace the current resume with a new PDF.'
                            : 'Ready for analysis. You can also drop another PDF here to replace the current file.'}
                        </p>
                        <button
                          type="button"
                          onClick={onClearFile}
                          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-strong)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-faint)]"
                        >
                          Change file
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <MotionButton
                    whileHover={{ y: -2, boxShadow: '0 24px 55px -28px rgba(245, 158, 11, 0.7)' }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isLoading || !hasFile}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--color-accent)] px-7 py-4 text-base font-semibold text-[var(--color-button-ink)] transition disabled:cursor-not-allowed disabled:bg-[rgba(214,211,209,1)] disabled:text-[rgba(120,113,108,1)] sm:px-9"
                  >
                    <Sparkles className="h-5 w-5" />
                    {isLoading ? 'Analyzing resume...' : 'Analyze resume'}
                  </MotionButton>

                  <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <ArrowDown className="h-4 w-4 text-[var(--color-accent-strong)]" />
                    {selectedRole ? `Targeting ${selectedRole}. The skill orbit appears right below after analysis.` : 'The skill orbit appears right below after analysis.'}
                  </div>
                </div>
              </form>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}

export default HeroSection;
