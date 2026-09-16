# 🎓 StudentOS — Centralized Academic & Attendance Management System

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-RBAC-blueviolet?style=for-the-badge)](https://www.better-auth.com/)
[![Inngest](https://img.shields.io/badge/Inngest-Event_Driven-orange?style=for-the-badge&logo=inngest)](https://www.inngest.com/)

**"Everything a student needs for college, engineered into one high-performance dashboard."**

[Key Features](#-core-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Database Schema](#-database-schema) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-configuration) • [Project Structure](#-project-structure)

</div>

---

## 📌 Overview

**StudentOS** is an institutional-grade, full-stack Academic Operating System designed to end the fragmentation of college life. Built for universities and institutes that use **biometric attendance infrastructure**, StudentOS automates the pipeline from machine logs to student insights, while centralizing coursework, study materials, exam schedules, and AI-powered study assistance.

Instead of navigating disparate portals for biometric logs, class assignments, PDF notes, exam notices, and timetable changes, students, educators, and administrators operate within a unified, real-time ecosystem.

---

## 🌟 Core Features

### 👨‍🎓 1. Student Experience
- **Biometric Attendance Intelligence**: 
  - Real-time overall and subject-level attendance percentages.
  - **Attendance Margin Calculator**: Exact calculation of how many consecutive classes can be safely skipped or how many must be attended to recover to the institutional threshold (e.g., 75%).
  - Detailed daily check-in/check-out biometric punch log history.
- **Academic Gamification**:
  - Daily & weekly attendance streaks.
  - Milestone unlockable achievements and badges (e.g., *Perfect Week*, *Early Bird*, *Academic Master*).
- **Assignments & Deadlines**:
  - Live assignment tracking with status indicators (*Pending*, *Submitted*, *Late*, *Graded*).
  - Multi-file cloud submissions powered by Cloudflare R2 presigned URLs.
  - Grade feedback and score breakdown.
- **Smart Study Materials & Notes**:
  - Download and preview verified lecture notes, slides, and syllabus files by subject.
- **Embedded AI Study Assistant**:
  - In-browser AI Copilot with RAG context support to ask questions against uploaded course notes and lecture PDFs.
- **Live Timetable & Examination Schedules**:
  - Daily class schedules with room numbers, faculty information, and exam timetables with countdown timers.
- **Notices & Communication**:
  - Real-time broadcast feeds filtered by department, semester, and section.

---

### 👩‍🏫 2. Faculty / Teacher Portal
- **Coursework Management**:
  - Create and distribute assignments with strict deadlines, attachment limits, and grading criteria.
  - Submission review dashboard: View student attachments, grade submissions, and provide direct feedback.
- **Resource Repository**:
  - Upload lecture notes, reference PDFs, and syllabus documents with automated background text extraction and vectorization.
- **Targeted Announcements**:
  - Publish notices targeting specific programs, years, or academic sections.
- **Academic Overview**:
  - Monitor aggregate class performance and assignment completion rates without the overhead of manual attendance marking.

---

### 🛡️ 3. Administrator Console
- **Institutional Hierarchy Management**:
  - Complete control over Programs/Degrees, Academic Years, Semesters, Sections, and Subjects.
- **Biometric Attendance Engine**:
  - **Live API Polling**: Scheduled synchronization with hardware biometric API servers.
  - **Bulk Excel/CSV Importer**: Upload batch biometric attendance logs with validation and error reporting.
  - Post-processing queue recalculates percentages, streaks, and sends critical attendance alert notifications.
- **Master Timetable & Exam Scheduler**:
  - Manage weekly timetable slots, room allocations, and semester examination timetables.
- **User & Role Administration**:
  - Manage student records (Enrollment / Roll numbers, biometric mapping IDs) and faculty accounts.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (Next.js 16 + React 19)"]
        UI_Student["Student Dashboard (/student)"]
        UI_Teacher["Teacher Portal (/teacher)"]
        UI_Admin["Admin Console (/admin)"]
        UI_AI["AI Copilot Panel"]
    end

    subgraph AppLayer["Application Layer (Next.js Server Actions & API)"]
        AuthMiddleware["Middleware & RBAC Guard"]
        Actions["Server Actions (Academic, Attendance, Notes, Tasks)"]
        AIService["AI & RAG Engine (Vercel AI SDK + OpenAI)"]
        PresignService["S3 / R2 Presigned URL Generator"]
    end

    subgraph AsyncLayer["Background Job Orchestration (Inngest)"]
        Job_Sync["Biometric API Sync Worker"]
        Job_Import["Excel/CSV Batch Import Worker"]
        Job_Streak["Attendance & Gamification Post-Processor"]
        Job_Vector["Note Vectorizer & PDF Parser"]
        Job_Notify["Notification & Alert Dispatcher"]
    end

    subgraph StorageLayer["Data & Cloud Storage"]
        DB[(PostgreSQL Database via Drizzle ORM)]
        R2[(Cloudflare R2 / S3 Object Storage)]
        BioAPI["Biometric Hardware Machine API"]
    end

    Client -->|HTTPS / Actions| AuthMiddleware
    AuthMiddleware --> Actions
    Actions --> DB
    Actions --> PresignService
    PresignService --> R2
    Actions --> AIService
    AIService --> R2
    
    BioAPI -->|Scheduled Poll| Job_Sync
    Actions -->|Dispatch Events| AsyncLayer
    AsyncLayer --> DB
    AsyncLayer --> R2
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Hybrid SSR, Server Components, and Server Actions |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict, type-safe full-stack development |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | High-performance CSS engine with modern color tokens |
| **Icons & Charts** | [Lucide React](https://lucide.dev/) & [Recharts](https://recharts.org/) | Vector icons and interactive attendance/performance visualizations |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational database (Supabase / Neon / Local PostgreSQL) |
| **ORM & Migrations** | [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit | Lightweight, type-safe SQL ORM and schema migration toolkit |
| **Authentication** | [Better Auth](https://www.better-auth.com/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Session-based authentication with Role-Based Access Control |
| **Background Jobs** | [Inngest 4](https://www.inngest.com/) | Event-driven background jobs, cron synchronization, and retry workflows |
| **Object Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) / [AWS S3](https://aws.amazon.com/s3/) | High-speed, S3-compatible document storage via presigned URLs |
| **AI & NLP** | [Vercel AI SDK](https://sdk.vercel.ai/) & OpenAI | Natural language reasoning, query synthesis, and study assistance |
| **File Processing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) & [xlsx](https://sheetjs.com/) | Server-side parsing of PDF study materials and Excel attendance sheets |

---

## 🗄 Database Schema

The database schema is organized into distinct domain modules in [`db/schema/`](file:///c:/Users/HP/OneDrive/Desktop/ab/fildwork/app/db/schema):

```
db/schema/
├── users.ts           # Users, sessions, accounts, verifications, profiles (Admin/Teacher/Student)
├── academic.ts        # Programs, departments, semesters, sections, subjects
├── attendance.ts      # Biometric machine logs, daily records, aggregate attendance caches
├── assignments.ts     # Assignment declarations, student submissions, grades, file attachments
├── notes.ts           # Course notes, lecture materials, PDF documents
├── schedule.ts        # Weekly timetable slots, room assignments, exam schedules
├── communication.ts   # System-wide, departmental, and sectional announcements
├── gamification.ts    # Streaks, achievement criteria, student earned badges, XP
└── ai.ts              # AI chat history, conversation sessions, document embeddings/chunks
```

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/                # Authentication routes (login, register, forgot-password)
│   ├── admin/                 # Admin console (academic, attendance, timetable, users)
│   ├── student/               # Student portal (attendance, assignments, exams, notes, streaks)
│   ├── teacher/               # Faculty portal (assignments, notes, announcements)
│   ├── api/                   # REST endpoints, Inngest webhook handlers, Presign upload routes
│   ├── layout.tsx             # Root layout with fonts, theme, and toast providers
│   └── page.tsx               # Marketing / landing page and role redirector
├── components/
│   ├── ai/                    # AI Copilot chat drawer and message stream components
│   ├── assignments/           # Assignment creation, submission, and grading widgets
│   ├── attendance/            # Attendance metrics, streak cards, and calendar views
│   ├── dashboard/             # Overview metric cards, quick-action panels
│   ├── notes/                 # Note grid, file previewers, and upload modals
│   ├── notifications/         # Notification dropdowns and alerts
│   ├── timetable/             # Daily and weekly timetable schedule matrix
│   └── ui/                    # Reusable design system primitives (Buttons, Dialogs, Badges)
├── db/
│   ├── schema/                # Drizzle ORM modular schemas
│   ├── migrations/            # Generated SQL migration files
│   └── seed.ts                # Database seeding script for development
├── inngest/                   # Inngest background functions
│   ├── attendance-sync.ts     # Biometric hardware API sync cron
│   ├── excel-import-job.ts    # Async Excel/CSV processor
│   ├── post-attendance-job.ts # Recalculates margins, percentages, and streaks
│   ├── vectorize-notes.ts     # Asynchronous PDF text extraction and indexing
│   └── notifications-job.ts   # Scheduled reminders and notification dispatcher
├── lib/
│   ├── actions/               # Next.js Server Actions (type-safe backend operations)
│   ├── ai/                    # OpenAI / Vercel AI SDK client configuration
│   ├── analytics/             # Attendance margin algorithms & performance analyzers
│   ├── attendance/            # Biometric parsers and sync drivers
│   ├── auth/                  # Better Auth configuration, session helpers, password hashing
│   ├── db/                    # Postgres connection pool and Drizzle client
│   ├── storage/               # AWS S3 / Cloudflare R2 presigned URL generators
│   └── env.ts                 # Type-safe environment variable validation (Zod)
├── middleware.ts              # Global session verification and RBAC route protection
├── drizzle.config.ts          # Drizzle Kit migration and database configuration
├── next.config.ts             # Next.js compiler settings and external image domains
└── package.json               # Dependencies and execution scripts
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory by copying [`.env.example`](file:///c:/Users/HP/OneDrive/Desktop/ab/fildwork/app/.env.example):

```bash
cp .env.example .env.local
```

Populate the required environment variables:

```env
# 1. Database Configuration (PostgreSQL / Supabase / Neon)
DATABASE_URL="postgresql://postgres:password@localhost:5432/studentos"

# 2. Authentication (Better Auth)
BETTER_AUTH_SECRET="your-super-secret-auth-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# 3. Object Storage (Cloudflare R2 / AWS S3)
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="studentos-files"

# 4. Background Job Processing (Inngest)
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# 5. Biometric Attendance Machine API (Optional for direct sync)
ATTENDANCE_API_URL="https://biometrics.college.edu/api/v1/logs"
ATTENDANCE_API_KEY="your-attendance-api-key"

# 6. AI Assistant & Embeddings (OpenAI)
OPENAI_API_KEY="sk-proj-your-openai-api-key"
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Database**: Active PostgreSQL database instance

### 1. Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/your-username/studentos.git
cd studentos
npm install
```

### 2. Database Setup & Migrations

Push the Drizzle schema directly to your database or run generated migrations:

```bash
# Push schema changes directly
npm run db:push

# (Optional) Generate migration files
npm run db:generate

# (Optional) Apply migrations
npm run db:migrate

# (Optional) Launch Drizzle Studio database GUI
npm run db:studio
```

### 3. Running Background Workers (Inngest Dev Server)

In a separate terminal, start the Inngest local development server to test background jobs:

```bash
npx inngest-cli@latest dev
```
*Access Inngest Dashboard at `http://localhost:8288`.*

### 4. Start the Application

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Launches the Next.js local development server |
| `npm run build` | `next build` | Compiles the production build |
| `npm run start` | `next start` | Runs the compiled production server |
| `npm run lint` | `eslint` | Runs ESLint type and style validation |
| `npm run db:push` | `drizzle-kit push` | Pushes the Drizzle schema directly to the database |
| `npm run db:generate` | `drizzle-kit generate` | Generates new SQL migration scripts |
| `npm run db:migrate` | `drizzle-kit migrate` | Applies pending database migrations |
| `npm run db:studio` | `drizzle-kit studio` | Opens the local Drizzle Studio web GUI for database inspection |

---

## 🔒 Security & Role-Based Access Control (RBAC)

StudentOS implements strict route protection via [`middleware.ts`](file:///c:/Users/HP/OneDrive/Desktop/ab/fildwork/app/middleware.ts):

- **`/student/*`**: Restricted strictly to active `STUDENT` accounts.
- **`/teacher/*`**: Restricted strictly to verified `TEACHER` accounts.
- **`/admin/*`**: Restricted strictly to authorized `ADMIN` accounts.
- **File Upload Protection**: All uploads bypass the web server through temporary presigned S3/R2 URLs, enforcing file size limits and MIME-type integrity before objects reach persistent storage.
- **Data Isolation**: Student endpoints strictly query records scoped to the authenticated session user ID.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
