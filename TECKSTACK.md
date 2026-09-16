# StudentOS — Technology Stack

**Version:** 1.0  
**Target:** 2026  
**Project:** StudentOS — Centralized Academic Management Platform

---

## 1. Stack Overview

StudentOS will use a modern TypeScript-first full-stack architecture focused on:

- Fast development
- Strong type safety
- Secure authentication
- Relational data integrity
- Easy deployment
- Low operational complexity
- Future scalability

### Recommended Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Frontend | Next.js + React |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend | Next.js Server Actions + Route Handlers |
| ORM | Drizzle ORM |
| Database | PostgreSQL via Supabase |
| Authentication | Better Auth |
| File Storage | Cloudflare R2 |
| Validation | Zod |
| Excel/CSV Processing | SheetJS |
| Background Jobs | Inngest |
| Charts | Recharts |
| AI | Vercel AI SDK + LLM provider |
| Vector Search | pgvector on PostgreSQL |
| Deployment | Vercel |
| Monitoring | Sentry |
| Source Control | GitHub |

---

# 2. Architecture

```text
                         STUDENTOS
                             |
                             v
                    +------------------+
                    |     Next.js      |
                    | React + TypeScript|
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
        Server Actions   Route Handlers   React UI
              |              |
              +------+-------+
                     |
                     v
              Business Logic
                     |
        +------------+-------------+
        |            |             |
        v            v             v
    Drizzle      Better Auth    Inngest
        | 
        v
  Supabase PostgreSQL
        |
        +---- Student data
        +---- Attendance
        +---- Assignments
        +---- Notes metadata
        +---- Achievements
        +---- Notifications
        +---- AI/RAG metadata

Files -----------------------> Cloudflare R2

Attendance API --------------> API Adapter
Excel/CSV -------------------> Excel Adapter
                                  |
                                  v
                         Attendance Service
                                  |
                                  v
                           PostgreSQL

AI ---------------------------> Vercel AI SDK
                                  |
                                  v
                              LLM Provider

Deployment -------------------> Vercel
Monitoring -------------------> Sentry
Source Control ---------------> GitHub
```

---

# 3. Frontend

## Next.js

**Technology:** Next.js + React + TypeScript

### Why

Next.js provides the frontend and server-side application layer in one framework.

StudentOS needs:

- Student dashboard
- Teacher dashboard
- Admin dashboard
- Protected pages
- Server-side data access
- API endpoints
- File operations
- Dynamic pages
- Responsive UI
- AI functionality

A separate React + Express application would add unnecessary complexity for the initial product.

### Responsibilities

- Page routing
- Layouts
- Server Components
- Client Components
- Server Actions
- Route Handlers
- Form handling
- Data fetching
- Authentication integration
- Dashboard rendering

---

# 4. Language

## TypeScript

TypeScript will be used throughout the application.

### Why

StudentOS contains many related entities:

```text
Student
Teacher
Class
Semester
Subject
Attendance
Assignment
Submission
Note
Exam
Announcement
Achievement
Notification
```

TypeScript helps prevent mismatched data between:

- Frontend
- Backend
- Database
- API integrations
- Background jobs

Using one language across the stack also reduces context switching.

---

# 5. Styling

## Tailwind CSS

Tailwind CSS will be used for application styling.

### Why

StudentOS needs a consistent design system across:

- Student dashboard
- Teacher portal
- Admin portal
- Tables
- Forms
- Cards
- Mobile layouts
- Charts
- Notifications

Tailwind makes responsive design and rapid iteration straightforward.

---

# 6. UI Components

## shadcn/ui

shadcn/ui will provide the base component system.

Expected components include:

- Button
- Input
- Select
- Dialog
- Dropdown
- Tabs
- Table
- Card
- Calendar
- Toast
- Sidebar
- Form
- Tooltip
- Badge

### Principle

Components should be customized to match the StudentOS design system rather than treating the default component appearance as the final design.

---

# 7. Backend

## Next.js Server Actions + Route Handlers

StudentOS will initially use Next.js as its backend layer.

### Server Actions

Use for operations such as:

- Create assignment
- Submit assignment
- Update profile
- Mark notification as read
- Create announcement
- Admin configuration

### Route Handlers

Use for:

- External API endpoints
- Attendance integrations
- File upload flows
- Webhooks
- APIs consumed by other clients
- AI endpoints where appropriate

### Why not Express initially?

A separate Express server would introduce:

- Another codebase/runtime
- Another deployment
- More environment configuration
- More authentication coordination
- More infrastructure

StudentOS does not need that complexity for its initial architecture.

A separate backend can be introduced later if the product grows into a multi-client platform with a large external API.

