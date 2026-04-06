'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Step1ProfileFlow() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/profile');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Step 1: Create Your Profile</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build a comprehensive profile that drives all our AI-powered recommendations
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Do */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What You'll Set Up</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Select Your Domain',
                items: ['Software Development', 'Data Science', 'DevOps', 'Cloud Architecture', 'ML Engineering']
              },
              {
                icon: '🛠️',
                title: 'Choose Your Skills',
                items: ['Python, JavaScript, TypeScript', 'React, Node.js, AWS', 'Docker, Kubernetes', 'SQL, NoSQL', 'Git & REST APIs']
              },
              {
                icon: '💼',
                title: 'Define Career Goals',
                items: ['Target job roles', 'Preferred companies', 'Career aspirations', 'Growth trajectory']
              },
              {
                icon: '📍',
                title: 'Set Preferences',
                items: ['Location', 'Experience level', 'Salary expectations', 'Work environment']
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{subitem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Your Profile Matters</h2>
          <div className="space-y-6">
            {[
              {
                title: '🎯 Personalized Recommendations',
                desc: 'We use your profile to suggest jobs that match your goals and skills'
              },
              {
                title: '📚 Targeted Learning',
                desc: 'Quiz and interview questions are customized to your domain and level'
              },
              {
                title: '📄 Smart Resume Optimization',
                desc: 'Resume suggestions focus on skills relevant to your target roles'
              },
              {
                title: '💡 Career Insights',
                desc: 'Domain analysis shows skill gaps based on your goals'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Ready to Begin?</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900">Create or Login to Your Account</h4>
                  <p className="text-gray-600 text-sm">Sign up in seconds with your email</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900">Go to Profile Page</h4>
                  <p className="text-gray-600 text-sm">Access from dashboard or navigation menu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900">Fill In Your Details</h4>
                  <p className="text-gray-600 text-sm">Takes about 5 minutes to complete</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900">Save & Continue</h4>
                  <p className="text-gray-600 text-sm">Move to upload resume (Step 2)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition text-center"
            >
              Start Creating Profile
            </Link>
            <Link
              href="/"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { num: '1', title: 'Create Profile', active: true },
              { num: '2', title: 'Upload Resume', active: false },
              { num: '3', title: 'Get Recommendations', active: false },
              { num: '4', title: 'Prepare & Apply', active: false }
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center p-6 rounded-lg transition ${
                  step.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl ${
                  step.active ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.num}
                </div>
                <h4 className="font-bold">{step.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
