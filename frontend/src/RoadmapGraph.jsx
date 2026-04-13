import React, { useMemo, useState } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence, motion } from 'framer-motion';
import CustomSkillNode from './CustomSkillNode';

const MotionDiv = motion.div;
const MotionAside = motion.aside;

const STATUS_META = {
  verified: {
    label: 'Verified',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="m4.5 10 3.3 3.2L15.5 6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  actionable: {
    label: 'Actionable',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9V6.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    cls: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  },
  locked: {
    label: 'Locked',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    cls: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
  },
};

const RoadmapGraph = ({ data }) => {
  const [selected, setSelected] = useState(null);

  const { nodes, edges } = useMemo(() => {
    const initialNodes = [];
    const initialEdges = [];
    
    // 1. Process Found Skills (Verified) - GREEN
    data.found_skills.forEach((skill, i) => {
      initialNodes.push({
        id: `verified-${skill}`,
        type: 'skill',
        data: {
          label: skill,
          skill,
          status: 'verified',
          requires: [],
          blocking_prereqs: [],
        },
        position: { x: i * 220, y: 0 },
        sourcePosition: 'bottom', // Force arrows out the bottom
        targetPosition: 'top',
      });
    });

    // 2. Process Phase 1 (Actionable) - BLUE
    data.roadmap.phase_1_immediate.forEach((item, i) => {
      initialNodes.push({
        id: `phase1-${item.skill}`,
        type: 'skill',
        data: {
          label: item.skill,
          skill: item.skill,
          status: 'actionable',
          requires: item.requires ?? [],
          blocking_prereqs: [],
        },
        position: { x: i * 220 + 100, y: 200 }, // Staggered layout
        sourcePosition: 'bottom',
        targetPosition: 'top',
      });
      
      item.requires.forEach(req => {
        initialEdges.push({ 
          id: `e-phase1-${req}-${item.skill}`, 
          source: `verified-${req}`, 
          target: `phase1-${item.skill}`, 
          type: 'smoothstep',
          style: { stroke: 'url(#edge-accent)', strokeWidth: 1.7, opacity: 0.75 },
        });
      });
    });

    // 3. Process Phase 2 (Locked) - GRAY/RED
    data.roadmap.phase_2_locked.forEach((item, i) => {
      const lockedNodeId = `phase2-${item.skill}`;
      initialNodes.push({
        id: lockedNodeId,
        type: 'skill',
        data: {
          label: item.skill,
          skill: item.skill,
          status: 'locked',
          requires: item.requires ?? [],
          blocking_prereqs: item.blocking_prereqs ?? [],
        },
        position: { x: i * 220 + 50, y: 400 },
        sourcePosition: 'bottom',
        targetPosition: 'top',
      });

      item.requires.forEach(req => {
        const isBlocking = item.blocking_prereqs.includes(req);
        const sourceFromVerified = data.found_skills.includes(req) ? `verified-${req}` : `phase1-${req}`;
        initialEdges.push({ 
          id: `e-phase2-${req}-${item.skill}`, 
          source: sourceFromVerified, 
          target: lockedNodeId, 
          type: 'smoothstep',
          style: isBlocking
            ? { stroke: 'url(#edge-muted)', strokeWidth: 1.8, strokeDasharray: '7 6', opacity: 0.3 }
            : { stroke: 'url(#edge-accent)', strokeWidth: 1.7, opacity: 0.7 },
        });
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [data]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F10] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-30px_80px_-70px_rgba(0,0,0,0.9)]">
      <MotionDiv
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1] }}
        style={{ height: '520px' }}
        className="w-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-right"
          nodeTypes={{ skill: CustomSkillNode }}
          onNodeClick={(_, node) => setSelected(node)}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          nodesDraggable={false}
        >
          <Background color="rgba(255,255,255,0.06)" gap={22} size={1} />
          <svg className="h-0 w-0">
            <defs>
              <linearGradient id="edge-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#6366F1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="edge-muted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </ReactFlow>
      </MotionDiv>

      <AnimatePresence>
      {selected ? (
        <MotionAside
          key={selected.id}
          initial={{ y: 12, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 8, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="absolute right-6 top-6 z-20 w-[340px] rounded-2xl border border-white/10 bg-[#121214]/95 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
        >
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold tracking-widest text-white/45">
                    SKILL DETAILS
                  </div>
                  <div className="mt-1 truncate text-lg font-bold text-white/90">
                    {selected.data?.skill ?? selected.data?.label ?? selected.id}
                  </div>
                  <div className="mt-2">
                    {(() => {
                      const status = selected.data?.status ?? 'locked';
                      const meta = STATUS_META[status];
                      return (
                        <span className={['inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold border', meta.cls].join(' ')}>
                          {meta.icon}
                          {meta.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-sm text-white/60 hover:bg-white/[0.07] hover:text-white/90 transition-colors"
                  aria-label="Close sidebar"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="px-5 py-5">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/45">Status</div>
                  <div className="mt-1 text-sm font-medium text-white/85">
                    {selected.data?.status === 'verified'
                      ? 'Verified'
                      : selected.data?.status === 'actionable'
                        ? 'Actionable'
                        : 'Locked'}
                  </div>
                </div>

                {selected.data?.status === 'locked' && selected.data?.blocking_prereqs?.length ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="text-sm font-semibold text-white/90">Missing prerequisites</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.data.blocking_prereqs.map((p) => (
                        <span key={p} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white/80">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/55">
                    No blocking prerequisites for this skill.
                  </div>
                )}
              </div>
            </div>
          </MotionAside>
      ) : null}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapGraph;