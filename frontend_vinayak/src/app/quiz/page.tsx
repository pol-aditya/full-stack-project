'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

const DOMAINS = ['Python', 'JavaScript', 'AWS', 'System Design', 'Data Structures', 'Databases'];

export default function QuizPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [quizData, setQuizData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleStartQuiz = async () => {
    if (!selectedDomain) return;

    setIsLoading(true);
    try {
      const response = await apiClient.generateQuiz(selectedDomain);
      if (response.success) {
        setQuizData(response.data);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
      }
    } catch (error) {
      console.error('Failed to start quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.submitQuizAnswers(quizData?.id || '', answers);
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Failed to submit quiz');
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <div className="text-6xl font-bold text-blue-600 mb-6">
            {results?.score || 0}%
          </div>
          <p className="text-gray-600 text-lg mb-8">
            {results?.feedback || 'Great job! Keep practicing to improve.'}
          </p>
          <button
            onClick={() => {
              setQuizStarted(false);
              setSelectedDomain('');
              setResults(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adaptive Quiz Generator</h1>
          <p className="text-gray-600 mb-8">
            Test your knowledge with domain-specific quizzes tailored to your learning level
          </p>

          <div className="max-w-2xl">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Select Domain
            </label>
            <grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {DOMAINS.map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`p-4 rounded-lg font-semibold transition ${
                    selectedDomain === domain
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </grid>

            <button
              onClick={handleStartQuiz}
              disabled={!selectedDomain || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Starting...' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {(question.options || []).map((option: string, idx: number) => (
              <label key={idx} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerChange(option)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion < quizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
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
              {isLoading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