---

# 8. Database

## PostgreSQL

PostgreSQL is the primary source of truth for StudentOS.

### Why

StudentOS is highly relational.

Example:

```text
Student
  |
  +---- Attendance
  |
  +---- Assignment Submission
  |
  +---- Achievements
  |
  +---- Notifications
  |
  +---- Academic Performance
```

PostgreSQL provides:

- Foreign keys
- Transactions
- Constraints
- Aggregations
- Reliable relational queries
- Strong data integrity

MongoDB is not recommended as the primary database for this application.

---

# 9. Database Hosting

## Supabase PostgreSQL

Supabase will provide the managed PostgreSQL infrastructure.

### Why

It reduces infrastructure management while keeping PostgreSQL as the underlying database.

Benefits:

- Managed PostgreSQL
- Database tooling
- Backups
- Easy development setup
- Production-ready database infrastructure
- PostgreSQL extensions such as pgvector

### Important

Supabase should primarily be treated as the managed PostgreSQL platform.

The application should avoid unnecessary coupling to Supabase-specific functionality where portable PostgreSQL alternatives are sufficient.

---

# 10. ORM

## Drizzle ORM

Drizzle will be used as the TypeScript database access layer.

### Why

Drizzle is:

- Type-safe
- SQL-friendly
- Lightweight
- Well suited to PostgreSQL
- Close to the underlying relational model

This is useful for StudentOS because attendance analytics and administrative queries may eventually require more sophisticated SQL.

### Alternative

Prisma is also a valid choice.

If developer familiarity and a more abstract ORM experience are the priority, Prisma can be used instead.

For the recommended architecture, use **Drizzle**.

---

# 11. Authentication

## Better Auth

Better Auth will handle authentication and sessions.

### Expected capabilities

- Login
- Logout
- Password management
- Session management
- Email verification
- Password reset
- Role-based authorization integration

### Why

Authentication is security-critical and should not be implemented from scratch.

The application should not create its own password hashing, session, or token system.

---

# 12. Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do?

StudentOS will use role-based authorization.

```text
STUDENT
TEACHER
ADMIN
```

### Example

```text
Student
  -> View own attendance
  -> Submit assignments
  -> View notes

Teacher
  -> Create assignments
  -> Upload notes
  -> Review submissions

Admin
  -> Import attendance
  -> Configure integrations
  -> Manage users
  -> Manage academic data
```

Authorization must be enforced on the server, not only in the frontend.

---

# 13. File Storage

## Cloudflare R2

R2 will store files such as:

- PDF notes
- Assignment submissions
- Previous papers
- Images
- Documents
- Study materials

### Why

Files should not be stored directly inside PostgreSQL.

The database stores metadata:

```text
Note
├── id
├── title
├── subject_id
├── uploaded_by
├── file_key
└── created_at
```

The actual file is stored in R2.

### Upload Flow

```text
Student/Teacher
      |
      v
Next.js
      |
      v
Signed Upload
      |
      v
Cloudflare R2
      |
      v
File Metadata -> PostgreSQL
```

---

# 14. Excel/CSV Attendance

## SheetJS

SheetJS will be used for Excel/CSV processing.

### Import pipeline

```text
Excel/CSV
    |
    v
File Validation
    |
    v
Column Validation
    |
    v
Data Normalization
    |
    v
Student Matching
    |
    v
Duplicate Detection
    |
    v
Business Validation
    |
    v
Database Transaction
    |
    v
Import Report
```

### Important requirements

The import system must:

- Validate file type
- Validate required columns
- Normalize dates
- Normalize student IDs
- Detect duplicate attendance
- Detect invalid student IDs
- Report failed records
- Avoid corrupting existing attendance data
- Keep import history

---

# 15. Attendance Integration Architecture

Attendance should be provider-independent.

```text
                 Attendance Service
                         |
             +-----------+-----------+
             |                       |
             v                       v
       API Adapter             Excel Adapter
             |                       |
             v                       v
     College Attendance API      Excel/CSV
             |                       |
             +-----------+-----------+
                         |
                         v
                 Normalized Data
                         |
                         v
                  PostgreSQL
```

### Why

The college attendance system may change.

StudentOS should not depend on a single vendor or attendance system.

The application should define a normalized internal attendance format and convert external data into that format.

---

# 16. Attendance API Adapter

The API adapter will handle:

- Authentication
- API requests
- Pagination if required
- Rate limits
- Data normalization
- Error handling
- Sync status
- Logging

### Example internal record

```text
AttendanceRecord
├── studentId
├── date
├── checkIn
├── checkOut
├── status
└── source
```

External college systems can map their fields into this internal model.

