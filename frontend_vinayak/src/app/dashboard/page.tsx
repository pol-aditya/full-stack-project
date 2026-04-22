'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const dashboardCards = [
    {
      icon: '👤',
      title: 'Profile',
      desc: 'Set up your profile with domain, skills, and career goals',
      href: '/profile',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: '📄',
      title: 'Resume Manager',
      desc: 'Upload and manage your resume with AI analysis',
      href: '/resume',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: '📊',
      title: 'ATS Score',
      desc: 'Check your resume ATS compatibility score',
      href: '/resume',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: '📚',
      title: 'Quiz & Learn',
      desc: 'Practice with domain-specific adaptive quizzes',
      href: '/quiz',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: '🎤',
      title: 'Interview Prep',
      desc: 'Prepare for all interview rounds',
      href: '/interview-prep',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: '🔗',
      title: 'LinkedIn Jobs',
      desc: 'Parse and match LinkedIn job postings',
      href: '/linkedin',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      icon: '🎯',
      title: 'Job Recommendations',
      desc: 'Get personalized job recommendations',
      href: '/recommendations',
      color: 'from-red-400 to-red-600'
    },
    {
      icon: '📊',
      title: 'Domain Analysis',
      desc: 'Identify skill gaps in your domain',
      href: '/dashboard',
      color: 'from-cyan-400 to-cyan-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Your AI-powered job search companion is ready to help you succeed
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <p className="text-gray-600 text-sm">Resumes Uploaded</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="text-3xl font-bold text-gray-900">0%</div>
          <p className="text-gray-600 text-sm">Average ATS Score</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <p className="text-gray-600 text-sm">Quizzes Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <p className="text-gray-600 text-sm">Jobs Applied</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full overflow-hidden">
              <div className={`bg-gradient-to-r ${card.color} h-24 flex items-center justify-center text-4xl`}>
                {card.icon}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Getting Started */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Getting Started</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex items-start gap-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
            <span><strong>Create Your Profile:</strong> Go to the Profile section and tell us about your skills and career goals</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
            <span><strong>Upload Your Resume:</strong> Share your resume for AI-powered analysis</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
            <span><strong>Take Quizzes:</strong> Learn and practice with domain-specific quizzes</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
            <span><strong>Prepare for Interviews:</strong> Practice mock interviews and get feedback</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
