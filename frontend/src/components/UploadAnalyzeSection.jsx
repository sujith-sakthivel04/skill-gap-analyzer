import { motion } from 'framer-motion';
import { UploadCloud, Sparkles, CheckCircle2 } from 'lucide-react';
const MotionDiv = motion.div;
const MotionButton = motion.button;

function UploadAnalyzeSection({
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
  onClearFile,
  onAnalyze,
  isLoading,
}) {
  const hasFile = Boolean(selectedFile);

  return (
    <section className="bg-slate-50 px-8 py-28">
      <div className="mx-auto w-11/12 max-w-7xl">
        <MotionDiv
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-yellow-300/70 bg-white p-12 shadow-[0_30px_80px_-45px_rgba(234,179,8,0.6)] md:p-16"
        >
          <h2 className="text-5xl font-semibold text-slate-900 md:text-6xl">Upload & Analyze</h2>
          <p className="mt-5 max-w-5xl text-xl text-slate-600 md:text-2xl">
            Drop your resume, select your target role, and trigger a deeply personalized skill intelligence report.
          </p>

          <form onSubmit={onAnalyze} className="mt-14 grid gap-10">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <label className="mb-4 block text-xl font-semibold text-slate-700">Target Role</label>
                <div className="relative">
                  <input
                    type="text"
                    value={roleQuery}
                    onChange={(e) => onRoleQueryChange(e.target.value)}
                    onFocus={onRoleFocus}
                    onBlur={onRoleBlur}
                    placeholder="Search roles..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-6 py-5 text-xl text-slate-900 shadow-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  />
                  {isRoleDropdownOpen && (
                    <div className="absolute z-20 mt-3 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onMouseDown={() => onRoleSelect(role)}
                            className={`block w-full px-5 py-4 text-left text-lg transition hover:bg-yellow-50 ${
                              selectedRole === role ? 'bg-yellow-50 text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {role}
                          </button>
                        ))
                      ) : (
                        <p className="px-5 py-4 text-lg text-slate-500">No matching roles found.</p>
                      )}
                    </div>
                  )}
                </div>
                {roles.length === 0 && <p className="mt-3 text-base text-slate-500">Loading role options...</p>}
              </div>

              <div>
                <label className="mb-4 block text-xl font-semibold text-slate-700">Upload Resume (PDF/TXT)</label>
                <div className="min-h-[400px] rounded-xl border-2 border-dashed border-yellow-400/80 bg-yellow-50/60 p-16 text-slate-700 transition hover:bg-yellow-50">
                  {!hasFile ? (
                    <label className="flex h-full w-full cursor-pointer items-center justify-center gap-6">
                      <UploadCloud className="h-24 w-24 text-yellow-600" />
                      <span className="text-2xl font-medium">Drag and drop your resume here</span>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={onFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center">
                      <CheckCircle2 className="h-24 w-24 text-emerald-500" />
                      <p className="text-3xl font-bold text-slate-900">{selectedFile.name}</p>
                      <button
                        type="button"
                        onClick={onClearFile}
                        className="text-lg font-semibold text-yellow-700 underline underline-offset-4"
                      >
                        Change File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <MotionButton
              whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(250, 204, 21, 0.7)' }}
              whileTap={{ scale: 0.98 }}
              animate={
                hasFile && !isLoading
                  ? { scale: [1, 1.03, 1], boxShadow: ['0 0 0 rgba(250, 204, 21, 0)', '0 0 28px rgba(250, 204, 21, 0.75)', '0 0 0 rgba(250, 204, 21, 0)'] }
                  : { scale: 1, boxShadow: '0 0 0 rgba(250, 204, 21, 0)' }
              }
              transition={{ duration: 1.8, repeat: hasFile && !isLoading ? Infinity : 0, ease: 'easeInOut' }}
              type="submit"
              disabled={isLoading || !hasFile}
              className="inline-flex items-center justify-center gap-4 self-start rounded-xl bg-yellow-400 px-12 py-6 text-2xl font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              <Sparkles className="h-8 w-8" />
              {isLoading ? 'Analyzing...' : 'Analyze Resume'}
            </MotionButton>
          </form>
        </MotionDiv>
      </div>
    </section>
  );
}

export default UploadAnalyzeSection;
