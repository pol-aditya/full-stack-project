'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type ParseabilityChecks = Record<string, boolean>;

interface ScoreComponent {
  weight: number;
  score: number;
  weightedContribution?: number;
  checks?: ParseabilityChecks;
}

interface AtsScore {
  score: number;
  feedback?: string[];
  suggestions?: string[];
  detailedIssues?: string[];
  scoringFormula?: string;
  breakdown?: Record<string, ScoreComponent>;
}

interface ExperienceItem {
  text: string;
  hasYearSignal?: boolean;
}

interface EducationItem {
  text: string;
}

interface SectionQuality {
  quantifiedBulletCount?: number;
  actionVerbHits?: string[];
  penaltyPoints?: number;
  penalties?: string[];
}

interface AnalysisMeta {
  roleProfile?: string;
  roleProfileConfidence?: number;
  scoringVersion?: string;
  sectionQuality?: SectionQuality;
}

interface StructuredAnalysis {
  matchingRequirements?: {
    title?: string;
    items?: string[];
  };
  missingRequirements?: {
    title?: string;
    items?: string[];
  };
  skillsAnalysis?: {
    title?: string;
    matchingSkills?: string[];
    requiredSkills?: string[];
    missingSkills?: string[];
    summary?: string;
  };
  experienceAnalysis?: {
    title?: string;
    requiredExperience?: string;
    currentExperience?: string;
    status?: string;
    assessment?: string;
  };
  educationEligibility?: {
    title?: string;
    requiredQualifications?: string[];
    matchedQualifications?: string[];
    status?: string;
    assessment?: string;
  };
  finalVerdict?: {
    title?: string;
    fit?: string;
    reason?: string;
  };
}

interface ResumeData {
  resumeText?: string;
  atsScore?: AtsScore;
  extractedData?: {
    skills?: string[];
    experience?: ExperienceItem[];
    education?: EducationItem[];
  };
  keywordAnalysis?: {
    presentKeywords?: string[];
    missingKeywords?: string[];
    coreMissingKeywords?: string[];
  };
  analysisMeta?: AnalysisMeta;
  structuredAnalysis?: StructuredAnalysis;
}

interface ResumeAnalysisPayload {
  data?: ResumeData | null;
}

interface UploadPayload {
  data?: ResumeData;
}

