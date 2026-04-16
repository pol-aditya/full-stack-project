'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useRecruiterAuth } from '@/contexts/RecruiterAuthContext';

type RecruiterJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange?: string;
  skillsRequired?: string;
  description: string;
  applicationCount?: number;
};

type Application = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  resumeLink?: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
};

const initialJobForm = {
  title: '',
  company: '',
  location: '',
  jobType: 'Full-time',
  experienceLevel: 'Mid-level',
  salaryRange: '',
  skillsRequired: '',
  description: '',
  applicationDeadline: '',
};

export default function RecruiterPortalPage() {
  const router = useRouter();
  const { recruiter, isAuthenticated, isLoading, logout } = useRecruiterAuth();

  const [form, setForm] = useState(initialJobForm);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/recruiter/login');
      return;
    }
    if (isAuthenticated) {
      loadJobs();
    }
  }, [isLoading, isAuthenticated]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || null, [jobs, selectedJobId]);

  const loadJobs = async () => {
    const response = await apiClient.recruiterGetJobs();
    if (response.success) {
      const payload = response.data as any;
      setJobs(payload?.data || []);
    }
  };

  const loadApplications = async (jobId: number) => {
    setSelectedJobId(jobId);
    const response = await apiClient.recruiterGetApplications(jobId);
    if (response.success) {
      const payload = response.data as any;
      setApplications(payload?.data || []);
      setError('');
    } else {
      setApplications([]);
      setError(response.error || 'Failed to load applications');
    }
  };

  const postJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const response = await apiClient.recruiterPostJob(form);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to post job');
      return;
    }

    setMessage('Job posted successfully');
    setForm(initialJobForm);
    await loadJobs();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Portal</h1>
          <p className="text-gray-600">Welcome {recruiter?.name || recruiter?.email}. Post jobs and review applications.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/recruiter/login');
          }}
          className="rounded-lg bg-red-600 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Post New Job</h2>
          {message && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{message}</div>}
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

          <form onSubmit={postJob} className="space-y-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Job title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            <input className="w-full border rounded px-3 py-2" placeholder="Company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} required />
            <input className="w-full border rounded px-3 py-2" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required />

            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded px-3 py-2" value={form.jobType} onChange={(e) => setForm((p) => ({ ...p, jobType: e.target.value }))}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>

              <select className="border rounded px-3 py-2" value={form.experienceLevel} onChange={(e) => setForm((p) => ({ ...p, experienceLevel: e.target.value }))}>
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <input className="w-full border rounded px-3 py-2" placeholder="Salary range (optional)" value={form.salaryRange} onChange={(e) => setForm((p) => ({ ...p, salaryRange: e.target.value }))} />
            <input className="w-full border rounded px-3 py-2" placeholder="Skills required (comma separated)" value={form.skillsRequired} onChange={(e) => setForm((p) => ({ ...p, skillsRequired: e.target.value }))} />
            <input type="date" className="w-full border rounded px-3 py-2" value={form.applicationDeadline} onChange={(e) => setForm((p) => ({ ...p, applicationDeadline: e.target.value }))} />
            <textarea className="w-full border rounded px-3 py-2" rows={7} placeholder="Job description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />

            <button disabled={loading} type="submit" className="w-full rounded bg-blue-600 text-white py-2 font-semibold disabled:opacity-60">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Your Posted Jobs</h2>

          {jobs.length === 0 ? (
            <p className="text-gray-600">No jobs posted yet.</p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.jobType} • {job.experienceLevel}</p>
                    </div>
                    <button
                      onClick={() => loadApplications(job.id)}
                      className="text-sm rounded bg-slate-800 text-white px-3 py-1.5"
                    >
                      View Applicants ({job.applicationCount || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {selectedJob ? `Applications for ${selectedJob.title}` : 'Select a job to view applications'}
            </h3>
            {selectedJob && applications.length === 0 && <p className="text-sm text-gray-600">No applications yet.</p>}

            <div className="space-y-3 max-h-[280px] overflow-auto pr-1">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium text-gray-900">{application.fullName}</p>
                  <p className="text-sm text-gray-700">{application.email}{application.phone ? ` • ${application.phone}` : ''}</p>
                  {application.resumeLink && (
                    <a href={application.resumeLink} target="_blank" className="text-sm text-blue-600 underline" rel="noreferrer">
                      Resume Link
                    </a>
                  )}
                  {application.coverLetter && <p className="text-sm text-gray-700 mt-2">{application.coverLetter}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
