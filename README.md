# Multimodal Attendance & Engagement Agent
*Skillwallet Foundation Project — Phase 1 Deliverable*

An intelligent, multimodal education agent designed for automated attendance tracking, sustained presence verification, audio engagement indicators, and transparent teaching analytics.

---

## 🎯 6-Task Project Roadmap

- [x] **Task 1 — Frontend and Dashboard**: High-fidelity teacher dashboard, responsive sidebar navigation, real-time metrics (total students, present/absent counts, attendance percentages), student roster, interactive attendance table with 1-click status switching, session controls, and labelled demo datasets.
- [x] **Task 2 — Backend and Storage**: Full REST API endpoints, student registration & lifecycle management, class session creation and history, attendance records with manual marking, correction tracking with audit logs, and persistent database storage.
- [ ] **Task 3 — Computer Vision**: Camera permissions, anonymous person detection (bounding box & contour tracking without facial recognition), sustained-presence verification, and duplicate-prevention algorithms. *(Interactive Lab prototype included in UI!)*
- [ ] **Task 4 — Audio & Engagement Indicators**: Microphone activity analysis, head-pose attention tracking, movement indicators, and transparent explainable composite engagement scores. *(Interactive Lab prototype included in UI!)*
- [x] **Task 5 — Analytics and Recommendations**: Visual attendance distribution breakdown, weekly session trends, course-by-course comparisons, at-risk student alerts (< 75% threshold), CSV report generation, and pedagogical teaching suggestions.
- [x] **Task 6 — Integration and Deployment**: Full verification, modular backend/frontend architecture, GitHub-ready structure, and live deployment.

---

## 🏗️ Architecture & Modular Structure

```
├── backend/                  # Python & Flask Backend (Skillwallet Specification)
│   ├── app.py                # Flask application entry point with CORS & error handlers
│   ├── database.py           # SQLite connection, schema migrations, and PRAGMAs
│   ├── models.py             # Dataclass models (Student, Session, Attendance, Engagement)
│   ├── seed_data.py          # Demo data generator with realistic student attendance history
│   └── routes/
│       ├── students.py       # GET, POST, PUT, DELETE /api/students
│       ├── sessions.py       # GET, POST, PUT /api/sessions
│       ├── attendance.py     # GET, PUT, POST /api/sessions/<id>/attendance (bulk & single)
│       └── analytics.py      # GET /api/analytics, /api/analytics/export/csv
│
├── server/                   # Express Full-Stack Bridge (Port 3000 Web Engine)
│   └── db.ts                 # Persistent JSON/SQLite schema engine
├── server.ts                 # Express + Vite SSR/SPA middleware entry point
├── src/                      # React 19 + Tailwind CSS Frontend
│   ├── components/           # Dashboard, AttendanceTable, StudentDirectory, Analytics, MultimodalLab
│   ├── App.tsx               # Root application router and state management
│   ├── types.ts              # Strict TypeScript definitions
│   └── main.tsx              # React mounting root
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
└── README.md                 # Project documentation
```

---

## 🚀 How to Run

### Option A: Web Applet (AI Studio / Full-Stack Node + React)
Runs on port 3000 with real-time UI, live camera prototype, and persistent REST API:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Option B: Python Flask Backend (Standalone)
Runs Flask REST API on port 5000:
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Seed initial SQLite database
python backend/seed_data.py

# 3. Start Flask server
python backend/app.py
```
API runs on `http://127.0.0.1:5000/api/health`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & module check |
| `GET` | `/api/students` | List all students with attendance percentage |
| `POST` | `/api/students` | Register a new student (validates ID, roll no, email) |
| `PUT` | `/api/students/<id>` | Update student profile |
| `DELETE` | `/api/students/<id>` | Remove student and associated attendance history |
| `GET` | `/api/sessions` | List all past and active class sessions |
| `POST` | `/api/sessions` | Create a new class session & initialize roster |
| `GET` | `/api/sessions/<id>/attendance` | Retrieve attendance records with student metadata |
| `PUT` | `/api/sessions/<id>/attendance/<student_id>` | Single-record status update & audit note |
| `POST` | `/api/sessions/<id>/attendance/bulk` | Bulk actions (`mark_all_present`, `reset_unmarked`) |
| `GET` | `/api/analytics` | Aggregate stats, trends, at-risk students, teaching tips |
| `GET` | `/api/analytics/export/csv` | Download CSV for session or whole semester |

---

## 🔒 Privacy & Ethical Guidelines (Task 3 & 4 Compliance)
- **No Facial Identification**: In strict adherence to student privacy ethics, individual faces are never enrolled or recognized.
- **Anonymous Spatial Tracking**: Person detection relies on bounding boxes and silhouette presence only.
- **Transparent Engagement**: Engagement scores are strictly aggregate and explainable (posture, head direction, audio level), never punitive.
