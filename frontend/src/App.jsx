import { startTransition, useEffect, useRef, useState } from 'react';
import HeroSection from './components/HeroSection';
import OrbitalSkillViewer from './components/OrbitalSkillViewer';
import SkillRoadmap from './components/SkillRoadmap';
import FooterSection from './components/FooterSection';
import {
  getAllProgress,
  saveSkillProgress,
  clearSkillProgress,
} from './utils/progressStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleQuery, setRoleQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillDetails, setSkillDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [learningProgress, setLearningProgress] = useState(() => getAllProgress());

  const skillViewerRef = useRef(null);
  const roadmapRef = useRef(null);

  const currentRoleName = roadmapData?.name || selectedRole || 'Unknown Role';

  const handleProgressChange = (roleName, skillName, completedStages, totalStages) => {
    const updated = saveSkillProgress(roleName, skillName, completedStages, totalStages);
    setLearningProgress({ ...updated });
  };

  const handleResetProgress = (roleName, skillName) => {
    const updated = clearSkillProgress(roleName, skillName);
    setLearningProgress({ ...updated });
  };

  useEffect(() => {
    fetch(`${API_URL}/roles`)
      .then((res) => res.json())
      .then((data) => {
        setRoles(data.roles || []);
      })
      .catch((err) => console.error('Error fetching roles:', err));
  }, []);

  useEffect(() => {
    if (!roadmapData) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const element = skillViewerRef.current;
      if (!element) {
        return;
      }

      const top = window.scrollY + element.getBoundingClientRect().top - 20;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
      });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [roadmapData]);

  const filteredRoles = roles.filter((role) => role.toLowerCase().includes(roleQuery.toLowerCase()));

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRoleQuery(role);
    setIsRoleDropdownOpen(false);
  };

  const applySelectedFile = (nextFile) => {
    if (!nextFile) {
      return;
    }

    const isPdfFile =
      nextFile.type === 'application/pdf' || nextFile.name?.toLowerCase().endsWith('.pdf');

    if (!isPdfFile) {
      alert('Please upload a PDF resume.');
      return;
    }

    setFile(nextFile);
  };

  const handleFileChange = (e) => {
    applySelectedFile(e.target.files?.[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !selectedRole) {
      alert('Please upload a resume and select a role.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', selectedRole);

    try {
      const response = await fetch(`${API_URL}/analyze-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze resume. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Fallback to default message when response body is not JSON.
        }
        alert(errorMessage);
        return;
      }

      const data = await response.json();
      console.log('BACKEND RESPONSE:', data);
      startTransition(() => {
        setRoadmapData(data);
        setActiveCategory(null);
        setSelectedSkill('');
        setSkillDetails(null);
        setDetailsError('');
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Make sure the backend is running!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillClick = async (skill) => {
    if (!skill) {
      return;
    }

    setSelectedSkill(skill);
    setIsDetailsLoading(true);
    setDetailsError('');

    try {
      const params = new URLSearchParams({
        skill_name: skill,
        role_name: roadmapData?.name || 'Unknown Role',
      });
      const endpoints = [
        `${API_URL}/skill-details?${params.toString()}`
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
      window.scrollTo({
        top: roadmapRef.current?.offsetTop || 0,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Error fetching skill details:', error);
      setSkillDetails(null);
      setDetailsError('Unable to load skill details right now.');
      window.scrollTo({
        top: roadmapRef.current?.offsetTop || 0,
        behavior: 'smooth',
      });
    } finally {
      setIsDetailsLoading(false);
    }
  };

  return (
    <main className="bg-[var(--color-page)] text-[var(--color-ink)]">
      <HeroSection
        roles={roles}
        roleQuery={roleQuery}
        selectedRole={selectedRole}
        selectedFile={file}
        isRoleDropdownOpen={isRoleDropdownOpen}
        filteredRoles={filteredRoles}
        onRoleQueryChange={(query) => {
          setRoleQuery(query);
          setSelectedRole('');
          setIsRoleDropdownOpen(true);
        }}
        onRoleSelect={handleRoleSelect}
        onRoleFocus={() => setIsRoleDropdownOpen(true)}
        onRoleBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 100)}
        onFileChange={handleFileChange}
        onFileDrop={applySelectedFile}
        onClearFile={() => setFile(null)}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      <OrbitalSkillViewer
        key={roadmapData?.record_id || roadmapData?.name || 'orbital-empty'}
        roleData={roadmapData}
        foundSkills={roadmapData?.found_skills || []}
        roleName={currentRoleName}
        learningProgress={learningProgress}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSkillClick={handleSkillClick}
        isDetailsLoading={isDetailsLoading}
        sectionRef={skillViewerRef}
      />

      <div ref={roadmapRef}>
        <SkillRoadmap
          selectedSkill={selectedSkill}
          selectedSkillDetails={skillDetails}
          roleName={currentRoleName}
          learningProgress={learningProgress}
          onProgressChange={handleProgressChange}
          onResetProgress={handleResetProgress}
          detailsError={detailsError}
          isDetailsLoading={isDetailsLoading}
        />
      </div>

      <FooterSection />
    </main>
  );
}

export default App;
