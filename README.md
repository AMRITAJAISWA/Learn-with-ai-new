# LearnWithAI 🚀

> **"Learn Smarter. Learn Together. Learn With AI."**

LearnWithAI is a production-grade, AI-powered personalized learning platform for students. It unifies neural curriculum generation, curated educational video streams, an interactive AI tutor, step-by-step doubt solving, diagnostic active-recall quizzes, smart spaced revision, interactive 3D flashcards, detailed learning analytics, and high-compatibility study buddy matching.

---

## 🌟 Key Features

### 1. 🎞️ 148-Frame Sticky Scrollytelling Showcase
- **Source**: 148 high-definition frames rendered in a smooth, hardware-accelerated HTML5 `<canvas>`.
- **Zero Memory Leaks**: Progressive active-window caching preloads nearby frames on demand while discarding distant textures, preventing memory bloat.
- **Synced Scrollytelling**: Four distinct educational phases (Goal Analysis, Knowledge Curation, Active Mastery, and Peer Synergy) animate smoothly based on viewport scroll progress.

### 2. 🌌 Universal Plasma Cursor Gesture
- **Inspiration**: Ported from fluid simulation principles (Navier-Stokes advection, velocity diffusion, and viscosity).
- **Aesthetic**: Cosmic indigo (`#2563EB`), sky blue (`#38BDF8`), cyan (`#06B6D4`), and violet swirls track pointer velocity and burst on clicks.
- **Controls**: Ambient overlay with non-blocking pointer events (`pointer-events: none`) and a global toggle switch in both the navbar and settings.

### 3. 🧠 Neural Course Generator
- Input: Learning goal, current skill level, daily time budget, duration, and target milestone.
- Generates structured courses with modules, topics, prerequisites, key takeaways, and estimated minutes.
- Real-time lesson progress tracking (`Not Started`, `In Progress`, `Completed`) with completion percentages.

### 4. 🎥 Contextual Video Recommendations
- Powered by the YouTube Data API v3 (with curated zero-clickbait fallback library).
- Filter by difficulty (Beginner, Intermediate, Advanced) and duration (Short vs Deep Dive).
- In-platform **Focus Mode** modal player with zero algorithmic distractions.

### 5. 🤖 24/7 AI Learning Assistant & Tutor
- Context-aware tutor that knows your current course and active topic.
- One-click accelerator prompts:
  - 💡 **Explain Simply**: Intuitive analogies for complex mechanisms.
  - 💻 **Give Example**: Clean, step-by-step code demonstrations.
  - 📋 **Summarize**: 3-bullet high-impact retention summaries.
  - 🎯 **Quiz Me**: Instant diagnostic questions with hints.

### 6. 💡 Step-by-Step AI Doubt Solver
- Multimodal support: Submit code, mathematics, or upload problem diagrams/screenshots.
- Structured output:
  1. What the problem is asking
  2. Core concepts & prerequisites required
  3. Step-by-step pedagogical breakdown
  4. Final verified answer & algorithmic complexity
  5. Similar practice challenge for active retention

### 7. 📝 Quiz & Test Center
- Generate diagnostic quizzes on any topic or difficulty.
- Instant submission scoring, celebratory confetti, detailed explanation review, and automatic weak-spot detection.

### 8. 🔄 Smart Spaced Revision & 3D Flashcards
- Spaced-repetition scheduler that calculates retention intervals and difficulty.
- Daily revision queue with "Review Now", "Mark as Known", and "Need Practice" buttons.
- 3D interactive flip cards with mastery levels (0 to 5) and on-demand AI deck generation.

### 9. 👥 Study Buddy Matching & Real-Time Chat
- Transparent compatibility matching algorithm based on shared courses (+18%), identical skill level (+12%), schedule alignment (+10%), and common interests (+10%).
- Detailed buddy profiles with "Why You Matched" breakdowns.
- 1-on-1 messaging with timestamps, online badges, and **"Ask AI"** assistant in chat.
- Collaborative study session scheduler with goals and participant tracking.

### 10. 📊 Personalized Progress Dashboard & Gamification
- Recharts visualizations: Weekly study time and diagnostic quiz accuracy progression.
- Daily learning streak (🔥), total XP (🏆), level ranks, and AI insights.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS 3D Transforms, Custom Glassmorphism
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Visuals & Charts**: Recharts, Canvas Confetti, HTML5 Canvas
- **Icons**: Lucide React
- **Validation**: Zod
- **AI Services**: Modular architecture (`lib/ai/`) compatible with Google Gemini & OpenAI models.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended, v26 tested)
- npm (v9+)

### 2. Environment Configuration
Copy the provided `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# 1. PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learnwithai?schema=public"

# 2. Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# 3. AI / LLM API (Google Gemini or OpenAI)
# Leave blank to automatically use rich neural fallback responses
LLM_API_KEY=""
LLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
LLM_MODEL="gemini-1.5-flash"

# 4. YouTube Data API v3
# Leave blank to use curated verified educational library
YOUTUBE_API_KEY=""

# 5. Demo Mode (allows 1-click evaluation without external services)
NEXT_PUBLIC_DEMO_MODE="true"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup (Prisma)
Generate the Prisma Client:
```bash
npx prisma generate
```

To sync schema with your PostgreSQL instance:
```bash
npx prisma db push
```

*(Note: If PostgreSQL is offline, LearnWithAI features an automatic in-memory dual-layer store that allows complete evaluation out of the box).*

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```

---

## 🔑 External Integration Guides

### How to Configure Clerk Authentication
1. Go to [clerk.com](https://clerk.com) and create an application.
2. Under **API Keys**, copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
3. Paste them into `.env.local`.
4. Set the redirect paths:
   - Sign In: `/login`
   - Sign Up: `/signup`
   - After Sign In: `/dashboard`
   - After Sign Up: `/onboarding`

### How to Configure PostgreSQL
1. Install PostgreSQL locally or spin up a free instance on Supabase, Neon, or Railway.
2. Obtain your connection string: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`.
3. Put it in `DATABASE_URL` in `.env.local`.
4. Run `npx prisma db push` to create all tables and relations.

### How to Configure the LLM API (Google Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/) and create an API key.
2. Set in `.env.local`:
   ```env
   LLM_API_KEY="your-gemini-api-key"
   LLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
   LLM_MODEL="gemini-1.5-flash"
   ```
3. The AI service layer automatically handles prompt formatting and JSON extraction.

### How to Configure YouTube Data API v3
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3**.
3. Create an API key under **Credentials**.
4. Paste it into `YOUTUBE_API_KEY` in `.env.local`.
