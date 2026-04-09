# JobSeeker AI - Frontend

An AI-powered job search platform that helps users optimize their resumes, prepare for interviews, and find the right career opportunities.

## 🎯 Features

### 1. **Profile Creation Module**
- Create a comprehensive profile with domain, skills, and career interests
- Store career goals, experience levels, and salary expectations
- Drive all personalized recommendations

### 2. **Resume Management System**
- Upload and manage multiple resumes
- AI-powered resume skill distribution analysis
- Real-time ATS (Applicant Tracking System) score calculation
- Intelligent improvement suggestions based on industry standards

### 3. **Resume Analyzer**
- Evaluate resume formatting and content quality
- Keyword optimization recommendations
- Suggestions for improvement
- Detailed analytics on resume strengths and weaknesses

### 4. **AI Resume Generator**
- Automatically generate resumes from stored profile data
- Multiple professional templates to choose from
- One-click customization based on job descriptions

### 5. **Resume Customization Module**
- Tailor resumes according to specific job descriptions
- Skill matching and highlighting
- Improved selection chances through targeted content

### 6. **Quiz Generator & Adaptive Learning**
- Domain-specific technical quizzes
- Adaptive difficulty based on performance
- Performance tracking and insights
- Personalized learning recommendations

### 7. **Interview Preparation Module**
Comprehensive preparation for all interview rounds:
- **Aptitude Round**: Logical reasoning, quantitative skills
- **Technical Round**: DSA, system design, problem-solving
- **Managerial Round**: Leadership, communication skills
- **HR Round**: Cultural fit, experience discussions
- Includes mock tests, quizzes, and real-time feedback

### 8. **LinkedIn Job Parser**
- Paste LinkedIn job post links
- AI extracts job requirements and key skills
- Auto-customizes resume for matched opportunities
- One-click job application tracking

### 9. **Domain Analysis Module**
- Identifies skill gaps in your domain
- Recommends learning paths based on industry demand
- Tracks skill progression
- Suggests relevant certifications and courses

### 10. **AI-Powered Job Recommendations**
- Personalized job suggestions based on profile
- Smart job matching algorithm
- Career growth trajectory analysis
- Salary insights and market trends

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **API Client**: Custom fetch-based HTTP client
- **Linting**: ESLint

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Running backend server (http://localhost:5000)

## 🚀 Getting Started

### Installation

1. Clone the repository (if needed) or navigate to the frontend directory:

```bash
cd c:\Users\Aditya\Downloads\job-seeeker\project-original\frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file (copy from `.env.example`):

```bash
copy .env.example .env.local
```

4. Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=JobSeeker AI
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Auth Provider
│   │   ├── page.tsx                   # Landing page
│   │   ├── login/
│   │   │   └── page.tsx               # Login/Register page
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Main dashboard
│   │   ├── profile/
│   │   │   └── page.tsx               # Profile creation
│   │   ├── resume/
│   │   │   └── page.tsx               # Resume manager
│   │   ├── quiz/
│   │   │   └── page.tsx               # Quiz generator
│   │   ├── interview-prep/
│   │   │   └── page.tsx               # Interview preparation
│   │   └── linkedin/
│   │       └── page.tsx               # LinkedIn job parser
│   ├── components/
│   │   ├── Navbar.tsx                 # Navigation component
│   │   └── ...                        # Other reusable components
│   ├── contexts/
│   │   └── AuthContext.tsx            # Authentication context
│   ├── lib/
│   │   └── api-client.ts              # API client for backend
│   └── styles/
│       └── globals.css                # Global styles
├── public/                            # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. 

### Key API Endpoints Connected:

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

**Profile:**
- `POST /api/profile/create` - Create user profile
- `GET /api/profile/get` - Get user profile
- `PUT /api/profile/update` - Update profile

**Resume:**
- `POST /api/resume/upload` - Upload resume
- `GET /api/ats-score` - Get ATS score
- `POST /api/resume/analyze` - Analyze resume
- `POST /api/resume/customize` - Customize for job

**Quiz:**
- `POST /api/generate-quiz` - Generate quiz
- `POST /api/quiz/{id}/submit` - Submit answers

**Interview:**
- `GET /api/interview-prep/{roundType}` - Get questions
- `POST /api/interview-prep/{roundType}/submit` - Submit feedback

**Jobs:**
- `GET /api/recommend-jobs` - Get recommendations
- `POST /api/parse-linkedin-job` - Parse LinkedIn job

**Other:**
- `POST /api/chat` - AI chat endpoint

## 🔐 Security

- JWT tokens stored in localStorage (can be upgraded to secure httpOnly cookies)
- API calls include authorization headers
- Environment variables for sensitive configuration
- CORS handled by backend

## 🎨 UI/UX Features

- Modern gradient design inspired by offer-tracker
- Responsive layout (mobile-first)
- Smooth animations and transitions
- Loading states and error handling
- Progress indicators and success messages
- Intuitive navigation and user flows

## 🚦 Development Workflow

1. **Hot Reload**: Changes auto-refresh during development
2. **Type Safety**: Full TypeScript support
3. **ESLint**: Code quality checks
4. **Tailwind CSS**: Utility-first styling

## 📱 Responsive Design

- Mobile-first approach
- Tablets: 768px and up
- Desktop: 1024px and up
- Optimized for all screen sizes

## 🔄 Authentication Flow

1. User lands on home page
2. Clicks "Get Started" → redirects to `/login`
3. Can sign up or log in
4. JWT token stored in localStorage
5. Redirects to `/dashboard` on success
6. All protected routes check authentication
7. Logout clears token and returns to home

## 🧪 Testing the App

### Demo Credentials:
- Email: `demo@example.com`
- Password: `demo123`

### Test Flow:
1. Go to `http://localhost:3000`
2. Click "Get Started"
3. Register or use demo credentials
4. Create profile with domain and skills
5. Upload a sample resume
6. Check ATS score
7. Try quiz generator
8. Practice interview prep
9. Parse a LinkedIn job post

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please follow the project structure and maintain code quality.

## 📄 License

This project is part of the JobSeeker AI Platform.

---

**Ready to transform your job search?** Start at `http://localhost:3000`! 🚀

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
