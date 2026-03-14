# 🧠 AI Interview Prep — Master Coding Interviews

A full-stack web application to help developers master coding interviews through AI-powered mock interviews, real-time code review, progress tracking, and a competitive leaderboard.

---

## 🔗 Links

- 🌐 **Live Demo** — [https://ai-interview-prep-y3m3.onrender.com](https://ai-interview-prep-y3m3.onrender.com)
- 💻 **GitHub** — [https://github.com/ashwinmali7781/AI-Interview-Prep](https://github.com/ashwinmali7781/AI-Interview-Prep)

---

## ✨ Features

- 🔐 **Authentication** — Sign up, login, logout via Supabase Auth
- 💻 **Coding Practice** — Solve problems in a VS Code-style Monaco editor
- 🤖 **AI Code Review** — Get instant feedback from Claude AI on your solution
- 🎤 **AI Mock Interviews** — Chat-based technical interview with scoring
- 🔥 **Streak Tracker** — Daily practice streak like LeetCode/Duolingo
- 📊 **Progress Dashboard** — Stats, difficulty bars, category performance chart
- 🏆 **Leaderboard** — Compete with other users, podium for top 3
- 🔖 **Bookmarks** — Save problems to revisit later
- 🏢 **Company Filters** — Filter by Google, Meta, Amazon, Microsoft, Apple
- ⏱️ **Live Timer** — Track time spent on each problem
- 📋 **Copy Code** — One-click copy button in the editor
- 🌙 **Dark Mode** — Toggle dark/light theme, persists in localStorage
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| Vite | 5.4.8 | Build tool & dev server |
| React Router DOM | 6.26.2 | Client-side routing |
| Tailwind CSS | 3.4.13 | Utility-first styling |
| Framer Motion | 11.9.0 | Animations |
| shadcn/ui | latest | Component library |
| Radix UI | various | Accessible primitives |
| Lucide React | 0.462.0 | Icons |

### Backend & Database
| Technology | Version | Purpose |
|---|---|---|
| Supabase | 2.45.0 | Database, Auth, Realtime |
| PostgreSQL | via Supabase | Data storage |
| TanStack Query | 5.56.2 | Server state management |

### Editor & Charts
| Technology | Version | Purpose |
|---|---|---|
| Monaco Editor | 4.6.0 | VS Code-style code editor |
| Recharts | 2.12.7 | Dashboard charts |

### AI
| Technology | Purpose |
|---|---|
| Anthropic Claude API | AI code review |
| claude-sonnet-4-20250514 | Model used for reviews |

---

## 📁 Project Structure
```
AI-Interview-Prep/
├── public/
│   ├── vite.svg              # Favicon
│   └── _redirects            # SPA routing fix
├── src/
│   ├── components/
│   │   ├── ui/               # 49 shadcn/ui components
│   │   ├── AppNavbar.jsx     # Navigation with dark mode toggle
│   │   ├── AppLayout.jsx     # Page layout wrapper
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx   # Auth state management
│   │   └── ThemeContext.jsx  # Dark/light mode
│   ├── hooks/
│   │   └── use-toast.js
│   ├── integrations/
│   │   └── supabase/client.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PracticePage.jsx
│   │   ├── InterviewPage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🗄️ Database Schema
```
auth.users
    │
    ├──► profiles           (1:1)
    ├──► practice_history   (1:many)
    ├──► interview_sessions (1:many)
    ├──► bookmarks          (1:many)
    └──► streaks            (1:1)

questions
    ├──► practice_history   (1:many)
    └──► bookmarks          (1:many)
```

| Table | Purpose |
|---|---|
| `profiles` | User display name, avatar, created date |
| `questions` | Problems with difficulty, category, company, starter code |
| `practice_history` | Submissions, correctness, time spent |
| `interview_sessions` | Mock interview scores and feedback |
| `bookmarks` | Saved questions per user |
| `streaks` | Daily practice streak tracking |

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/ashwinmali7781/AI-Interview-Prep.git
cd AI-Interview-Prep
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

### 4. Set up Supabase database
- Go to **Supabase → SQL Editor**
- Run the schema SQL from `/supabase/migrations/`
- Creates all 6 tables, RLS policies, triggers, and 10 sample questions

### 5. Start dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment

Live at → [https://ai-interview-prep-y3m3.onrender.com](https://ai-interview-prep-y3m3.onrender.com)

Deployed on **Render** as a Static Site.

| Field | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Environment variables on Render:
```env
VITE_SUPABASE_URL             = your supabase url
VITE_SUPABASE_PUBLISHABLE_KEY = your anon key
```

---

## 📜 Scripts
```bash
npm run dev      # Start dev server → localhost:5173
npm run build    # Build for production → dist/
npm run preview  # Preview production build
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | ✅ |

> ⚠️ Never commit your `.env` file — it is already in `.gitignore`

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch — `git checkout -b feature/your-feature`
3. Commit — `git commit -m "add feature"`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal or commercial purposes.

---

## 👨‍💻 Author

**Ashwin Mali**
- GitHub — [@ashwinmali7781](https://github.com/ashwinmali7781)
- Live Project — [ai-interview-prep-y3m3.onrender.com](https://ai-interview-prep-y3m3.onrender.com)

---

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Supabase](https://supabase.com/) — Backend as a service
- [Anthropic](https://anthropic.com/) — Claude AI API
- [Radix UI](https://radix-ui.com/) — Accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) — Styling framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — Code editor
- [Recharts](https://recharts.org/) — Chart library
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Vite](https://vitejs.dev/) — Build tool
