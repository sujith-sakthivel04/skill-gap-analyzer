const VIDEO_LIBRARY = {
  dataScience: {
    videoId: 'vStJoetOxJg',
    title: "How I'd Learn AI in 2024 (if I could start over)",
    channel: 'Dave Ebbelaar',
    socialProof: '1M+ views / 30K+ likes',
  },
  machineLearning: {
    videoId: 'vStJoetOxJg',
    title: "How I'd Learn AI in 2024 (if I could start over)",
    channel: 'Dave Ebbelaar',
    socialProof: '1M+ views / 30K+ likes',
  },
  frontend: {
    videoId: 'Tef1e9FiSR0',
    title: 'The Complete Frontend Developer Roadmap',
    channel: 'Programming with Mosh',
    socialProof: 'Popular roadmap from Programming with Mosh',
  },
  backend: {
    videoId: 'OeEHJgzqS1k',
    title: 'The Complete Backend Developer Roadmap',
    channel: 'Programming with Mosh',
    socialProof: '759K+ views / 20K likes',
  },
  devops: {
    videoId: '9pZ2xmsSDdo',
    title: 'DevOps Roadmap 2024 - How to become a DevOps Engineer',
    channel: 'TechWorld with Nana',
    socialProof: 'Popular roadmap from TechWorld with Nana',
  },
  dataAnalyst: {
    videoId: 'YRJbhFLLPyE',
    title: 'The Complete Data Analyst Roadmap',
    channel: 'Programming with Mosh',
    socialProof: 'Popular roadmap from Programming with Mosh',
  },
};

function buildSearchUrl(roleName) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${roleName} roadmap`)}`;
}

export function getRoleVideo(roleName) {
  const normalized = String(roleName || '').trim().toLowerCase();

  let preset = VIDEO_LIBRARY.dataScience;

  if (normalized.includes('frontend')) {
    preset = VIDEO_LIBRARY.frontend;
  } else if (normalized.includes('backend') || normalized.includes('full stack')) {
    preset = VIDEO_LIBRARY.backend;
  } else if (normalized.includes('devops') || normalized.includes('cloud') || normalized.includes('solutions architect')) {
    preset = VIDEO_LIBRARY.devops;
  } else if (
    normalized.includes('ml ') ||
    normalized.startsWith('ml') ||
    normalized.includes('machine learning') ||
    normalized.includes('mlops') ||
    normalized.includes('nlp') ||
    normalized.includes('computer vision') ||
    normalized.includes('generative ai') ||
    normalized.includes('ai research') ||
    normalized.includes('reinforcement learning')
  ) {
    preset = VIDEO_LIBRARY.machineLearning;
  } else if (
    normalized.includes('data analyst') ||
    normalized.includes('analytics engineer')
  ) {
    preset = VIDEO_LIBRARY.dataAnalyst;
  } else if (
    normalized.includes('data scientist') ||
    normalized.includes('data engineer') ||
    normalized.includes('big data')
  ) {
    preset = VIDEO_LIBRARY.dataScience;
  }

  return {
    ...preset,
    roleName,
    embedUrl: `https://www.youtube-nocookie.com/embed/${preset.videoId}?rel=0`,
    watchUrl: `https://www.youtube.com/watch?v=${preset.videoId}`,
    searchUrl: buildSearchUrl(roleName),
  };
}
