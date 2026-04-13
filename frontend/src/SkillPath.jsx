import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SkillDetailsDrawer from './SkillDetailsDrawer';

const SkillPath = ({ roleData, foundSkills = [] }) => {
  // 1. Crash-proof fallback
  const data = roleData || {};
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [skillDetails, setSkillDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const isSkillFound = (skillName) =>
    (foundSkills || []).some(
      (fs) =>
        String(fs).toLowerCase().trim() === String(skillName).toLowerCase().trim()
    );

  // 2. Safe mapping with fallback arrays (|| [])
  const stages = [
    { 
      phase: "Foundations", 
      // If core_skills doesn't exist, safely use a fallback array instead of crashing
      skills: data.core_skills || ["Awaiting Data..."], 
      glow: "shadow-[0_0_15px_rgba(0,0,255,0.4)]",
      borderColor: "border-[#0000FF]"
    },
    { 
      phase: "Specialization", 
      skills: data.advanced_skills || ["Awaiting Data..."], 
      glow: "shadow-[0_0_15px_rgba(255,216,0,0.3)]",
      borderColor: "border-[#FFD800]"
    },
    { 
      phase: "Tooling", 
      skills: data.tools_and_libraries || ["Awaiting Data..."], 
      glow: "shadow-[0_0_15px_rgba(255,216,0,0.3)]",
      borderColor: "border-[#FFD800]"
    }
  ];

  // ... (Keep the rest of your framer-motion variants and the return statement exactly the same)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const handleSkillClick = async (skill) => {
    if (!skill || skill === "Awaiting Data...") {
      return;
    }

    setSelectedSkill(skill);
    setIsDrawerOpen(true);
    setIsDetailsLoading(true);
    setDetailsError('');

    try {
      const params = new URLSearchParams({
        skill_name: skill,
        role_name: data.name || "Unknown Role"
      });
      const endpoints = [
        `http://localhost:8000/skill-details?${params.toString()}`,
        `http://127.0.0.1:8000/skill-details?${params.toString()}`
      ];

      let details = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) {
            lastError = new Error(`Skill details request failed (${response.status}).`);
            continue;
          }
          details = await response.json();
          break;
        } catch (requestError) {
          lastError = requestError;
        }
      }

      if (!details) {
        throw lastError || new Error('Could not load skill details.');
      }

      setSkillDetails(details);
    } catch (error) {
      console.error("Error fetching skill details:", error);
      setSkillDetails(null);
      setDetailsError("Unable to load skill details right now.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-light tracking-wide text-white">
            Career Roadmap: <span className="font-semibold text-[#0000FF]">{data.name}</span>
          </h2>
          <p className="text-slate-400 mt-2">Dependency-aware progression path</p>
        </div>

        <motion.div 
          className="relative border-l-2 border-slate-700 ml-4 md:ml-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {stages.map((stage, index) => (
            <motion.div key={index} className="mb-12 pl-8 relative" variants={itemVariants}>
              {/* Timeline Dot */}
              <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 bg-slate-900 border-2 ${stage.borderColor} ${stage.glow}`}></div>
              
              <h3 className="text-xl font-medium mb-6 tracking-wider uppercase text-slate-300">
                {stage.phase}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.skills.map((skill, skillIndex) => (
                  (() => {
                    const isExistingSkill = isSkillFound(skill);
                    const skillCardClass = isExistingSkill
                      ? "bg-slate-800/40 backdrop-blur-md p-5 rounded-lg border border-emerald-500/30 opacity-70 shadow-emerald-500/50 transition-colors duration-300"
                      : `bg-slate-800/40 backdrop-blur-md p-5 rounded-lg border border-slate-700/50 hover:${stage.borderColor} transition-colors duration-300 ${stage.glow}`;

                    return (
                      <div 
                        key={skillIndex}
                        onClick={() => handleSkillClick(skill)}
                        className={skillCardClass}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            {skill}
                            {isExistingSkill && <span className="text-emerald-400">✓</span>}
                          </h4>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <span className="text-xs px-2 py-1 bg-slate-900/50 rounded-md text-slate-400 border border-slate-700">Subtopics</span>
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <SkillDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        skillName={selectedSkill}
        details={skillDetails}
        isLoading={isDetailsLoading}
        error={detailsError}
      />
    </div>
  );
};

export default SkillPath;