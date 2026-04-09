'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function ResumePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Load existing resume analysis
      loadResumeAnalysis();
    }
  }, [isAuthenticated]);

  const loadResumeAnalysis = async () => {
    try {
      const response = await apiClient.getResumeAnalysis(user?.id || 'demo-user');
      if (response.data) {
        setResumeData(response.data);
        setAtsScore(response.data?.atsScore);
      }
    } catch (err) {
      console.log('No existing resume found');
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      clearMessages();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    clearMessages();
    
    try {
      const response = await apiClient.uploadResume(file, user?.id || 'demo-user');
      if (response.success) {
        setSuccessMessage('✅ Profile saved! Resume uploaded and analyzed successfully!');
        setFile(null);
        setResumeData(response.data?.data);
        setAtsScore(response.data?.data?.atsScore);
        
        // Clear file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => {
          setSelectedTab('analyzer');
        }, 1500);
      } else {
        setErrorMessage(response.error || 'Upload failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred during upload');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomizeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setErrorMessage('Please paste a job description');
      return;
    }

    setIsLoading(true);
    clearMessages();
    
    try {
      const response = await apiClient.customizeResume(jobDescription, '');
      if (response.success) {
        setSuccessMessage('✅ Resume customized successfully! Check your downloads.');
      } else {
        setErrorMessage(response.error || 'Failed to customize');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Resume Manager</h1>
          <p className="text-purple-100 mt-2">Upload, analyze, and optimize your resume with AI</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {[
              { id: 'upload', label: '📤 Upload Resume', icon: '📤' },
              { id: 'analyzer', label: '📊 ATS Analysis', icon: '📊' },
              { id: 'customize', label: '✨ Customize', icon: '✨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-4 font-semibold text-center transition whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'border-b-4 border-blue-600 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="m-6 p-4 bg-green-50 border-l-4 border-green-600 text-green-700 rounded">
            <div className="font-semibold text-lg">{successMessage}</div>
          </div>
        )}

        {errorMessage && (
          <div className="m-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded">
            <div className="font-semibold">{errorMessage}</div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Upload Tab */}
          {selectedTab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer block">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-gray-900 font-semibold mb-2 text-lg">
                      {file ? `✅ ${file.name}` : 'Click to upload or drag PDF'}
                    </p>
                    <p className="text-gray-600 text-sm">PDF format recommended (max 10MB)</p>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  {isLoading ? '⏳ Analyzing...' : '🚀 Upload & Analyze'}
                </button>
              </form>
            </div>
          )}

          {/* Analysis Tab */}
          {selectedTab === 'analyzer' && (
            <div>
              {atsScore ? (
                <div className="space-y-8">
                  {/* ATS Score Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">ATS Compatibility Score</h2>
                      <div className="text-5xl font-bold text-blue-600">{atsScore.score}%</div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-6">
                      <div 
                        className={`h-full transition-all ${
                          atsScore.score >= 80 ? 'bg-green-500' : 
                          atsScore.score >= 60 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${atsScore.score}%` }}
                      />
                    </div>

                    {/* Feedback */}
                    {atsScore.feedback && atsScore.feedback.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-red-600 mb-3">Issues to Fix:</h3>
                        <ul className="space-y-2">
                          {atsScore.feedback.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-red-500 mr-3 mt-1">❌</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {atsScore.suggestions && atsScore.suggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-green-600 mb-3">Suggestions:</h3>
                        <ul className="space-y-2">
                          {atsScore.suggestions.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-500 mr-3 mt-1">💡</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Extracted Data */}
                  {resumeData?.extractedData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skills */}
                      {resumeData.extractedData.skills && resumeData.extractedData.skills.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">🎯 Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.extractedData.skills.map((skill: string, idx: number) => (
                              <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience Count */}
                      {resumeData.extractedData.experience && (
                        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">💼 Experience</h3>
                          <p className="text-3xl font-bold text-green-600">{resumeData.extractedData.experience.length}</p>
                          <p className="text-gray-600">Work experiences found</p>
                        </div>
                      )}

                      {/* Education */}
                      {resumeData.extractedData.education && (
                        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">🎓 Education</h3>
                          <p className="text-3xl font-bold text-purple-600">{resumeData.extractedData.education.length}</p>
                          <p className="text-gray-600">Degrees found</p>
                        </div>
                      )}

                      {/* Keywords */}
                      {resumeData.keywordAnalysis?.presentKeywords && (
                        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-600">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">🔑 Keywords</h3>
                          <p className="text-3xl font-bold text-yellow-600">{resumeData.keywordAnalysis.presentKeywords.length}</p>
                          <p className="text-gray-600">Industry keywords detected</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📊</div>
                  <p className="text-gray-600 text-lg">Upload a resume first to see analysis results</p>
                  <button
                    onClick={() => setSelectedTab('upload')}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customize Tab */}
          {selectedTab === 'customize' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Resume for Job</h2>
              <form onSubmit={handleCustomizeResume} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Paste Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !jobDescription.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  {isLoading ? '⏳ Customizing...' : '✨ Customize Resume'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
