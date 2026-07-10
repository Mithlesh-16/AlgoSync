# ⚡ AlgoSync: Real-Time Collaborative Technical Interview Sandbox

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-MERN%20%7C%20Socket.io%20%7C%20Judge0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> A multiplayer, sandboxed coding platform designed for technical interviews and collaborative algorithmic problem-solving.

🌐 **[Live Demo](https://algo-sync-tau.vercel.app/)** | 🐞 **[Report Bug](https://github.com/Mithlesh-16/AlgoSync/issues)**

<img width="100%" alt="AlgoSync Workspace" src="[https://github.com/user-attachments/assets/4e8206e5-412f-4503-86ba-582c7cbb3e9d](https://github.com/user-attachments/assets/4e8206e5-412f-4503-86ba-582c7cbb3e9d)" />



---

## 💡 The Problem & Solution
During remote technical interviews, standard shared text editors lack execution sandboxes, while competitive programming platforms lack real-time peer collaboration. 

**AlgoSync** bridges this gap by combining sub-millisecond bidirectional code syncing (via WebSockets) with an asynchronous containerized execution engine (JDoodle/Judge0) to safely compile, run, and judge polyglot code in real-time.

---

## ✨ Key Features
- **Real-Time Code Syncing:** Powered by Socket.io room architecture, allowing multiple users to type simultaneously with zero state overlap.
- **Polyglot Sandboxed Execution:** Safely compiles and executes low-level code (C++, Java, Python, JavaScript) against custom test cases without exposing the host server.
- **VS Code Engine Integration:** Built with `@monaco-editor/react`, providing syntax highlighting, bracket matching, and autocompletion natively in the browser.
- **Optimistic UI Rendering:** Eliminates "empty-state flashing" during WebSocket handshakes to provide a seamless, lightning-fast user experience.

---

## 🏗️ System Architecture

```text
[ React / Monaco Editor ] <--- Socket.io (State Sync) ---> [ Node.js / Express Server ]
           |                                                            |
           └───────────────── REST API (Code Submit) ───────────────────┘
                                                                        |
                                                           Secure Reverse Proxy
                                                                        ▼
                                                         [ External Compiler API ]
```
**🧠 Engineering Challenges Overcome**
API Key Security: Direct frontend-to-compiler communication exposes API keys. I architected a Node.js reverse proxy to intercept frontend executions, attach secret keys securely on the server side, and forward the payload to the sandbox.

State Synchronization: Handling concurrent edits required structuring isolated Socket.io rooms and passing language identifiers alongside payload states to prevent variable mismatching across clients.

**🛠️ Tech Stack**
Frontend: React.js, Vite, Tailwind CSS, Monaco Editor

Backend: Node.js, Express.js, Socket.io

Compiler/Sandbox: JDoodle API / Judge0

**📂 Repository Structure**
Plaintext
AlgoSync/
├── client/                 # React frontend, Vite config, Tailwind UI
│   ├── src/
│   │   ├── components/     # Monaco Editor & Interactive Workspace
│   │   └── socket.js       # WebSocket initialization & Connection pooling
├── server/                 # Node.js Express backend
│   ├── index.js            # Socket.io room logic & HTTP server
│   └── routes/             # API proxy & compilation logic
└── README.md
Deployment: Vercel (Frontend), Render (Backend)

**🚀 Local Development Setup**
Prerequisites
Node.js (v18+)

Compiler Sandbox API Key (JDoodle/Judge0)

1. Clone the repository
Bash
git clone https://github.com/Mithlesh-16/AlgoSync.git
cd AlgoSync
2. Install dependencies
Bash
cd server && npm install
cd ../client && npm install
3. Configure Environment Variables
Create a .env file in the /server directory:

Code snippet
PORT=5000
JDOODLE_CLIENT_ID=your_api_key_here
JDOODLE_CLIENT_SECRET=your_api_secret_here
4. Start the application
Bash
# Terminal 1 (Backend):
cd server
npm start

# Terminal 2 (Frontend):
cd client
npm run dev
👨‍💻 Let's Connect
I am a 3rd-year B.E. Computer Science student actively seeking Software Engineering Internships / Co-ops. If you are looking for an engineer who understands full-stack architecture, system design, and competitive programming, I'd love to chat!