export default function ResumePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [atsScore, setAtsScore] = useState<AtsScore | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const loadResumeAnalysis = useCallback(async () => {
    try {
      const response = await apiClient.getResumeAnalysis(user?.id || 'demo-user');
      if (response.data) {
        const payload = response.data as ResumeAnalysisPayload;
        setResumeData(payload?.data || null);
        setAtsScore(payload?.data?.atsScore || null);
      }
    } catch {
      console.log('No existing resume found');
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Load existing resume analysis
      loadResumeAnalysis();
    }
  }, [isAuthenticated, loadResumeAnalysis, router]);

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
      setErrorMessage('Please select a resume file');
      return;
    }

    setIsLoading(true);
    clearMessages();
    
    try {
      const response = await apiClient.uploadResume(file, user?.id || 'demo-user');
      if (response.success) {
        const payload = response.data as UploadPayload;
        setSuccessMessage('✅ Profile saved! Resume uploaded and analyzed successfully!');
        setFile(null);
        setResumeData(payload?.data ?? null);
        setAtsScore(payload?.data?.atsScore ?? null);
        
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

    const triggerDownload = (contentBase64: string, fileName: string, mimeType: string) => {
      const binary = atob(contentBase64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType || 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName || 'customized-resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    };
    
    try {
      const response = await apiClient.customizeResume(
        jobDescription,
        '',
        user?.id || 'demo-user',
        resumeData?.resumeText || ''
      );
      if (response.success) {
        const payload = response.data as {
          data?: {
            download?: {
              fileName?: string;
              mimeType?: string;
              contentBase64?: string;
            };
            summary?: string;
          };
        };

        const downloadPayload = payload?.data?.download;
        if (downloadPayload?.contentBase64) {
          triggerDownload(
            downloadPayload.contentBase64,
            downloadPayload.fileName || 'customized-resume.txt',
            downloadPayload.mimeType || 'text/plain'
          );
          setSuccessMessage('✅ Resume customized and downloaded successfully!');
        } else {
          setSuccessMessage(payload?.data?.summary || '✅ Resume customized successfully!');
        }
      } else {
        setErrorMessage(response.error || 'Failed to customize');
      }
    } catch {
      setErrorMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  const structured = resumeData?.structuredAnalysis;

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
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer block">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-gray-900 font-semibold mb-2 text-lg">
                      {file ? `✅ ${file.name}` : 'Click to upload your resume'}
                    </p>
                    <p className="text-gray-600 text-sm">PDF or DOCX format (max 10MB)</p>
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
                  {structured && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-5">Structured Role Alignment Analysis</h2>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <section className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <h3 className="font-bold text-emerald-900 mb-2">
                            {structured.matchingRequirements?.title || 'Matching Requirements (Strong Fit)'}
                          </h3>
                          <ul className="space-y-1 text-sm text-emerald-900">
                            {(structured.matchingRequirements?.items || []).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                            {(structured.matchingRequirements?.items || []).length === 0 && (
                              <li className="text-sm text-emerald-800">No strong-fit items detected yet.</li>
                            )}
                          </ul>
                        </section>

                        <section className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                          <h3 className="font-bold text-rose-900 mb-2">
                            {structured.missingRequirements?.title || 'Missing Requirements (Gaps)'}
                          </h3>
                          <ul className="space-y-1 text-sm text-rose-900">
                            {(structured.missingRequirements?.items || []).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                            {(structured.missingRequirements?.items || []).length === 0 && (
                              <li className="text-sm text-rose-800">No major requirement gaps detected.</li>
                            )}
                          </ul>
                        </section>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <section className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                          <h3 className="font-bold text-sky-900 mb-2">
                            {structured.skillsAnalysis?.title || 'Skills Analysis'}
                          </h3>
                          <p className="text-sm text-sky-900 mb-2">{structured.skillsAnalysis?.summary}</p>
                          <p className="text-xs font-semibold text-sky-800 mb-1">Skills I have (matched)</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(structured.skillsAnalysis?.matchingSkills || []).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-sky-100 border border-sky-300 text-sky-900">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs font-semibold text-sky-800 mb-1">Skills required but missing</p>
                          <div className="flex flex-wrap gap-2">
                            {(structured.skillsAnalysis?.missingSkills || []).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-white border border-rose-300 text-rose-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </section>

                        <section className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <h3 className="font-bold text-indigo-900 mb-2">
                            {structured.experienceAnalysis?.title || 'Experience Analysis'}
                          </h3>
                          <p className="text-sm text-indigo-900">Required: {structured.experienceAnalysis?.requiredExperience || 'N/A'}</p>
                          <p className="text-sm text-indigo-900">Current: {structured.experienceAnalysis?.currentExperience || 'N/A'}</p>
                          <p className="text-sm text-indigo-900 mt-1 font-semibold">
                            Status: {structured.experienceAnalysis?.status || 'N/A'}
                          </p>
                          <p className="text-sm text-indigo-800 mt-2">{structured.experienceAnalysis?.assessment}</p>
                        </section>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <section className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                          <h3 className="font-bold text-violet-900 mb-2">
                            {structured.educationEligibility?.title || 'Education Eligibility'}
                          </h3>
                          <p className="text-sm text-violet-900 font-semibold">
                            Status: {structured.educationEligibility?.status || 'N/A'}
                          </p>
                          <p className="text-sm text-violet-800 mt-2">{structured.educationEligibility?.assessment}</p>
                          <p className="text-xs font-semibold text-violet-800 mt-3 mb-1">Required qualifications</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(structured.educationEligibility?.requiredQualifications || []).map((q, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-white border border-violet-300 text-violet-900">
                                {q}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs font-semibold text-violet-800 mb-1">Matched qualifications</p>
                          <div className="flex flex-wrap gap-2">
                            {(structured.educationEligibility?.matchedQualifications || []).map((q, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-violet-100 border border-violet-300 text-violet-900">
                                {q}
                              </span>
                            ))}
                          </div>
                        </section>

                        <section className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h3 className="font-bold text-amber-900 mb-2">
                            {structured.finalVerdict?.title || 'Final Verdict'}
                          </h3>
                          <p className="text-xl font-bold text-amber-900">{structured.finalVerdict?.fit || 'N/A'}</p>
                          <p className="text-sm text-amber-800 mt-2">{structured.finalVerdict?.reason}</p>
                        </section>
                      </div>
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
