'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

const DOMAINS = ['Software Development', 'Data Science', 'DevOps', 'Cloud Architecture', 'Machine Learning', 'Web Development', 'Mobile Development'];
const SKILLS_LIST = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'Git', 'REST APIs'];

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    domain: '',
    skills: [] as string[],
    careerGoals: '',
    yearsOfExperience: '',
    location: '',
    expectedSalary: '',
    company_preferences: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, domain: e.target.value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiClient.createProfile(formData);
      if (response.success) {
        setMessage('Profile created successfully!');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setMessage(response.error || 'Failed to create profile');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
        <p className="text-gray-600 mb-8">
          Help us understand your career goals so we can provide personalized recommendations
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Domain Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Primary Domain
            </label>
            <select
              value={formData.domain}
              onChange={handleDomainChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="">Select your domain</option>
              {DOMAINS.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Skills Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Skills & Technologies
            </label>
            <p className="text-gray-600 mb-4">Select all skills you're proficient with</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SKILLS_LIST.map(skill => (
                <label key={skill} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          {/* Career Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Career Goals
            </label>
            <textarea
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Describe your career aspirations..."
              rows={4}
            />
          </div>

          {/* Expected Salary & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Expected Salary Range
              </label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., $100k - $150k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Company Preferences
              </label>
              <input
                type="text"
                name="company_preferences"
                value={formData.company_preferences}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Startups, Tech Giants"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !formData.domain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
