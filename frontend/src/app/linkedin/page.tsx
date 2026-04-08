'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function LinkedInPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [jobData, setJobData] = useState<any>(null);
  const [customizedResume, setCustomizedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleParseJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl) {
      setMessage('Please enter a LinkedIn job URL');
      return;
    }

    setIsLoading(true);
    setMessage('');
    try {
      const response = await apiClient.parseLinkedInJob(linkedinUrl);
      if (response.success) {
        setJobData(response.data);
        setMessage('Job description parsed successfully!');
      } else {
        setMessage(response.error || 'Failed to parse job');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomizeResume = async () => {
    if (!jobData) return;

    setIsLoading(true);
    try {
      const response = await apiClient.customizeResume(jobData.description || '', '');
      if (response.success) {
        setCustomizedResume(response.data?.customized_resume || '');
        setMessage('Resume customized for this job!');
      } else {
        setMessage(response.error || 'Failed to customize');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🔗 LinkedIn Job Parser</h1>
        <p className="text-gray-600 text-lg">
          Paste a LinkedIn job post link and automatically customize your resume for it
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') || message.includes('customized') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paste Job Link</h2>

            <form onSubmit={handleParseJob} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  LinkedIn Job URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="https://www.linkedin.com/jobs/view/xxxxx..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !linkedinUrl}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Parsing...' : 'Parse Job Description'}
              </button>
            </form>

            {jobData && (
              <button
                onClick={handleCustomizeResume}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Customizing...' : 'Customize Resume for This Job'}
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Job Display */}
        <div className="space-y-6">
          {jobData && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{jobData.title || 'Job Title'}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Company</h4>
                  <p className="text-gray-600">{jobData.company || 'Company Name'}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{jobData.location || 'Location'}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Job Type</h4>
                  <p className="text-gray-600">{jobData.jobType || 'Full Time'}</p>
                </div>

                {jobData.salary && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Salary Range</h4>
                    <p className="text-gray-600">{jobData.salary}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Job Description</h4>
                <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {jobData.description || 'Job description'}
                  </p>
                </div>
              </div>

              {jobData.keySkills && jobData.keySkills.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Key Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobData.keySkills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!jobData && (
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">How it Works</h3>
              <ol className="text-gray-700 text-sm space-y-2 text-left">
                <li>1. Paste the LinkedIn job posting URL</li>
                <li>2. Our AI parses the job description</li>
                <li>3. We extract key requirements and skills</li>
                <li>4. We customize your resume to match</li>
                <li>5. Download your optimized resume</li>
              </ol>
            </div>
          )}

          {customizedResume && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Customized Resume</h3>
              <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto mb-4">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {customizedResume}
                </p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                Download Customized Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
