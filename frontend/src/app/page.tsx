'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your AI Job Search <span className="text-blue-600">Companion</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                From profile creation to interview preparation, JobSeeker AI guides you through every step of your career journey with intelligent recommendations and personalized coaching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition text-center"
                >
                  Get Started Free
                </Link>
                <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-900 px-8 py-4 rounded-lg font-semibold transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="space-y-4">
                {[
                  '✨ AI-Powered Resume Optimization',
                  '📊 Real-time ATS Score Analysis',
                  '🎯 Job Recommendations',
                  '📚 Interactive Quiz Generator',
                  '🎤 Interview Preparation',
                  '🔗 LinkedIn Integration'
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Your Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '👤',
                title: 'Profile Creation',
                desc: 'Build a comprehensive profile with your domain, skills, and career interests'
              },
              {
                icon: '📄',
                title: 'Resume Management',
                desc: 'Upload, analyze, and optimize your resume with AI insights and ATS scoring'
              },
              {
                icon: '🤖',
                title: 'AI Resume Generator',
                desc: 'Auto-generate professional resumes from your profile data using templates'
              },
              {
                icon: '📊',
                title: 'Resume Analyzer',
                desc: 'Get detailed feedback on formatting, content quality, and keyword optimization'
              },
              {
                icon: '🎯',
                title: 'Resume Customizer',
                desc: 'Tailor your resume to specific job descriptions to increase selection chances'
              },
              {
                icon: '📚',
                title: 'Quiz Generator',
                desc: 'Take adaptive quizzes for personalized technical preparation'
              },
              {
                icon: '🎤',
                title: 'Interview Prep',
                desc: 'Prepare for all rounds: Aptitude, Technical, Managerial, and HR'
              },
              {
                icon: '📊',
                title: 'Domain Analysis',
                desc: 'Identify skill gaps and get personalized learning paths'
              },
              {
                icon: '🔗',
                title: 'LinkedIn Integration',
                desc: 'Parse LinkedIn job posts directly and match with opportunities'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition border border-gray-200"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Create Profile', desc: 'Tell us about your domain and skills', href: '/flows/step-1-profile' },
              { num: '2', title: 'Upload Resume', desc: 'Share your current resume for analysis', href: '/flows/step-2-resume' },
              { num: '3', title: 'Get Recommendations', desc: 'Receive personalized improvement suggestions', href: '/flows/step-3-recommendations' },
              { num: '4', title: 'Prepare & Apply', desc: 'Practice and apply for your dream jobs', href: '/flows/step-4-prepare' }
            ].map((step, i) => (
              <Link key={i} href={step.href}>
                <div className="text-center cursor-pointer group">
                  <div className="bg-blue-600 group-hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 transition">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                  <div className="mt-4 text-blue-600 font-semibold group-hover:text-blue-700 transition">Learn More →</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/flows"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Explore Complete Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who are using JobSeeker AI to land their dream jobs
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Start Your Free Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
