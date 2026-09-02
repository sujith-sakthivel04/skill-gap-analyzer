const STORAGE_KEY = 'skill-gap-analyzer-progress';

/**
 * Safely retrieves all progress data from localStorage.
 * Returns an empty object on JSON parse failure or missing item.
 */
export function getAllProgress() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (err) {
    console.warn('Failed to parse skill learning progress from localStorage:', err);
    return {};
  }
}

/**
 * Retrieves progress metadata for a specific skill within a given role.
 */
export function getSkillProgress(roleName, skillName) {
  if (!roleName || !skillName) {
    return { completedStages: [], totalStages: 0 };
  }

  const all = getAllProgress();
  const roleProgress = all[roleName];
  if (!roleProgress || typeof roleProgress !== 'object') {
    return { completedStages: [], totalStages: 0 };
  }

  const skillData = roleProgress[skillName];
  if (!skillData || typeof skillData !== 'object') {
    return { completedStages: [], totalStages: 0 };
  }

  const completedStages = Array.isArray(skillData.completedStages)
    ? skillData.completedStages.filter((idx) => typeof idx === 'number' && idx >= 0)
    : [];

  return {
    completedStages,
    totalStages: typeof skillData.totalStages === 'number' ? skillData.totalStages : 0,
    updatedAt: skillData.updatedAt || null,
  };
}

/**
 * Saves completed stage indexes for a role & skill.
 */
export function saveSkillProgress(roleName, skillName, completedStages, totalStages = 0) {
  if (typeof window === 'undefined' || !window.localStorage || !roleName || !skillName) {
    return getAllProgress();
  }

  try {
    const all = getAllProgress();
    if (!all[roleName] || typeof all[roleName] !== 'object') {
      all[roleName] = {};
    }

    const validStages = Array.from(
      new Set(
        (Array.isArray(completedStages) ? completedStages : [])
          .filter((idx) => typeof idx === 'number' && idx >= 0)
      )
    ).sort((a, b) => a - b);

    all[roleName][skillName] = {
      completedStages: validStages,
      totalStages: typeof totalStages === 'number' ? totalStages : validStages.length,
      updatedAt: Date.now(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all;
  } catch (err) {
    console.warn('Failed to save skill progress to localStorage:', err);
    return getAllProgress();
  }
}

/**
 * Clears progress for a specific skill under a role.
 */
export function clearSkillProgress(roleName, skillName) {
  if (typeof window === 'undefined' || !window.localStorage || !roleName || !skillName) {
    return getAllProgress();
  }

  try {
    const all = getAllProgress();
    if (all[roleName] && typeof all[roleName] === 'object') {
      delete all[roleName][skillName];
      if (Object.keys(all[roleName]).length === 0) {
        delete all[roleName];
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
    return all;
  } catch (err) {
    console.warn('Failed to clear skill progress from localStorage:', err);
    return getAllProgress();
  }
}

/**
 * Helper to compute the learning status of a skill given optional total stage count.
 * Returns { status: 'NOT_STARTED' | 'IN_PROGRESS' | 'LEARNED', completedCount, totalStages, percent }
 */
export function getSkillLearningStatus(roleName, skillName, currentTotalStages = 0) {
  const { completedStages, totalStages: storedTotal } = getSkillProgress(roleName, skillName);
  const totalStages = currentTotalStages > 0 ? currentTotalStages : storedTotal;

  // Filter completed stages to within range if total stages is known
  const validCompleted = totalStages > 0
    ? completedStages.filter((idx) => idx < totalStages)
    : completedStages;

  const completedCount = validCompleted.length;
  const percent = totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0;

  let status = 'NOT_STARTED';
  if (totalStages > 0 && completedCount >= totalStages) {
    status = 'LEARNED';
  } else if (completedCount > 0) {
    status = 'IN_PROGRESS';
  }

  return {
    status,
    completedCount,
    totalStages,
    percent,
    completedStages: validCompleted,
  };
}
