// Main app for skill gap analysis
// By Ravish Kumar

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [role, setRole] = useState('Backend Developer');
  const [skills, setSkills] = useState('');
  const [data, setData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch news when page loads
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`);
      setNews(response.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const validateInput = () => {
    if (!skills.trim()) {
      setError('Please enter your current skills');
      return false;
    }
    setError('');
    return true;
  };

  const handleAnalyze = async () => {
    if (!validateInput()) return;

    setLoading(true);
    setError('');

    try {
      // Call both APIs at the same time
      const [gapRes, roadmapRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/api/skill-gap`, { role, skills }),
        axios.post(`${API_BASE_URL}/api/roadmap`, { role })
      ]);

      setData({ gap: gapRes.data, roadmap: roadmapRes.data });
    } catch (err) {
      console.error('Error analyzing career:', err);
      const errorMessage = err.response?.data?.message || 'Unable to connect to backend. Please ensure the server is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // RENDER UI
  // ========================================
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">SkillGap & Career AI</h1>
          <p className="text-slate-500">Analyze your profile, get a roadmap, and stay updated.</p>
        </header>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="space-y-4">
            {/* Target Role */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Target Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              >
                <option>Backend Developer</option>
                <option>Frontend Developer</option>
                <option>Data Analyst</option>
              </select>
            </div>

            {/* Current Skills */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Current Skills <span className="text-xs font-normal text-slate-400">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Java, SQL, HTML"
                value={skills}
                onChange={e => {
                  setSkills(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition ${error ? 'border-red-500' : 'border-slate-300'
                  }`}
              />
            </div>

            {/* Analyze Button */}
            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? '⏳ Analyzing...' : '🎯 Analyze My Career'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard - shows results after analysis */}
        {data && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Skill Gap Results */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-red-500 border-b pb-2">Skill Gap Analysis</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400">Matched</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.gap.matchedSkills.length > 0 ? data.gap.matchedSkills.map(s => (
                      <span key={s} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">{s}</span>
                    )) : <span className="text-sm text-slate-400">No matches found.</span>}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400">Missing</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.gap.missingSkills.map(s => (
                      <span key={s} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                {/* AI Recommendations */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 text-sm mb-2">💡 AI Recommendation</h3>
                  <p className="text-sm text-blue-700">{data.gap.recommendations[0] || "Good match!"}</p>
                </div>

                {/* Learning order */}
                {data.gap.suggestedLearningOrder && data.gap.suggestedLearningOrder.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-bold text-purple-800 text-sm mb-2">📚 Suggested Learning Order</h3>
                    <ol className="space-y-1 text-sm text-purple-700">
                      {data.gap.suggestedLearningOrder.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {skill}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>

            {/* Career Roadmap */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-blue-500 border-b pb-2">Career Roadmap</h2>
              <div className="space-y-4 relative pl-4 border-l-2 border-blue-100">
                {data.roadmap.roadmap.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <h3 className="font-bold text-slate-800">{step.phase}</h3>
                  </div>
                  </div>
              {/* AI Recommendations */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 text-sm mb-2">💡 AI Recommendation</h3>
                <p className="text-sm text-blue-700">{data.gap.recommendations[0] || "Good match!"}</p>
              </div>

              {/* Learning order */}
              {data.gap.suggestedLearningOrder && data.gap.suggestedLearningOrder.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-bold text-purple-800 text-sm mb-2">📚 Suggested Learning Order</h3>
                  <ol className="space-y-1 text-sm text-purple-700">
                    {data.gap.suggestedLearningOrder.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {skill}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>

              {/* Career Roadmap */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-blue-500 border-b pb-2">Career Roadmap</h2>
          <div className="space-y-4 relative pl-4 border-l-2 border-blue-100">
            {data.roadmap.roadmap.map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <h3 className="font-bold text-slate-800">{step.phase}</h3>
                <p className="text-sm text-slate-500">{step.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HackerNews Section - Bottom of Combined Dashboard */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">🔥 Latest Tech News (HackerNews)</h2>
        <div className="grid gap-4 md:grid-cols-1">
          {news.length === 0 ? <p className="text-slate-400">Loading news...</p> : news.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition group">
              <div>
                <a href={item.url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 group-hover:underline">{item.title}</a>
                <div className="text-xs text-slate-400 mt-1">
                  by {item.by} • {item.score} points • {item.type}
                </div>
              </div>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

      </div >
    </div >
  );
}
```
