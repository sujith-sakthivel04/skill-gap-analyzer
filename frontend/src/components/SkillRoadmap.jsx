import { motion } from 'framer-motion';
import { AlertCircle, BookOpen, Loader2, Sparkles } from 'lucide-react';

const MotionSection = motion.section;
const MotionDiv = motion.div;

function SkillRoadmap({
  selectedSkill,
  selectedSkillDetails,
  detailsError,
  isDetailsLoading,
}) {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="px-5 pb-12 pt-4 sm:px-8 lg:px-10 lg:pb-16"
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

        {isDetailsLoading ? (
          <MotionDiv
            className="mt-7 flex items-center gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white px-5 py-4 text-[var(--color-muted)]"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading skill details...
          </MotionDiv>
        ) : detailsError ? (
          <div className="mt-7 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{detailsError}</p>
            </div>
          </div>
        ) : selectedSkillDetails ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/85 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-strong)]">
                Description
              </p>
              <p className="mt-3 text-base leading-7 text-[var(--color-ink-soft)]">
                {selectedSkillDetails.description || 'No description available for this skill yet.'}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/85 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-strong)]">
                Subtopics
              </p>
              {selectedSkillDetails.subtopics?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSkillDetails.subtopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-[var(--color-line)] bg-[var(--color-accent-faint)] px-3 py-1.5 text-sm text-[var(--color-ink-soft)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--color-muted)]">No subtopics available yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-7 rounded-[1.2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,255,255,0.75)] px-5 py-6">
            <div className="flex items-start gap-3 text-[var(--color-muted)]">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-strong)]" />
              <p className="leading-7">
                Select any skill from the orbit above to view explanation and subtopics here.
              </p>
            </div>
          </div>
        )}
      </div>
    </MotionSection>
  );
}

export default SkillRoadmap;
