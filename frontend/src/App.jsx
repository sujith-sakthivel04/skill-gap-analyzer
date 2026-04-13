import React, { useState, useEffect } from 'react';
import SkillPath from './SkillPath';

function App() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleQuery, setRoleQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available roles when the app loads
  useEffect(() => {
    fetch('http://localhost:8000/roles')
      .then((res) => res.json())
      .then((data) => {
        setRoles(data.roles || []);
        if (data.roles && data.roles.length > 0) {
          setSelectedRole(data.roles[0]);
          setRoleQuery(data.roles[0]);
        }
      })
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.toLowerCase().includes(roleQuery.toLowerCase())
  );

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRoleQuery(role);
    setIsRoleDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !selectedRole) {
      alert("Please upload a resume and select a role.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", selectedRole);

    try {
      const response = await fetch('http://localhost:8000/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to analyze resume. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch (_err) {
          // Fallback to default message when response body is not JSON.
        }
        alert(errorMessage);
        return;
      }

      const data = await response.json();
      console.log("BACKEND RESPONSE:", data);
      setRoadmapData(data); // This saves the backend data to state
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Make sure the backend is running!");
    } finally {
      setIsLoading(false);
    }
  };

  const resolvedFoundSkills = roadmapData?.found_skills || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto mb-12 bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-white text-center">Resume Analyzer</h1>
        
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-slate-400 mb-2">Target Role</label>
            <div className="relative">
              <input
                type="text"
                value={roleQuery}
                onChange={(e) => {
                  setRoleQuery(e.target.value);
                  setSelectedRole('');
                  setIsRoleDropdownOpen(true);
                }}
                onFocus={() => setIsRoleDropdownOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsRoleDropdownOpen(false), 100);
                }}
                placeholder="Search roles..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 focus:outline-none focus:border-[#0000FF]"
              />

              {isRoleDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/80 backdrop-blur-md shadow-xl">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleRoleSelect(role)}
                        className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/70 transition-colors"
                      >
                        {role}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-slate-400 text-sm">
                      No matching roles found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm text-slate-400 mb-2">Upload Resume (PDF/TXT)</label>
            <input 
              type="file" 
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded p-1.5 file:bg-slate-700 file:text-white file:border-0 file:px-4 file:py-1 file:rounded file:mr-4 hover:file:bg-slate-600 cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-2.5 bg-[#0000FF] hover:bg-blue-600 text-white rounded font-medium transition-colors disabled:bg-slate-600"
          >
            {isLoading ? "Analyzing..." : "Generate Roadmap"}
          </button>
        </form>
      </div>

      {/* Here is where we pass the real data into your beautiful UI! */}
      <SkillPath roleData={roadmapData} foundSkills={resolvedFoundSkills} />
      
    </div>
  );
}

export default App;