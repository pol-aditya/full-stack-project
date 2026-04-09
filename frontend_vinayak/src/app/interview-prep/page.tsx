'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function InterviewPrepPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState<'aptitude' | 'technical' | 'managerial' | 'hr' | null>(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const roundDetails = {
    aptitude: {
      title: '📐 Aptitude Round',
      desc: 'Logical reasoning, quantitative & verbal skills',
      color: 'from-blue-400 to-blue-600'
    },
    technical: {
      title: '💻 Technical Round',
      desc: 'DSA, system design, problem-solving',
      color: 'from-purple-400 to-purple-600'
    },
    managerial: {
      title: '👔 Managerial Round',
      desc: 'Leadership, communication, decision-making',
      color: 'from-green-400 to-green-600'
    },
    hr: {
      title: '🤝 HR Round',
      desc: 'Cultural fit, experience, aspirations',
      color: 'from-orange-400 to-orange-600'
    }
  };

  const handleStartRound = async (round: 'aptitude' | 'technical' | 'managerial' | 'hr') => {
    setSelectedRound(round);
    setIsLoading(true);
    try {
      const response = await apiClient.getInterviewQuestions(round);
      if (response.success) {
        setQuestions(response.data?.questions || []);
        setAnswers(new Array((response.data?.questions || []).length).fill(''));
        setCurrentQuestion(0);
        setQuestionsLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.submitInterviewFeedback(selectedRound || '', {
        answers,
        questions
      });
      if (response.success) {
        setFeedback(response.data?.feedback || 'Interview completed!');
      }
    } catch (error) {
      console.error('Failed to submit');
    } finally {
      setIsLoading(false);
    }
  };

  if (feedback) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Interview Feedback</h1>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
            <p className="text-gray-700 whitespace-pre-wrap text-lg">{feedback}</p>
          </div>
          <button
            onClick={() => {
              setSelectedRound(null);
              setQuestionsLoaded(false);
              setFeedback('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Try Another Round
          </button>
        </div>
      </div>
    );
  }

  if (!selectedRound) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
          <p className="text-gray-600 text-lg">
            Prepare for all stages of the interview process with targeted questions and feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(roundDetails).map(([key, detail]: any) => (
            <button
              key={key}
              onClick={() => handleStartRound(key as any)}
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-r ${detail.color} rounded-lg p-8 text-white h-full shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                <h3 className="text-2xl font-bold mb-2">{detail.title}</h3>
                <p className="text-white/90 mb-6">{detail.desc}</p>
                <div className="inline-block bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-white/30 transition">
                  Start Preparation →
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Interview Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Practice Regularly', desc: 'Consistent practice improves performance' },
              { title: 'Time Management', desc: 'Answer questions within the time limit' },
              { title: 'Clear Communication', desc: 'Explain your thought process clearly' },
              { title: 'Mock Interviews', desc: 'Practice with realistic scenarios' }
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-gray-600 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!questionsLoaded || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{question}</h2>

        {/* Answer Input */}
        <textarea
          value={answers[currentQuestion]}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Type your answer here..."
        />

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 rounded-lg transition disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit & Get Feedback'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
