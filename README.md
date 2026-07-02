# AlgoSync
A real-time collaborative code editor and remote execution sandbox.

# ⚡ AlgoSync: Real-Time Collaborative Technical Interview Sandbox

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-MERN%20%7C%20Socket.io%20%7C%20Judge0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> A multiplayer, sandboxed coding platform designed for technical interviews and collaborative algorithmic problem-solving in C++ and Node.js.

🌐 **[Live Demo](https://your-deployed-link.vercel.app)** | 🐞 **[Report Bug](https://github.com/yourusername/PairJudge/issues)**

---

## 💡 The Problem & Solution
During remote technical interviews, standard shared text editors lack execution sandboxes, while competitive programming platforms lack real-time peer collaboration. 

**AlgoSync** bridges this gap by combining sub-millisecond bidirectional code syncing (via WebSockets) with an asynchronous containerized execution engine (Judge0) to safely compile, run, and judge C++ code against hidden test cases in real-time.

---

## 🏗️ System Architecture

[ React / Monaco Editor ] <--- Socket.io (State Sync) ---> [ Node.js / Express Server ]
│                                                           │
└───────────────── REST API (Code Submit) ──────────────────┘
│
Async Polling (Token)
▼
[ MongoDB Atlas ] <------ Test Cases & Problem Data ------ [ Judge0 Execution Sandbox ]

## ✨ Key Features
- **Real-Time Code Syncing:** Powered by Socket.io room architecture, allowing multiple users to type simultaneously with zero state overlap.
- **Sandboxed C++ Execution:** Safely compiles and executes low-level code against custom and hidden stdin/stdout test cases without exposing the host server.
- **VS Code Engine:** Built with `@monaco-editor/react`, providing syntax highlighting, bracket matching, and autocompletion natively.
- **Role-Based Workspaces:** Separate permissions for "Interviewers" (can load problems and trigger hidden test evaluations) and "Candidates".

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Monaco Editor
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB Atlas, Mongoose ODM
- **Execution Sandbox:** Judge0 CE API

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas URI)
- Judge0 API Key (via RapidAPI)

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/AlgoSync.git]
cd AlgoSync
