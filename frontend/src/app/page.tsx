'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const journeySteps = [
    {
      num: '1',
      title: 'Create Profile',
      desc: 'Tell us about your domain and skills',
      href: '/flows/step-1-profile',
      accent: 'from-blue-500 to-cyan-500',
      hoverBorder: 'group-hover:border-blue-300',
      hoverText: 'group-hover:text-blue-600'
    },
    {
      num: '2',
      title: 'Upload Resume',
      desc: 'Share your current resume for analysis',
      href: '/flows/step-2-resume',
      accent: 'from-sky-500 to-blue-600',
      hoverBorder: 'group-hover:border-sky-300',
      hoverText: 'group-hover:text-sky-600'
    },
    {
      num: '3',
      title: 'Get Recommendations',
      desc: 'Receive personalized improvement suggestions',
      href: '/flows/step-3-recommendations',
      accent: 'from-cyan-500 to-blue-600',
      hoverBorder: 'group-hover:border-cyan-300',
      hoverText: 'group-hover:text-cyan-600'
    },
    {
      num: '4',
      title: 'Prepare & Apply',
      desc: 'Practice and apply for your dream jobs',
      href: '/flows/step-4-prepare',
      accent: 'from-indigo-500 to-blue-700',
      hoverBorder: 'group-hover:border-indigo-300',
      hoverText: 'group-hover:text-indigo-600'
    }
  ];

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="bg-white transition-colors dark:bg-slate-950">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-slate-950 dark:via-[#081225] dark:to-slate-900 flex items-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your AI Job Search <span className="text-blue-600 dark:text-sky-300">Companion</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
                From profile creation to interview preparation, JobSeeker AI guides you
                through every step of your career journey with intelligent recommendations
                and personalized coaching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-4 text-center font-semibold text-white shadow-[0_16px_34px_rgba(37,99,235,0.28)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(6,182,212,0.28)]"
                >
                  Get Started Free
                </Link>
                <button className="rounded-xl border-2 border-blue-200/80 bg-white/70 px-8 py-4 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/30 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-[0_28px_70px_rgba(14,165,233,0.22)]">
              <div className="space-y-4">
                {[
                  'AI-Powered Resume Optimization',
                  'Real-time ATS Score Analysis',
                  'Job Recommendations',
                  'Interactive Quiz Generator',
                  'Interview Preparation',
                  'LinkedIn Integration'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful Features for Your Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Profile',
                title: 'Profile Creation',
                desc: 'Build a comprehensive profile with your domain, skills, and career interests'
              },
              {
                icon: 'Resume',
                title: 'Resume Management',
                desc: 'Upload, analyze, and optimize your resume with AI insights and ATS scoring'
              },
              {
                icon: 'AI',
                title: 'AI Resume Generator',
                desc: 'Auto-generate professional resumes from your profile data using templates'
              },
              {
                icon: 'ATS',
                title: 'Resume Analyzer',
                desc: 'Get detailed feedback on formatting, content quality, and keyword optimization'
              },
              {
                icon: 'Match',
                title: 'Resume Customizer',
                desc: 'Tailor your resume to specific job descriptions to increase selection chances'
              },
              {
                icon: 'Quiz',
                title: 'Quiz Generator',
                desc: 'Take adaptive quizzes for personalized technical preparation'
              },
              {
                icon: 'Prep',
                title: 'Interview Prep',
                desc: 'Prepare for all rounds: Aptitude, Technical, Managerial, and HR'
              },
              {
                icon: 'Skills',
                title: 'Domain Analysis',
                desc: 'Identify skill gaps and get personalized learning paths'
              },
              {
                icon: 'Link',
                title: 'LinkedIn Integration',
                desc: 'Parse LinkedIn job posts directly and match with opportunities'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-3 hover:scale-[1.01] hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.18)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500 dark:hover:shadow-[0_24px_60px_rgba(14,165,233,0.2)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 opacity-70 blur-2xl transition duration-300 group-hover:scale-125 group-hover:opacity-100 dark:from-sky-700/40 dark:via-cyan-500/30 dark:to-indigo-700/40" />
                <div className="relative mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600 transition duration-300 group-hover:-translate-y-1 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white dark:bg-slate-800 dark:text-sky-300">
                  {feature.icon}
                </div>
                <h3 className="relative mb-2 text-lg font-bold text-gray-900 transition duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-300">
                  {feature.title}
                </h3>
                <p className="relative text-sm leading-6 text-gray-600 dark:text-slate-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 to-white dark:from-slate-900 dark:to-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {journeySteps.map((step) => (
              <Link key={step.num} href={step.href} className="group block h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(37,99,235,0.14)] dark:border-slate-800 dark:bg-slate-950 ${step.hoverBorder}`}
                >
                  <div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg ${step.accent}`}
                  >
                    {step.num}
                  </div>
                  <h3 className={`mb-3 text-xl font-bold text-gray-900 dark:text-white transition ${step.hoverText}`}>
                    {step.title}
                  </h3>
                  <p className="flex-grow text-sm leading-6 text-gray-600 dark:text-slate-300">
                    {step.desc}
                  </p>
                  <div className={`mt-6 text-sm font-semibold transition ${step.hoverText}`}>
                    Click to open step →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/flows"
              className="inline-block rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-3 font-bold text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(6,182,212,0.26)]"
            >
              Explore Complete Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-cyan-50/90 mb-8">
            Join thousands of job seekers who are using JobSeeker AI to land their dream jobs
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-[0_16px_36px_rgba(8,47,73,0.22)] transition hover:-translate-y-1 hover:bg-cyan-50"
          >
            Start Your Free Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
