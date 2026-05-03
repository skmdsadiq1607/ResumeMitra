# ResumeMitra – AI-Powered ATS Resume Grader

> A production-style MERN web application that helps job seekers optimize their resumes for ATS systems using Google Gemini AI.

![ResumeMitra Banner](https://img.shields.io/badge/Status-Production%20Ready-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

---

## ✨ Features

- **AI-Powered Analysis** – Uses Google Gemini API to analyze resumes vs job descriptions
- **ATS Score (0-100)** – Overall compatibility score with section breakdown
- **Keyword Analysis** – Matched + missing keywords from JD
- **AI Suggestions** – 6+ specific, actionable improvement tips
- **Rewritten Bullet Points** – AI-optimized versions of weak bullet points
- **Section-wise Scoring** – Skills, Experience, Education, Projects, Keywords, Formatting
- **Resume History** – View and compare past analyses
- **JWT Authentication** – Secure login/register with token persistence
- **Premium Dark UI** – Glassmorphism, gradient accents, smooth animations

---

## 📁 Project Structure

```
ResumeMithra/
├── Backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── multer.js           # File upload config
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Profile
│   │   ├── resumeController.js # Upload, Analyze, History
│   │   └── dashboardController.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT + role-based guard
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── User.js             # User schema with password hashing
│   │   └── ResumeReport.js     # Full analysis report schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── resume.js           # Resume routes
│   │   └── dashboard.js        # Dashboard routes
│   ├── services/
│   │   └── geminiService.js    # Gemini AI integration + prompt
│   ├── utils/
│   │   ├── apiResponse.js      # Standardized JSON responses
│   │   ├── extractText.js      # PDF text extraction
│   │   └── jwtUtils.js         # Token generation
│   ├── uploads/                # Uploaded PDFs (gitignored)
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
└── Frontend/                   # React + Vite SPA
    ├── src/
    │   ├── components/
    │   │   ├── layout/         # Navbar, Sidebar, Footer, DashboardNavbar
    │   │   └── ui/             # ScoreCircle, SectionScoreBar, ReportCard, Skeleton
    │   ├── layouts/            # MainLayout, DashboardLayout
    │   ├── pages/              # All 8 pages
    │   ├── services/           # API + resumeService
    │   ├── stores/             # Zustand authStore (persisted)
    │   └── utils/              # Helper functions
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key → [Get it here](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy and configure environment
copy .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai_resume_grader
JWT_SECRET=your_strong_secret_here_at_least_32_chars
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
MAX_FILE_SIZE_MB=5
CLIENT_URL=http://localhost:5173
```

```bash
# Start in development (with hot reload)
npm run dev

# Start in production
npm start
```

Backend runs at → `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at → `http://localhost:5173`

> **Note**: Vite proxies `/api` to `localhost:5000` automatically in development.

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile name |

### Resume Analysis
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resume/upload` | ✅ | Upload PDF (multipart/form-data) |
| POST | `/api/resume/analyze` | ✅ | Upload PDF + JD → AI analysis |
| GET | `/api/resume/history` | ✅ | Paginated analysis history |
| GET | `/api/resume/report/:id` | ✅ | Get single report |
| DELETE | `/api/resume/report/:id` | ✅ | Delete a report |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | ✅ | Aggregated user stats |

---

## 🤖 Gemini AI Integration

The AI prompt is located in `Backend/services/geminiService.js`. It sends resume text + JD to Gemini and expects this structured JSON response:

```json
{
  "overallScore": 78,
  "summary": "Executive summary of ATS compatibility...",
  "extractedKeywords": ["React", "Node.js", "..."],
  "matchedKeywords": ["React", "TypeScript", "..."],
  "missingKeywords": ["Kubernetes", "AWS", "..."],
  "sectionScores": {
    "skills": 82,
    "experience": 75,
    "education": 90,
    "projects": 70,
    "keywords": 68,
    "formatting": 80
  },
  "aiSuggestions": ["Add metrics to your bullet points...", "..."],
  "rewrittenBulletPoints": ["▸ Led development of...", "..."]
}
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | Zustand (persisted) |
| Data Fetching | TanStack React Query |
| File Upload UI | React Dropzone |
| HTTP Client | Axios |
| Toast | React Hot Toast |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| AI | Google Gemini API |
| Security | Helmet, CORS, Rate Limiting |

---

## 🔐 Environment Variables Reference

### Backend `.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default 5000) | ✓ |
| `MONGODB_URI` | MongoDB connection string | ✓ |
| `JWT_SECRET` | Secret for JWT signing (32+ chars) | ✓ |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) | ✓ |
| `GEMINI_API_KEY` | Google AI Studio API key | ✓ |
| `GEMINI_MODEL` | Model name (default `gemini-1.5-flash`) | ✓ |
| `MAX_FILE_SIZE_MB` | Max upload size in MB | Optional |
| `CLIENT_URL` | Frontend URL for CORS | ✓ |

---

## 🧠 Future Improvements

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Resume PDF preview in browser
- [ ] Export analysis report as PDF
- [ ] Admin analytics dashboard
- [ ] Multiple resume comparison
- [ ] LinkedIn job description import
- [ ] Resume template suggestions
- [ ] Saved job description library
- [ ] Docker + CI/CD pipeline

---

## 📄 License

MIT – Built for learning and portfolio use.