---

# 17. Background Jobs

## Inngest

Inngest will be used for long-running, scheduled, or asynchronous tasks.

### Examples

- Attendance synchronization
- Large Excel imports
- Notification generation
- Achievement processing
- Scheduled reminders
- AI document processing

### Example

```text
Scheduled Attendance Sync
          |
          v
Fetch College API
          |
          v
Validate Records
          |
          v
Update Attendance
          |
          v
Recalculate Streak
          |
          v
Check Achievements
          |
          v
Create Notifications
```

This work should not depend on a student keeping a browser tab open.

---

# 18. Validation

## Zod

Zod will validate data at system boundaries.

Use Zod for:

- API input
- Form input
- Excel rows
- Attendance records
- Admin configuration
- External API responses
- AI structured output

### Pattern

```text
External Data
     |
     v
Zod Validation
     |
     v
Typed Data
     |
     v
Business Logic
     |
     v
Database
```

---

# 19. Charts and Analytics

## Recharts

Recharts will be used for visual analytics.

Expected charts:

- Attendance trend
- Monthly attendance
- Academic performance
- Assignment completion
- Study activity
- XP progress

Charts should communicate useful information rather than simply decorate the dashboard.

---

# 20. AI

## Vercel AI SDK

The AI assistant will use the Vercel AI SDK as the application integration layer.

The LLM provider should remain replaceable.

### Architecture

```text
Student
   |
   v
StudentOS AI Assistant
   |
   v
Vercel AI SDK
   |
   v
LLM Provider
```

---

# 21. RAG / AI Knowledge

For questions about uploaded notes and study materials, StudentOS will eventually use Retrieval-Augmented Generation.

### Recommended storage

PostgreSQL + pgvector.

### Architecture

```text
Teacher uploads PDF
        |
        v
Text Extraction
        |
        v
Chunking
        |
        v
Embeddings
        |
        v
PostgreSQL + pgvector
        |
        v
Student Question
        |
        v
Similarity Search
        |
        v
Relevant Context
        |
        v
LLM
        |
        v
Answer
```

### Why PostgreSQL + pgvector?

It avoids introducing a separate vector database too early.

StudentOS can keep:

- Student data
- Notes metadata
- Permissions
- Embeddings

within the same PostgreSQL environment.

---

# 22. Deployment

## Vercel

Vercel will host the Next.js application.

### Deployment Flow

```text
Developer
    |
    v
GitHub
    |
    v
Vercel
    |
    v
Production
```

### Expected environments

```text
Development
    |
Preview
    |
Production
```

Every major change should be tested through a preview deployment before production.

---

# 23. Monitoring

## Sentry

Sentry will be used for:

- Client errors
- Server errors
- API failures
- Attendance sync failures
- Import failures
- Performance monitoring

### Example

```text
Attendance API Sync
        |
        v
HTTP 500
        |
        v
Sentry
        |
        v
Admin Alert / Error Log
```

Monitoring is especially important for attendance because students depend on the accuracy of this data.

---

# 24. Source Control

## GitHub

GitHub will be the source-control platform.

### Recommended workflow

```text
main
 |
 +-- develop
       |
       +-- feature/attendance
       +-- feature/assignments
       +-- feature/notes
       +-- feature/achievements
```

For a small project, a simpler workflow is acceptable:

```text
main
 |
 +-- feature/*
```

Pull requests should be used for significant features.

---

# 25. Environment Variables

Secrets must never be committed to Git.

Example:

```text
DATABASE_URL=
BETTER_AUTH_SECRET=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

ATTENDANCE_API_URL=
ATTENDANCE_API_KEY=

AI_API_KEY=

SENTRY_DSN=
```

A `.env.example` file should contain variable names without real secrets.

---

# 26. Security Architecture

Every protected request should follow:

```text
Request
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Input Validation
  |
  v
Business Rules
  |
  v
Database
```

### Security rules

- Never store plain-text passwords.
- Never expose database credentials to the browser.
- Never expose API secrets to client-side code.
- Never trust frontend role checks.
- Validate all external input.
- Restrict uploaded files.
- Use signed URLs for private files.
- Prevent students from modifying official attendance.
- Log sensitive admin operations.
- Use HTTPS in production.
- Apply least-privilege access.

---

# 27. Recommended Project Structure

