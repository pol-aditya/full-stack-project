'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type RecruiterJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  status: string;
  applicationCount: number;
};

export default function RecruiterPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salaryRange: '',
    skillsRequired: '',
    description: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && user?.role !== 'recruiter') {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'recruiter') {
      loadJobs();
    }
  }, [isLoading, isAuthenticated, user?.role]);

  const loadJobs = async () => {
    const response = await apiClient.recruiterGetJobs();
    if (response.success && response.data) {
      const payload: any = response.data;
      setJobs(payload?.data || []);
    } else {
      setError(response.error || 'Failed to load jobs');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const response = await apiClient.recruiterPostJob(formData);
    setIsSubmitting(false);

    if (!response.success) {
      setError(response.error || 'Failed to post job');
      return;
    }

    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      salaryRange: '',
      skillsRequired: '',
      description: '',
      applicationDeadline: '',
    });

    await loadJobs();
  };

  if (isLoading || !isAuthenticated || user?.role !== 'recruiter') {
    return <div className="p-8">Loading recruiter portal...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recruiter Portal</h1>

      {error && <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>}

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
        <form onSubmit={submitJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={onChange} placeholder="Job title" className="border rounded px-3 py-2" required />
          <input name="company" value={formData.company} onChange={onChange} placeholder="Company" className="border rounded px-3 py-2" required />
          <input name="location" value={formData.location} onChange={onChange} placeholder="Location" className="border rounded px-3 py-2" required />
          <select name="jobType" value={formData.jobType} onChange={onChange} className="border rounded px-3 py-2">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
          <select name="experienceLevel" value={formData.experienceLevel} onChange={onChange} className="border rounded px-3 py-2">
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
          <input name="salaryRange" value={formData.salaryRange} onChange={onChange} placeholder="Salary range" className="border rounded px-3 py-2" />
          <input name="skillsRequired" value={formData.skillsRequired} onChange={onChange} placeholder="Skills required" className="border rounded px-3 py-2 md:col-span-2" />
          <textarea name="description" value={formData.description} onChange={onChange} placeholder="Job description" className="border rounded px-3 py-2 md:col-span-2 min-h-32" required />
          <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={onChange} className="border rounded px-3 py-2" />
          <button disabled={isSubmitting} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{job.title} - {job.company}</p>
                  <p className="text-sm text-gray-600">{job.location} | {job.jobType} | {job.experienceLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Status: {job.status}</p>
                  <p className="text-sm font-semibold">Applications: {job.applicationCount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
