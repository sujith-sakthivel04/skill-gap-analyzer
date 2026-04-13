import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const STATUS = {
  VERIFIED: 'verified',
  ACTIONABLE: 'actionable',
  LOCKED: 'locked',
};

const CheckIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path d="m4.5 10 3.3 3.2L15.5 6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UnlockIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9V6.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LockIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function StatusPill({ status }) {
  const label =
    status === STATUS.VERIFIED
      ? 'Verified'
      : status === STATUS.ACTIONABLE
        ? 'Actionable'
        : 'Locked';

  const cls =
    status === STATUS.VERIFIED
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : status === STATUS.ACTIONABLE
        ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
        : 'border-slate-500/40 bg-slate-500/10 text-slate-300';

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide',
        cls,
      ].join(' ')}
    >
      {status === STATUS.VERIFIED ? <CheckIcon /> : status === STATUS.ACTIONABLE ? <UnlockIcon /> : <LockIcon />}
      {label}
    </span>
  );
}

export default function CustomSkillNode({ data, selected }) {
  const status = data?.status ?? STATUS.LOCKED;
  const label = data?.label ?? data?.skill ?? 'Skill';

  const chrome =
    status === STATUS.VERIFIED
      ? 'before:bg-emerald-500'
      : status === STATUS.ACTIONABLE
        ? 'before:bg-indigo-500'
        : 'before:bg-slate-500';

  const glow =
    status === STATUS.VERIFIED
      ? '0 0 0 1px rgba(16,185,129,0.30), 0 0 22px rgba(16,185,129,0.22)'
      : status === STATUS.ACTIONABLE
        ? '0 0 0 1px rgba(99,102,241,0.35), 0 0 24px rgba(99,102,241,0.25)'
        : '0 0 0 1px rgba(71,85,105,0.35), 0 0 18px rgba(71,85,105,0.18)';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border !border-white/20 !bg-[#0F0F10]"
      />

      <MotionDiv
        initial={false}
        whileHover={{
          y: -4,
          boxShadow: glow,
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 24, mass: 0.7 }}
        className={[
          'relative w-[230px] rounded-xl px-4 py-3',
          'bg-[#111113] border border-white/10',
          'text-white/90',
          'transition-shadow duration-200 will-change-transform',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_20px_-18px_rgba(0,0,0,0.9)]',
          'before:absolute before:left-0 before:top-0 before:h-[1px] before:w-full before:rounded-t-xl before:content-[""]',
          chrome,
          selected ? 'ring-1 ring-white/25' : '',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={[
                'inline-flex h-6 w-6 items-center justify-center rounded-full border',
                status === STATUS.VERIFIED
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                  : status === STATUS.ACTIONABLE
                    ? 'border-indigo-500/35 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-500/35 bg-slate-500/10 text-slate-300',
              ].join(' ')}>
                {status === STATUS.VERIFIED ? <CheckIcon /> : status === STATUS.ACTIONABLE ? <UnlockIcon /> : <LockIcon />}
              </span>
              <div className="truncate text-[13px] font-semibold tracking-tight">{label}</div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StatusPill status={status} />
              {status === STATUS.LOCKED && data?.blocking_prereqs?.length ? (
                <span className="text-[11px] text-white/45">
                  {data.blocking_prereqs.length} prereq
                  {data.blocking_prereqs.length === 1 ? '' : 's'}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </MotionDiv>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border !border-white/20 !bg-[#0F0F10]"
      />
    </div>
  );
}

