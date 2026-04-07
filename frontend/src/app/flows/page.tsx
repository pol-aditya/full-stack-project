'use client';

import Link from 'next/link';

export default function FlowsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Job Search Journey</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Follow our step-by-step guide to transform your career in just 4 weeks
          </p>
        </div>
      </section>

      {/* All Steps */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-600 text-white">
                    <span className="text-4xl font-bold">1</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
                  <p className="text-gray-600 mb-4">
                    Build a comprehensive profile with your domain, skills, and career interests. This foundation drives all our AI-powered recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Domain Selection</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Skill Mapping</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Goal Setting</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">⏱️ 5-10 min</span>
                  </div>
                  <Link
                    href="/flows/step-1-profile"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Explore Step 1 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-purple-600 text-white">
                    <span className="text-4xl font-bold">2</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
                  <p className="text-gray-600 mb-4">
                    Share your resume and get instant AI analysis. Get ATS scores, quality feedback, and specific improvement recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">ATS Analysis</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Quality Check</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Skill Detection</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">⏱️ 2-3 min</span>
                  </div>
                  <Link
                    href="/flows/step-2-resume"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Explore Step 2 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-green-600 text-white">
                    <span className="text-4xl font-bold">3</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Recommendations</h2>
                  <p className="text-gray-600 mb-4">
                    Receive personalized, AI-powered recommendations for resume improvements, job matching, and skill development tailored to your goals.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Job Matching</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Skill Gaps</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Learning Paths</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">📊 Ongoing</span>
                  </div>
                  <Link
                    href="/flows/step-3-recommendations"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Explore Step 3 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 border border-orange-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-orange-600 text-white">
                    <span className="text-4xl font-bold">4</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Prepare & Apply</h2>
                  <p className="text-gray-600 mb-4">
                    Practice with adaptive quizzes and mock interviews for all 4 rounds. Customize resumes and apply strategically with tracking.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Quizzes</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Mock Interviews</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Job Applications</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">⏱️ 4 weeks+</span>
                  </div>
                  <Link
                    href="/flows/step-4-prepare"
                    className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Explore Step 4 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Timeline & Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Step 1', time: '5-10 min', level: 'Beginner' },
              { title: 'Step 2', time: '2-3 min', level: 'Beginner' },
              { title: 'Step 3', time: 'Ongoing', level: 'All Levels' },
              { title: 'Step 4', time: '4 weeks', level: 'All Levels' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 mb-3">{item.time}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What to Expect</h2>
          <div className="space-y-6">
            {[
              {
                icon: '📈',
                title: 'Improved Resume Quality',
                desc: 'Average ATS score improvement from 45% to 80%+'
              },
              {
                icon: '🎯',
                title: 'Better Job Matches',
                desc: 'More relevant opportunities tailored to your profile'
              },
              {
                icon: '🧠',
                title: 'Interview Confidence',
                desc: 'Practice with 100+ mock interview questions'
              },
              {
                icon: '⏱️',
                title: 'Faster Offers',
                desc: 'Average job search time: 4-8 weeks'
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start from Step 1 or jump to any step. Your journey begins now!
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Start Your Journey Now 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}
