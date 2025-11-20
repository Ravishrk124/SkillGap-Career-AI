# CodeAtRandom AI - Skill Gap Analysis & Career Roadmap

A full-stack web application that analyzes skill gaps, generates career roadmaps, and integrates with HackerNews API to display the latest tech news.

## 🚀 Live Demo

- **Frontend**: https://skill-gap-career-ai.vercel.app/
- **Backend API**: https://skillgap-career-ai.onrender.com

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Assumptions & Design Decisions](#assumptions--design-decisions)

## ✨ Features

### 1. Career Goal Input
- Select target role from predefined options (Backend Developer, Frontend Developer, Data Analyst)
- Enter current skills as comma-separated values
- Real-time input validation and error feedback

### 2. Skill Gap Analyzer
- Compares user skills with role requirements
- Displays matched and missing skills
- Provides AI-powered recommendations
- Shows suggested learning order

### 3. Career Roadmap Generator  
- Generates 3-phase learning roadmap based on target role
- Provides specific timeframes and focus areas
- Customized for each role (Backend, Frontend, Data Analyst)

### 4. HackerNews Integration
- Fetches top 5 latest tech stories
- Displays: Title, URL, Score, Author, Type, and Date
- Updates automatically on page load

### 5. Responsive Dashboard
- Clean, minimal UI with Tailwind CSS
- Mobile-responsive design
- Left panel: Skill gap analysis
- Right panel: Career roadmap
- Bottom section: Tech news

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0 + Vite 7.2.4
- **Styling**: Tailwind CSS 3.x
- **HTTP Client**: Axios 1.13.2
- **Language**: JavaScript (ES6+)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.21.1
- **Middleware**: CORS, Body-Parser
- **HTTP Client**: Axios 1.7.7
- **Language**: JavaScript

## 📁 Project Structure

```
codeatrandom-assignment/
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind CSS styles
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── backend/
│   ├── server.js             # Express server with all APIs
│   ├── package.json          # Backend dependencies
│   └── .env.example          # Environment variables template
└── README.md                 # This file
```

## 🔌 API Endpoints

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: (To be updated after deployment)

### 1. POST /api/skill-gap
Analyzes the gap between user's current skills and target role requirements.

**Request Body:**
\`\`\`json
{
  "role": "Backend Developer",
  "skills": "Java, SQL, HTML"
}
\`\`\`

**Response:**
\`\`\`json
{
  "role": "Backend Developer",
  "matchedSkills": ["Java", "SQL"],
  "missingSkills": ["Spring Boot", "APIs", "Git"],
  "recommendations": [
    "Master Spring Boot to fit the Backend Developer role.",
    "Master APIs to fit the Backend Developer role.",
    "Master Git to fit the Backend Developer role."
  ],
  "suggestedLearningOrder": ["Spring Boot", "APIs", "Git"]
}
\`\`\`

### 2. POST /api/roadmap
Generates a 3-phase learning roadmap for the target role.

**Request Body:**
\`\`\`json
{
  "role": "Backend Developer"
}
\`\`\`

**Response:**
\`\`\`json
{
  "role": "Backend Developer",
  "roadmap": [
    {
      "phase": "Phase 1 (1-2 months)",
      "focus": "Java Basics, OOP Concepts, Git Version Control"
    },
    {
      "phase": "Phase 2 (2 months)",
      "focus": "Spring Boot Framework, REST APIs, SQL Databases"
    },
    {
      "phase": "Phase 3 (1-2 months)",
      "focus": "Microservices Architecture, Cloud Deployment (AWS), System Design"
    }
  ]
}
\`\`\`

### 3. GET /api/news
Fetches top 5 latest tech stories from HackerNews API.

**Response:**
\`\`\`json
[
  {
    "title": "Show HN: My Cool Project",
    "url": "https://example.com",
    "score": 245,
    "time": "11/20/2025",
    "type": "story",
    "by": "username"
  }
]
\`\`\`

### 4. GET /api/health
Health check endpoint to verify server status.

**Response:**
\`\`\`json
{
  "status": "OK",
  "message": "CodeAtRandom AI API is running",
  "timestamp": "2025-11-20T17:44:11.123Z"
}
\`\`\`

## 🏃 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. (Optional) Create a `.env` file for custom configuration:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The backend server will run on `http://localhost:5000`

**Available Scripts:**
- `npm start` - Run in production mode
- `npm run dev` - Run with nodemon (auto-restart on changes)

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:5173`

**Available Scripts:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Create an account on Render.com or Railway.app
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variable: `PORT=5000`
7. Deploy!

### Frontend Deployment (Vercel)

1. Create an account on Vercel.com
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`
5. Deploy!

### Post-Deployment
Update the `API_BASE_URL` in `frontend/src/App.jsx` to point to your deployed backend URL.

## 🧠 Assumptions & Design Decisions

### 1. Skill Matching Logic
- **Case-insensitive matching**: "java" matches "Java"
- **Exact word matching**: "JavaScript" won't match "Java"
- Skills are trimmed and normalized for accurate comparison

### 2. Predefined Skill Sets
The application uses a fixed JSON structure with skills for three roles:
- **Frontend Developer**: HTML, CSS, JavaScript, React, Git
- **Backend Developer**: Java, Spring Boot, SQL, APIs, Git
- **Data Analyst**: Excel, SQL, Python, Dashboards, Statistics

This could be extended to a database for dynamic skill management.

### 3. Roadmap Generation
- Uses **mock AI logic** (hardcoded roadmaps)
- Each role has a specific 3-phase roadmap
- Generic roadmap provided for unknown roles
- Could be enhanced with real AI integration (OpenAI, Gemini)

### 4. Error Handling
- Input validation on both frontend and backend
- User-friendly error messages
- Graceful degradation (news section won't block main functionality)

### 5. UI/UX Design
- **Minimal by design**: Focused on functionality over aesthetics
- Responsive layout works on mobile and desktop
- Clear visual hierarchy with color coding:
  - Green for matched skills
  - Red for missing skills
  - Blue for recommendations
  - Purple for learning order

### 6. No Database
- All data is in-memory (ROLE_SKILLS constant)
- For production, would recommend:
  - PostgreSQL/MongoDB for storing user analyses
  - Redis for caching HackerNews data

### 7. CORS Configuration
- Currently allows all origins for development
- Should be restricted to frontend domain in production

## 📝 Future Enhancements

1. **User Authentication**: Save and track progress
2. **More Roles**: Expand beyond 3 roles
3. **Dynamic Skills**: Admin panel to manage skill sets
4. **Learning Resources**: Suggest courses, books, tutorials
5. **Progress Tracking**: Track which skills user has learned
6. **Analytics Dashboard**: Visual charts and graphs
7. **Email Notifications**: Send roadmap via email

## 👤 Author

**Ravish Kumar**  
CodeAtRandom AI Full Stack Developer Assignment

## 📄 License

This project is for assignment purposes only.

---

**Last Updated**: November 20, 2025
