'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange?: string;
  skillsRequired?: string;
  description: string;
  recruiterName?: string;
};

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  resumeLink: '',
  coverLetter: '',
};

export default function JobsPage() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const response = await apiClient.getJobs();
      setLoading(false);

      if (!response.success) {
        setError(response.error || 'Failed to load jobs');
        return;
      }

      const payload = response.data as any;
      setJobs(payload?.data || []);
      setError('');
    };

    loadJobs();
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user?.id]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || null, [jobs, selectedJobId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob) {
      setError('Please select a job first');
      return;
    }

    if (!isAuthenticated) {
      setError('Please login as employee to apply');
      return;
    }

    if (user?.role === 'recruiter') {
      setError('Recruiter accounts cannot apply to jobs');
      return;
    }

    setApplying(true);
    setError('');
    setMessage('');

    const response = await apiClient.applyForJob(selectedJob.id, form);
    setApplying(false);

    if (!response.success) {
      setError(response.error || 'Failed to submit application');
      return;
    }

    setMessage('Application submitted successfully');
    setForm((prev) => ({ ...initialForm, fullName: prev.fullName, email: prev.email }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Portal</h1>
        <p className="text-gray-600">Browse open roles and apply directly.</p>
      </div>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{error}</div>}
      {message && <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">{message}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Open Jobs</h2>

          {loading ? (
            <p className="text-gray-600">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No open jobs right now.</p>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-auto pr-1">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full text-left rounded-lg border p-4 transition ${
                    selectedJobId === job.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-700">{job.company} • {job.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.jobType} • {job.experienceLevel}</p>
                  {job.salaryRange && <p className="text-xs text-gray-600 mt-1">Salary: {job.salaryRange}</p>}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{selectedJob ? `Apply: ${selectedJob.title}` : 'Select a Job'}</h2>

          {selectedJob ? (
            <>
              <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700"><strong>Company:</strong> {selectedJob.company}</p>
                <p className="text-sm text-gray-700"><strong>Location:</strong> {selectedJob.location}</p>
                <p className="text-sm text-gray-700"><strong>Type:</strong> {selectedJob.jobType}</p>
                <p className="text-sm text-gray-700"><strong>Experience:</strong> {selectedJob.experienceLevel}</p>
                {selectedJob.skillsRequired && <p className="text-sm text-gray-700"><strong>Skills:</strong> {selectedJob.skillsRequired}</p>}
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              <form onSubmit={handleApply} className="space-y-3">
                <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} required />
                <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                <input className="w-full border rounded px-3 py-2" placeholder="Resume URL (Drive/GitHub/Portfolio)" value={form.resumeLink} onChange={(e) => setForm((p) => ({ ...p, resumeLink: e.target.value }))} />
                <textarea className="w-full border rounded px-3 py-2" rows={6} placeholder="Cover letter" value={form.coverLetter} onChange={(e) => setForm((p) => ({ ...p, coverLetter: e.target.value }))} />

                <button
                  disabled={applying || !isAuthenticated || user?.role === 'recruiter'}
                  type="submit"
                  className="w-full rounded bg-blue-600 text-white py-2 font-semibold disabled:opacity-60"
                >
                  {applying ? 'Submitting...' : !isAuthenticated ? 'Login Required to Apply' : user?.role === 'recruiter' ? 'Recruiters Cannot Apply' : 'Apply Now'}
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-600">Choose a job from the left panel to view details and apply.</p>
          )}
        </section>
      </div>
    </div>
  );
}
