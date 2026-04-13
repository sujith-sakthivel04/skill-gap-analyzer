import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data); 
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the backend. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      
      {/* HEADER & UPLOAD SECTION */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Skill Gap Analyzer</h1>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Upload your resume to generate a dependency-aware learning roadmap for a Data Scientist role.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
          />
          <button 
            onClick={handleUpload}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? "Analyzing Document..." : "Analyze Resume"}
          </button>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      {result && (
        <div className="max-w-4xl w-full space-y-6">
          
          {/* SECTION 1: Found Skills (The Magnet) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>✅</span> Verified Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.data.found_skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SECTION 2: Phase 1 (Immediate) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔓</span> Phase 1: Actionable
              </h2>
              <p className="text-sm text-gray-500 mb-4">Skills you have the prerequisites to start learning right now.</p>
              <div className="space-y-3">
                {result.data.roadmap.phase_1_immediate.map((item, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h3 className="font-bold text-blue-900">{item.skill}</h3>
                  </div>
                ))}
                {result.data.roadmap.phase_1_immediate.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No immediate skills identified.</p>
                )}
              </div>
            </div>

            {/* SECTION 3: Phase 2 (Locked) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔒</span> Phase 2: Locked
              </h2>
              <p className="text-sm text-gray-500 mb-4">Advanced skills blocked by missing prerequisites.</p>
              <div className="space-y-3">
                {result.data.roadmap.phase_2_locked.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden group">
                    <h3 className="font-bold text-gray-700">{item.skill}</h3>
                    <div className="mt-2 text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-1 rounded-md">
                      Requires: {item.blocking_prereqs.join(", ")}
                    </div>
                  </div>
                ))}
                 {result.data.roadmap.phase_2_locked.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No locked skills identified.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default App