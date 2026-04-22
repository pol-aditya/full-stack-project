'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ───────────────────── hardcoded data ───────────────────── */
const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    logo: 'TC',
    logoGradient: 'from-blue-500 to-cyan-400',
    location: 'Remote, US',
    jobType: 'Full-time',
    matchScore: 94,
    matchReason:
      "Strong match with your React, TypeScript, and Next.js experience. Your portfolio projects closely align with the team's tech stack.",
    skillsMatched: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    skillsExtra: ['GraphQL', 'Jest'],
    salaryRange: '$120k – $160k',
    postedAt: '2 days ago',
    benefits: ['Remote-first', 'Stock options', '401k match'],
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'InnovateSpace',
    logo: 'IS',
    logoGradient: 'from-purple-500 to-pink-500',
    location: 'New York, NY (Hybrid)',
    jobType: 'Full-time',
    matchScore: 89,
    matchReason:
      'Matches your full-stack background with Node.js and React. Your experience with REST APIs is a strong fit.',
    skillsMatched: ['Node.js', 'Express', 'React', 'MongoDB'],
    skillsExtra: ['Docker', 'AWS'],
    salaryRange: '$130k – $150k',
    postedAt: '1 week ago',
    benefits: ['Hybrid schedule', 'Learning budget', 'Health insurance'],
  },
  {
    id: 3,
    title: 'UI / UX Developer',
    company: 'DesignX Studio',
    logo: 'DX',
    logoGradient: 'from-orange-500 to-red-500',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    matchScore: 82,
    matchReason:
      'Good alignment with your frontend styling and design system skills. Figma experience would strengthen your candidacy.',
    skillsMatched: ['CSS', 'React', 'Storybook'],
    skillsExtra: ['Figma', 'Motion'],
    salaryRange: '$60 – $80 / hr',
    postedAt: '3 days ago',
    benefits: ['Flexible hours', 'Creative team', 'Portfolio projects'],
  },
  {
    id: 4,
    title: 'React Native Mobile Developer',
    company: 'AppWorks',
    logo: 'AW',
    logoGradient: 'from-green-500 to-emerald-400',
    location: 'Remote',
    jobType: 'Full-time',
    matchScore: 78,
    matchReason:
      'Moderate match based on your React knowledge. Mobile experience with React Native would be a plus.',
    skillsMatched: ['React Native', 'JavaScript', 'Redux'],
    skillsExtra: ['iOS', 'Android'],
    salaryRange: '$110k – $140k',
    postedAt: '5 hours ago',
    benefits: ['Remote-first', 'Unlimited PTO', 'Home-office stipend'],
  },
  {
    id: 5,
    title: 'Backend Engineer (Node)',
    company: 'CloudScale',
    logo: 'CS',
    logoGradient: 'from-indigo-500 to-blue-500',
    location: 'Austin, TX (Hybrid)',
    jobType: 'Full-time',
    matchScore: 75,
    matchReason:
      'Your Node.js and Express experience matches core requirements. Familiarity with microservices would strengthen your profile.',
    skillsMatched: ['Node.js', 'Express', 'PostgreSQL'],
    skillsExtra: ['Kubernetes', 'gRPC'],
    salaryRange: '$125k – $155k',
    postedAt: '4 days ago',
    benefits: ['Hybrid schedule', 'Equity', 'Conference budget'],
  },
];

/* ───────────── small helper components ──────────────── */

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? 'from-green-500 to-emerald-400 text-white'
      : score >= 80
      ? 'from-blue-500 to-cyan-400 text-white'
      : 'from-amber-400 to-orange-400 text-white';

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r ${color} text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
      {score}%
    </span>
  );
}

function CircularScore({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor =
    score >= 90 ? '#22c55e' : score >= 80 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-gray-200 dark:stroke-slate-700"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="8"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {score}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-slate-400 font-semibold">
          Match
        </span>
      </div>
    </div>
  );
}

/* ════════════════════ main page ════════════════════ */

