'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Step4PrepareApplyFlow() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/interview-prep');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Step 4: Prepare & Apply</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice, Perfect, and Apply for your Dream Jobs with Confidence
            </p>
          </div>
        </div>
      </section>

      {/* Preparation Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Prepare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '📚',
                title: 'Quiz Generator',
                desc: 'Take domain-specific quizzes to strengthen your knowledge',
                stats: ['Adaptive difficulty', 'Performance tracking', 'Instant feedback']
              },
              {
                icon: '🎤',
                title: 'Interview Prep',
                desc: 'Practice all 4 interview rounds with AI feedback',
                stats: ['Aptitude, Technical, Managerial, HR', 'Mock interviews', 'Real-time feedback']
              },
              {
                icon: '🔗',
                title: 'LinkedIn Parser',
                desc: 'Extract job requirements and customize your resume',
                stats: ['Parse job descriptions', 'Skill matching', 'Resume customization']
              },
              {
                icon: '📄',
                title: 'Resume Customizer',
                desc: 'Tailor your resume for maximum impact on each job',
                stats: ['Job-specific optimization', 'ATS score tracking', 'Keyword matching']
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 border border-orange-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="space-y-1">
                  {item.stats.map((stat, j) => (
                    <div key={j} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-orange-600 font-bold">✓</span>
                      {stat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Recommended Preparation Timeline</h2>
          
          <div className="lg:flex gap-8 items-center">
            <div className="lg:w-1/2">
              <div className="space-y-4">
                {[
                  { week: 'Week 1', tasks: ['Start quizzes', 'Finalize resume', 'Research target companies'] },
                  { week: 'Week 2-3', tasks: ['Intensive quiz practice', 'Technical interview prep', 'Mock interviews'] },
                  { week: 'Week 4', tasks: ['HR round practice', 'Customize resumes', 'Start applying'] },
                  { week: 'Ongoing', tasks: ['Daily practice', 'Apply to 3-5 jobs', 'Refine based on feedback'] }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-orange-600">
                    <h4 className="font-bold text-gray-900 mb-2">{item.week}</h4>
                    <ul className="space-y-1">
                      {item.tasks.map((task, j) => (
                        <li key={j} className="text-gray-600 text-sm">✓ {task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="bg-orange-50 rounded-lg p-8 border border-orange-200 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4-Week Intensive Preparation Plan</h3>
                <p className="text-gray-600 mb-4">
                  Most candidates see significant improvements in 4 weeks with consistent effort
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ 30+ quiz questions per week</p>
                  <p>✓ 2-3 mock interviews</p>
                  <p>✓ 10-15 resume customizations</p>
                  <p>✓ 20+ job applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Rounds Details */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Master All Interview Rounds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                round: '🧮 Aptitude Round',
                duration: '45-60 minutes',
                topics: ['Quantitative reasoning', 'Logical thinking', 'Data interpretation', 'Verbal ability'],
                tips: ['Practice under time pressure', 'Focus on speed & accuracy', 'Learn shortcuts', 'Review weak areas']
              },
              {
                round: '💻 Technical Round',
                duration: '60-90 minutes',
                topics: ['Data structures & algorithms', 'System design', 'Coding problems', 'Problem solving'],
                tips: ['Master DSA patterns', 'Practice live coding', 'Explain your approach', 'Optimize solutions']
              },
              {
                round: '👔 Managerial Round',
                duration: '30-45 minutes',
                topics: ['Leadership style', 'Team management', 'Conflict resolution', 'Decision making'],
                tips: ['Prepare STAR stories', 'Show leadership', 'Discuss challenges', 'Highlight achievements']
              },
              {
                round: '🤝 HR Round',
                duration: '30-45 minutes',
                topics: ['Background & experience', 'Career goals', 'Culture fit', 'Compensation'],
                tips: ['Know yourself', 'Research company', 'Practice answers', 'Ask smart questions']
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.round}</h3>
                <p className="text-gray-600 text-sm mb-4">Duration: {item.duration}</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Topics</h4>
                <ul className="space-y-1 mb-4">
                  {item.topics.map((topic, j) => (
                    <li key={j} className="text-gray-600 text-sm">✓ {topic}</li>
                  ))}
                </ul>

                <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
                <ul className="space-y-1">
                  {item.tips.map((tip, j) => (
                    <li key={j} className="text-gray-600 text-sm">→ {tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Strategy */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Smart Application Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Target Selection',
                steps: [
                  'Use our job recommendations',
                  'Focus on 70-80% matched roles',
                  'Include stretch goals (90%+)',
                  'Apply regularly (3-5 roles/day)'
                ]
              },
              {
                icon: '📝',
                title: 'Resume Customization',
                steps: [
                  'Parse job descriptions',
                  'Match keywords to your resume',
                  'Reorder bullets by relevance',
                  'Optimize ATS score'
                ]
              },
              {
                icon: '📊',
                title: 'Application Tracking',
                steps: [
                  'Track all applications',
                  'Monitor response rates',
                  'Follow up after 1 week',
                  'Update resume based on feedback'
                ]
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-orange-200">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h3>
                <ol className="space-y-2">
                  {item.steps.map((step, j) => (
                    <li key={j} className="text-gray-700 text-sm flex gap-2">
                      <span className="font-bold text-orange-600">{j + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Track Your Success</h2>
          
          <div className="space-y-4">
            {[
              { metric: 'ATS Score', target: 'Target 75%+', unit: '% Compatibility' },
              { metric: 'Applications', target: '50+ per month', unit: 'Monthly goal' },
              { metric: 'Interview Rate', target: 'Target 5-10%', unit: 'Of applications' },
              { metric: 'Job Search Time', target: '3-6 months', unit: 'Average duration' }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 flex gap-4 items-center">
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900">{item.metric}</h4>
                  <p className="text-gray-600 text-sm">{item.unit}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{item.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex (Software Dev)',
                story: 'Improved ATS score from 42% to 88% in 2 weeks. Got interviews at 3 dream companies.',
                time: 'Landed job in 6 weeks'
              },
              {
                name: 'Priya (Data Scientist)',
                story: 'Practiced 20+ mock interviews. Negotiated 30% higher salary.',
                time: 'Landed job in 8 weeks'
              },
              {
                name: 'Jordan (DevOps)',
                story: 'Customized resume for each application. 20% interview rate achieved.',
                time: 'Landed job in 4 weeks'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <div className="text-2xl mb-3">⭐⭐⭐⭐⭐</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{item.story}</p>
                <p className="text-orange-600 font-semibold text-sm">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Change Your Career?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Start your preparation journey today. Success awaits those who prepare!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white text-orange-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition text-center"
            >
              Start Your Journey Now
            </Link>
            <Link
              href="/flows/step-1-profile"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition text-center"
            >
              Learn the Process
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Map */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Your Journey Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { num: '1', title: 'Create Profile', active: false },
              { num: '2', title: 'Upload Resume', active: false },
              { num: '3', title: 'Get Recommendations', active: false },
              { num: '4', title: 'Prepare & Apply', active: true }
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center p-6 rounded-lg transition ${
                  step.active
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl ${
                  step.active ? 'bg-white text-orange-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.num}
                </div>
                <h4 className="font-bold">{step.title}</h4>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              You've explored the complete journey. Now it's time to take action!
            </p>
            <Link
              href="/login"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition"
            >
              Get Started Now! 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
