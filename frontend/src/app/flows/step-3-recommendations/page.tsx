'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Step3RecommendationsFlow() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">💡</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Step 3: Get Recommendations</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Receive personalized AI-powered suggestions to take your career to the next level
            </p>
          </div>
        </div>
      </section>

      {/* Types of Recommendations */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Types of Personalized Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📄',
                title: 'Resume Improvements',
                desc: 'Specific suggestions to increase ATS score and improve content quality'
              },
              {
                icon: '🎯',
                title: 'Job Matches',
                desc: 'Jobs tailored to your profile, skills, and career goals'
              },
              {
                icon: '📚',
                title: 'Skill Development',
                desc: 'Learning paths to fill gaps identified in your domain'
              },
              {
                icon: '🎤',
                title: 'Interview Focus',
                desc: 'Topics to prepare for based on target roles and companies'
              },
              {
                icon: '💼',
                title: 'Career Trajectory',
                desc: 'Growth opportunities and next steps in your career'
              },
              {
                icon: '🌟',
                title: 'Competitive Edge',
                desc: 'What skills matter most for your target positions'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Improvements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">📄 Resume Improvement Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                category: 'Content Enhancements',
                items: ['Reword achievements for impact', 'Add quantifiable metrics', 'Highlight relevant skills', 'Improve clarity and brevity']
              },
              {
                category: 'ATS Optimization',
                items: ['Add missing keywords', 'Improve formatting', 'Restructure sections', 'Enhance readability']
              },
              {
                category: 'Format & Design',
                items: ['Modernize layout', 'Improve spacing', 'Enhance visual hierarchy', 'Better section organization']
              },
              {
                category: 'Job Customization',
                items: ['Match job description', 'Reorder bullets for relevance', 'Highlight matching skills', 'Tailor examples']
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{item.category}</h4>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">→</span>
                      {subitem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Recommendations */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">🎯 Smart Job Recommendations</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How We Match Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Analyze Your Profile', desc: 'Skills, experience, location, preferences' },
                { num: '2', title: 'Parse Job Postings', desc: 'Extract requirements from thousands of jobs' },
                { num: '3', title: 'Smart Matching', desc: 'AI matches your profile to best opportunities' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-4 text-center">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 font-bold">
                    {item.num}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '⭐',
                title: 'Perfect Matches',
                desc: 'Jobs where you meet 90%+ of requirements'
              },
              {
                icon: '💪',
                title: 'Stretch Goals',
                desc: 'Positions to grow into with learning'
              },
              {
                icon: '🔄',
                title: 'Lateral Moves',
                desc: 'Similar roles in different industries'
              },
              {
                icon: '📈',
                title: 'Career Growth',
                desc: 'Next-level opportunities for advancement'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Development */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">📚 Personalized Learning Paths</h2>
          
          <div className="bg-white rounded-lg p-8 border border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Domain Analysis Insights</h3>
            <div className="space-y-4">
              {[
                { title: 'In-Demand Skills', items: ['Top 10 skills for your domain', 'Market demand trends', 'Salary impact of each skill'] },
                { title: 'Your Gaps', items: ['Skills missing in your profile', 'Impact on job prospects', 'Time to learn each skill'] },
                { title: 'Learning Recommendations', items: ['Courses to take', 'Certifications available', 'Practice projects'] }
              ].map((section, i) => (
                <div key={i} className="border-l-4 border-green-600 pl-4 py-2">
                  <h4 className="font-bold text-gray-900 mb-2">{section.title}</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {section.items.map((item, j) => (
                      <li key={j}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interview Focus */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">🎤 Interview Preparation Focus</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                round: 'Aptitude Round',
                focus: ['Quant problems from target companies', 'Logical reasoning patterns', 'Time management tips']
              },
              {
                round: 'Technical Round',
                focus: ['DSA patterns for your domain', 'System design topics', 'Code optimization']
              },
              {
                round: 'Managerial Round',
                focus: ['Leadership stories to prepare', 'Conflict resolution scenarios', 'Team collaboration examples']
              },
              {
                round: 'HR Round',
                focus: ['Company-specific culture questions', 'Negotiation strategies', 'Career growth expectations']
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{item.round}</h4>
                <ul className="space-y-2">
                  {item.focus.map((focus, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-700 text-sm">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span>{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Recommendations */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Use Your Recommendations</h2>
          
          <div className="space-y-6">
            {[
              {
                title: '1. Review Your Recommendations',
                desc: 'Check dashboard for personalized suggestions daily'
              },
              {
                title: '2. Prioritize Actions',
                desc: 'Start with high-impact improvements for quick results'
              },
              {
                title: '3. Implement Changes',
                desc: 'Update resume, learn new skills, practice interviews'
              },
              {
                title: '4. Track Progress',
                desc: 'Monitor improvement in ATS score and job matches'
              },
              {
                title: '5. Apply to Jobs',
                desc: 'Use matched opportunities and customized resume'
              },
              {
                title: '6. Get Feedback',
                desc: 'Refine approach based on application results'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-l-4 border-green-600 flex gap-4">
                <div className="text-2xl font-bold text-green-600">{item.title.split('.')[0]}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.title.split('. ')[1]}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Next: Prepare & Apply</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200 mb-8">
            <p className="text-gray-700 mb-6">
              Once you have your recommendations, it's time to put them into action and start applying!
            </p>
            <ul className="space-y-3">
              {[
                '✓ Use quiz generator to practice domain-specific questions',
                '✓ Take interview prep to prepare for all 4 rounds',
                '✓ Customize resume for each job you apply to',
                '✓ Track application status and get feedback'
              ].map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/flows/step-4-prepare"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition text-center"
            >
              Continue to Step 4
            </Link>
            <Link
              href="/flows/step-2-resume"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-lg transition"
            >
              Back to Step 2
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
              { num: '1', title: 'Create Profile', active: false },
              { num: '2', title: 'Upload Resume', active: false },
              { num: '3', title: 'Get Recommendations', active: true },
              { num: '4', title: 'Prepare & Apply', active: false }
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center p-6 rounded-lg transition ${
                  step.active
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl ${
                  step.active ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-600'
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
