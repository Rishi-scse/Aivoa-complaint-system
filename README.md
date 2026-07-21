# AIVOA - AI-Powered Customer Complaint Management System
> **Round 1 Full Stack Developer Assessment - QMS API & FDF Module**

An AI-driven Customer Complaint Management System designed for the pharmaceutical manufacturing industry (API & FDF Quality Assurance Module). Powered by **React UI with Redux Toolkit**, **FastAPI**, **LangGraph**, and **Groq LLM (`gemma2-9b-it`)**.

---

## 🌟 Key Features & AI Tools

This application implements the 3 mandatory AI tools demonstrated in the assessment challenge:

### 1. Log Complaint Tool (Natural Language Intake)
- **Zero manual form filling**: Users provide natural language prompts (e.g. *"Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 mg"*).
- **Automated Field Extraction**: LangGraph agent parses and populates form fields (`Customer Name`, `Product Name`, `Product Strength`, `Complaint Type`, `Description`).
- **AI Co-pilot Risk Assessment**: Generates `Initial Severity` (Major/Critical), `Priority` (High/Urgent), and `Recommended Next Action` (*"Route to QA Investigation and issue replacement"*).

### 2. Edit Complaint Tool (Context-Aware Form Updates)
- Users modify existing complaint details using natural language (e.g. *"Sorry, the batch number is BMX24602 and the affected quantity is 48 capsules"*).
- LangGraph state graph updates requested fields (`batch_number`, `quantity_affected`) while **strictly preserving** all previously extracted product, customer, and risk details.

### 3. Document Extraction Tool (PDF / EML Uploader)
- Supports drag-and-drop file upload (`.pdf`, `.eml`, `.txt`) with real-time extraction progress animation (0% -> 100%).
- Extracts complex pharmaceutical parameters (e.g., `Metformin Hydrochloride API`, Strength `IP/BP Grade`, Lot `MFH260712A`, Quantity `50 kg 2 HDP drums`).
- Allows follow-up natural language edits directly on top of extracted document data.

### 🎁 Bonus AI Features
- **Database Persistence**: Save complaints to SQLite/PostgreSQL database and view all submitted QMS records.
- **AI Root Cause & CAPA Recommendation Engine**: Instant AI analysis of potential root causes, immediate corrective actions, and long-term preventive actions (CAPA).

---

## 🛠️ Mandatory Tech Stack

- **Frontend**: React (Vite) + **Redux Toolkit** (`complaintSlice.js`) + **Google Inter Font** + Custom QMS Theme.
- **Backend**: Python 3.10+ + **FastAPI** + **SQLAlchemy**.
- **AI Framework**: **LangGraph** (`StateGraph` workflow for intent routing, extraction, editing, and risk evaluation).
- **LLMs**: **Groq API** (`gemma2-9b-it` / `llama-3.3-70b-versatile`) with built-in rule engine fallback.

---

## 🏗️ Project Structure

```text
aivoa-complaint-system/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI server entrypoint
│   │   ├── config.py                # Configuration & Groq API settings
│   │   ├── database.py              # SQLAlchemy database setup
│   │   ├── models.py                # Complaint database model
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── agents/
│   │   │   └── complaint_graph.py   # LangGraph AI agent state machine
│   │   └── routers/
│   │       ├── ai.py                # AI process & document upload API
│   │       └── complaints.py        # Database CRUD API
│   ├── samples/                     # Pre-generated sample test files (.pdf, .eml)
│   ├── test_backend.py              # Automated backend test suite
│   ├── generate_samples.py          # Sample generator script
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── store/
    │   │   ├── index.js             # Redux Store
    │   │   └── complaintSlice.js    # Redux Toolkit slice
    │   ├── components/
    │   │   ├── Header.jsx           # Top header & QMS module badge
    │   │   ├── ComplaintForm.jsx    # Left Panel: 4-Section Complaint Form
    │   │   ├── AIAssistant.jsx      # Right Panel: File Dropzone & AI Chat
    │   │   ├── SavedComplaintsModal.jsx # DB Records Viewer Modal
    │   │   └── BonusCAPAModal.jsx   # Root Cause & CAPA Modal
    │   ├── App.jsx
    │   └── index.css                # Styling with Google Inter font
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt

# Create .env file (Optional: Add your Groq API Key)
# GROQ_API_KEY=gsk_your_groq_api_key_here

# Run FastAPI backend
python app/main.py
```
*Backend runs on `http://127.0.0.1:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🧪 Running Automated Tests

To verify all 3 AI tools and DB endpoints:
```bash
cd backend
python test_backend.py
```

---

## 📽️ Demo Video Test Scenarios

Use these exact prompts during your demo recording:

1. **Log Complaint Tool Prompt**:
   > `Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 mg.`

2. **Edit Complaint Tool Prompt**:
   > `Sorry, the batch number is BMX24602 and the affected quantity is 48 capsules.`

3. **Document Extraction Tool**:
   > Click **Metformin_Quality_Issue.pdf** in quick sample buttons or drag & drop a PDF.
   > Follow-up Edit: `Sorry, the batch number is CHG260712A and affected quantity is 50 kg 2 HDP drums.`
