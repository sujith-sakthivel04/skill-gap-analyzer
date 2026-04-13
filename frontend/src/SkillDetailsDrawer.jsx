import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SkillDetailsDrawer = ({ isOpen, onClose, skillName, details, isLoading, error }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-900/95 backdrop-blur-md border-l border-slate-800 z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
          >
            <motion.div
              className="h-full overflow-y-auto p-6 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.08 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Skill Details</p>
                  <h3 className="text-2xl font-semibold text-white">{skillName || 'Skill'}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
                  aria-label="Close skill details drawer"
                >
                  X
                </button>
              </div>

              {isLoading ? (
                <p className="text-slate-300">Loading details...</p>
              ) : error ? (
                <p className="text-rose-300">{error}</p>
              ) : (
                <>
                  <p className="text-slate-200 leading-7 mb-8">{details?.description || 'No description available yet.'}</p>
                  <div>
                    <h4 className="text-sm uppercase tracking-[0.14em] text-slate-400 mb-4">Subtopics</h4>
                    <div className="flex flex-wrap gap-2">
                      {(details?.subtopics || []).map((topic, idx) => (
                        <span
                          key={`${topic}-${idx}`}
                          className="px-3 py-1.5 text-sm rounded-full bg-slate-800 border border-slate-700 text-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SkillDetailsDrawer;