```text
studentos/
│
├── app/
│   ├── (auth)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── (admin)/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── attendance/
│   ├── assignments/
│   ├── notes/
│   ├── timetable/
│   └── achievements/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── attendance/
│   ├── storage/
│   ├── notifications/
│   ├── ai/
│   └── validation/
│
├── db/
│   ├── schema/
│   └── migrations/
│
├── inngest/
│   ├── attendance-sync.ts
│   ├── excel-import.ts
│   └── notifications.ts
│
├── types/
│
├── public/
│
├── tests/
│
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

The exact structure can evolve as the project grows.

---

# 28. Development Strategy

## Phase 1 — MVP

Use only:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Better Auth
Drizzle
Supabase PostgreSQL
Vercel
```

Build:

- Authentication
- Roles
- Dashboard
- Attendance
- Excel import
- Assignments
- Notes
- Timetable
- Announcements
- Streaks
- Basic achievements

---

## Phase 2 — Production Features

Add:

```text
Cloudflare R2
Inngest
Sentry
```

Build:

- File storage
- Background attendance sync
- Notifications
- Reliable large imports
- Monitoring

---

## Phase 3 — Advanced Features

Add:

```text
Vercel AI SDK
pgvector
```

Build:

- AI assistant
- Note summarization
- Quiz generation
- RAG
- Personalized study plans

---

# 29. What NOT to Use Initially

Avoid unnecessary infrastructure.

Do not start with:

```text
Kubernetes
Kafka
Microservices
Redis
MongoDB
Separate Express backend
Separate Python backend
Dedicated vector database
Complex AWS infrastructure
```

These can be introduced later if actual requirements justify them.

The goal is to build StudentOS, not infrastructure for its own sake.

---

# 30. Final Technology Decision

## Core

```text
TypeScript
        |
        v
Next.js + React
        |
        +---- Tailwind CSS
        |
        +---- shadcn/ui
        |
        v
Server Actions / Route Handlers
        |
        +---- Better Auth
        |
        +---- Drizzle ORM
        |
        v
Supabase PostgreSQL
```

## Supporting Infrastructure

```text
Cloudflare R2  → Files
Inngest        → Background jobs
Sentry         → Monitoring
Vercel         → Deployment
GitHub         → Source control
```

## Advanced

```text
Vercel AI SDK
      |
      v
LLM Provider
      |
      +
PostgreSQL + pgvector
      |
      v
RAG / AI Study Assistant
```

---

# 31. Final Stack Summary

| Category | Technology | Primary Reason |
|---|---|---|
| Language | TypeScript | Type safety across the stack |
| Frontend | Next.js + React | Full-stack React application |
| Styling | Tailwind CSS | Fast responsive UI development |
| Components | shadcn/ui | Accessible reusable components |
| Backend | Next.js | Avoid unnecessary backend complexity |
| ORM | Drizzle | Type-safe SQL-friendly database access |
| Database | PostgreSQL | Strong relational data model |
| DB Hosting | Supabase | Managed PostgreSQL |
| Authentication | Better Auth | Secure application authentication |
| Authorization | Server-side RBAC | Protect student/teacher/admin data |
| File Storage | Cloudflare R2 | Scalable file storage |
| Excel/CSV | SheetJS | Attendance import |
| Validation | Zod | Runtime + TypeScript validation |
| Jobs | Inngest | Syncs, imports, notifications |
| Charts | Recharts | Academic analytics |
| AI | Vercel AI SDK | AI integration and streaming |
| Vector Search | pgvector | RAG without another database |
| Deployment | Vercel | Simple Next.js deployment |
| Monitoring | Sentry | Error and performance monitoring |
| Git | GitHub | Version control and collaboration |

---

# 32. Architectural Principle

The most important architectural decision in StudentOS is to keep **attendance provider-independent**.

```text
                    Attendance Service
                           |
              +------------+------------+
              |                         |
              v                         v
        College API Adapter       Excel/CSV Adapter
              |                         |
              +------------+------------+
                           |
                           v
                    Normalized Data
                           |
                           v
                    PostgreSQL
                           |
                           v
                   StudentOS Analytics
```

The college's biometric system is an **external source of truth**.

StudentOS should normalize that data, store the required records, and build its own analytics, streak, achievement, notification, and dashboard features on top of it.

This allows StudentOS to work even when:

- The college has no API.
- The API changes.
- The college changes attendance vendors.
- An administrator needs to import historical data.
- A future college uses a different biometric system.

---

# 33. Final Recommendation

For StudentOS in 2026, the preferred architecture is:

> **Next.js + TypeScript + Tailwind CSS + shadcn/ui + Better Auth + Drizzle + Supabase PostgreSQL + Cloudflare R2 + Inngest + Zod + Vercel + Sentry**

with:

> **Vercel AI SDK + pgvector** added when the AI/RAG layer is implemented.

This stack is deliberately **modern without being over-engineered**. It is suitable for an MVP, a college deployment, and a future expansion to multiple departments or institutions.
