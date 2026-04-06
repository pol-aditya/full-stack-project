'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Step2ResumeFlow() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/resume');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Step 2: Upload Your Resume</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your resume and get AI-powered analysis for instant improvement suggestions
            </p>
          </div>
        </div>
      </section>

      {/* Upload Process */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Upload Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📁',
                title: 'Supported Formats',
                desc: 'PDF, DOC, or DOCX files up to 10MB'
              },
              {
                icon: '⚡',
                title: 'Instant Analysis',
                desc: 'AI analyzes within seconds of upload'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'Your resume data is encrypted and secure'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Analyze */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What We Analyze</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '📊',
                title: 'ATS Compatibility Score',
                features: ['Keyword optimization', 'Format compatibility', 'Parser-friendly layout', 'Industry relevance']
              },
              {
                icon: '✍️',
                title: 'Content Quality',
                features: ['Achievement impact', 'Clarity & concision', 'Skill highlighting', 'Experience gaps']
              },
              {
                icon: '🎨',
                title: 'Format & Design',
                features: ['Visual hierarchy', 'Readability', 'Professional appearance', 'Mobile-friendly']
              },
              {
                icon: '📈',
                title: 'Skill Distribution',
                features: ['Top skills identified', 'Relevant keywords', 'Skill gaps', 'Industry trends']
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-700">
                      <span className="text-purple-600 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Upload Your Resume?</h2>
          <div className="space-y-6">
            {[
              {
                title: '📈 Improve ATS Score',
                desc: 'Get your resume optimized for automated systems used by recruiters'
              },
              {
                title: '💡 Actionable Feedback',
                desc: 'Receive specific, measurable recommendations to improve immediately'
              },
              {
                title: '🎯 Highlight Strengths',
                desc: 'Learn how to better showcase your achievements and skills'
              },
              {
                title: '🔗 LinkedIn Correlation',
                desc: 'Compare with LinkedIn profile and identify gaps'
              },
              {
                title: '📊 Skill Analysis',
                desc: 'See which skills are most relevant for your target roles'
              },
              {
                title: '🚀 Job Matching',
                desc: 'Better recommendations based on your resume content'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple Resumes */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Upload Multiple Resumes</h2>
          <div className="bg-white rounded-lg p-8 border border-purple-200">
            <p className="text-gray-700 mb-4">
              You can upload multiple resume versions for different roles:
            </p>
            <div className="space-y-3">
              {[
                '🎯 Generic version - for general applications',
                '💼 Manager-focused - highlighting leadership experience',
                '🔧 Technical-focused - emphasizing technical skills',
                '🚀 Startup version - for fast-paced environments'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-600 font-bold">•</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Ready to Upload?</h2>
          
          <div className="space-y-4 mb-8">
            {[
              { step: '1', title: 'Have your resume ready', note: 'PDF or Word document' },
              { step: '2', title: 'Click "Upload Resume"', note: 'On the Resume page' },
              { step: '3', title: 'Drag & drop or select file', note: 'Upload completes instantly' },
              { step: '4', title: 'View analysis results', note: 'See ATS score and recommendations' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition text-center"
            >
              Upload Resume Now
            </Link>
            <Link
              href="/flows/step-1-profile"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-lg transition"
            >
              Back to Step 1
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
              { num: '2', title: 'Upload Resume', active: true },
              { num: '3', title: 'Get Recommendations', active: false },
              { num: '4', title: 'Prepare & Apply', active: false }
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center p-6 rounded-lg transition ${
                  step.active
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl ${
                  step.active ? 'bg-white text-purple-600' : 'bg-gray-100 text-gray-600'
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