export default function RecommendationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading…
      </div>
    );
  if (!isAuthenticated) return null;

  const selectedJob =
    RECOMMENDATIONS.find((j) => j.id === selectedJobId) || null;

  const handleApply = () => {
    if (!selectedJob) return;
    setApplying(true);
    setTimeout(() => {
      setAppliedJobs((prev) => [...prev, selectedJob.id]);
      setApplying(false);
    }, 1400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Header ─── */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 transition mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
            🎯 Job Recommendations
          </h1>
          <p className="text-gray-600 text-base">
            Curated roles matched to your skills, experience & career goals.
          </p>
        </div>

        {/* summary pills */}
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 shadow-sm text-center min-w-[100px]">
            <div className="text-xl font-bold text-gray-900">{RECOMMENDATIONS.length}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Matches</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 shadow-sm text-center min-w-[100px]">
            <div className="text-xl font-bold text-green-600">
              {Math.round(
                RECOMMENDATIONS.reduce((s, j) => s + j.matchScore, 0) /
                  RECOMMENDATIONS.length
              )}
              %
            </div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Avg Score</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 shadow-sm text-center min-w-[100px]">
            <div className="text-xl font-bold text-blue-600">{appliedJobs.length}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Applied</div>
          </div>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* ── left: cards list ── */}
        <div className="xl:col-span-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">
          {RECOMMENDATIONS.map((job) => {
            const isSelected = selectedJobId === job.id;
            const isApplied = appliedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-500/30'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
              >
                {/* applied ribbon */}
                {isApplied && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Applied
                    </span>
                  </div>
                )}

                <div className="flex gap-4">
                  {/* company avatar */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${job.logoGradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                  >
                    {job.logo}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 leading-snug truncate">
                        {job.title}
                      </h3>
                      <ScoreBadge score={job.matchScore} />
                    </div>
                    <p className="text-sm text-gray-700 font-medium mt-0.5">
                      {job.company}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" /></svg>
                        {job.jobType}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{job.postedAt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skillsMatched.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-50 text-blue-600 border border-blue-100 text-[11px] px-2 py-0.5 rounded font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsMatched.length > 3 && (
                        <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded font-medium">
                          +{job.skillsMatched.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── right: detail panel ── */}
        <div className="xl:col-span-7">
          {selectedJob ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden sticky top-8">
              {/* gradient header */}
              <div
                className={`bg-gradient-to-r ${selectedJob.logoGradient} p-6 pb-14 relative`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {selectedJob.logo}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-extrabold leading-tight drop-shadow-sm">
                      {selectedJob.title}
                    </h2>
                    <p className="text-white/80 font-medium">
                      {selectedJob.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* score circle overlaps header */}
              <div className="-mt-10 flex justify-center relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <CircularScore score={selectedJob.matchScore} />
                </div>
              </div>

              <div className="p-6 pt-5 space-y-6">
                {/* meta tags */}
                <div className="flex flex-wrap gap-3 justify-center text-sm">
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-gray-700 font-medium">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {selectedJob.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-gray-700 font-medium">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" /></svg>
                    {selectedJob.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-green-700 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {selectedJob.salaryRange}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-gray-500 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {selectedJob.postedAt}
                  </span>
                </div>

                {/* why you match */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Why You Match
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {selectedJob.matchReason}
                    </p>
                  </div>
                </div>

                {/* skills */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsMatched.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-sm px-3 py-1.5 rounded-full font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {skill}
                      </span>
                    ))}
                    {selectedJob.skillsExtra.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200 text-sm px-3 py-1.5 rounded-full font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    <span className="text-green-600">●</span> Matched &nbsp;
                    <span className="text-orange-500">●</span> Nice to have
                  </p>
                </div>

                {/* benefits */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Perks & Benefits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits.map((b) => (
                      <span
                        key={b}
                        className="bg-purple-50 text-purple-700 border border-purple-200 text-sm px-3 py-1.5 rounded-full font-medium"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-gray-100">
                  {appliedJobs.includes(selectedJob.id) ? (
                    <button
                      disabled
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Application Submitted!
                    </button>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-[.98]"
                    >
                      {applying ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          Easy Apply Now
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Your profile & resume will be securely sent to the employer.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* placeholder when nothing selected */
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 h-[680px] flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
              </div>
              <p className="text-lg font-semibold text-gray-500 mb-1">
                Select a job to explore
              </p>
              <p className="text-sm max-w-xs text-center text-gray-400">
                Click any recommended role on the left to see why you match, required skills, and apply instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
