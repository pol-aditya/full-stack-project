const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Profile endpoints
  async createProfile(profileData: any) {
    return this.makeRequest('/profile/create', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile() {
    return this.makeRequest('/profile/get');
  }

  async updateProfile(profileData: any) {
    return this.makeRequest('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Resume endpoints
  async uploadResume(file: File, userId: string = 'demo-user') {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', userId);
    return this.makeRequest('/upload-resume', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async getResumeAnalysis(userId: string = 'demo-user') {
    return this.makeRequest('/resume-analysis', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async generateResume(data: any) {
    return this.makeRequest('/generate-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeResume(resumeText: string) {
    return this.makeRequest('/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText }),
    });
  }

  async getATSScore() {
    return this.makeRequest('/ats-score');
  }

  async customizeResume(jobDescription: string, resumeId: string) {
    return this.makeRequest('/resume/customize', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, resumeId }),
    });
  }

  // Job matching endpoints
  async matchJobWithResume(jobId: string, userId: string = 'demo-user') {
    return this.makeRequest('/match-job', {
      method: 'POST',
      body: JSON.stringify({ jobId, userId }),
    });
  }

  async getJobRecommendations(userId: string = 'demo-user', limit: number = 10) {
    return this.makeRequest('/job-recommendations', {
      method: 'POST',
      body: JSON.stringify({ userId, limit }),
    });
  }

  // Quiz endpoints
  async generateQuiz(domain: string) {
    return this.makeRequest('/generate-quiz', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
  }

  async submitQuizAnswers(quizId: string, answers: any) {
    return this.makeRequest(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async searchJobs(query: string) {
    return this.makeRequest(`/jobs/search?query=${encodeURIComponent(query)}`);
  }

  // LinkedIn endpoints
  async parseLinkedInJob(url: string) {
    return this.makeRequest('/parse-linkedin-job', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Chat endpoints
  async chat(question: string) {
    return this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Domain analysis endpoints
  async getDomainAnalysis(domain: string) {
    return this.makeRequest(`/domain/analysis?domain=${encodeURIComponent(domain)}`);
  }

  // Interview prep endpoints
  async getInterviewQuestions(roundType: 'aptitude' | 'technical' | 'managerial' | 'hr') {
    return this.makeRequest(`/interview-prep/${roundType}`);
  }

  async submitInterviewFeedback(roundType: string, answers: any) {
    return this.makeRequest(`/interview-prep/${roundType}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  }
}

export const apiClient = new ApiClient();
