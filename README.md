# RegNav AI

RegNav AI is an AI-powered Regulatory Compliance Navigator designed for the oil & gas industry. It helps validate project activities such as exploration, drilling, gas flaring, pipelines, and refinery operations against national and international regulations. It also includes an automated Permit & Licensing Agent that identifies mandatory approvals required from agencies like DGH, BOEM, and NSTA.

---

## 🚀 Features

- Validates petroleum project activities using regulatory documents.
- Checks compliance against petroleum acts, offshore safety directives, and environmental laws (EPA, MoEF, OSPAR, MARPOL).
- Permit & Licensing Agent maps operational activities to required permits.
- AI chatbot powered by Retrieval-Augmented Generation (RAG).
- PDF upload and regulatory-specific question answering.
- Uses vector search for fast and accurate retrieval.

---

## 🎥 Demo
A short walkthrough of RegNav AI showing PDF upload, vector search, and the compliance chatbot: 
[▶️ Watch Demo](https://drive.google.com/file/d/18GxifnQ6QfjyUFY9tiCCQsazif3UkE6q/view?usp=sharing)

---

## 🧠 Tech Stack

- **Frontend:** Next.js (TypeScript)  
- **Backend:** Python (FastAPI)  
- **Vector Database:** Qdrant (used instead of MongoDB due to college WiFi restrictions)  
- **LLMs:**  
  - `text-embedding-3-small` for embeddings  
  - `gpt-4o-mini` for chatbot responses  
- **Frameworks:** LangChain 
- **Document Support:** PDF only  

---

## 📦 Installation & Setup

### 1. Clone the Repository
```
git clone https://github.com/kalpana12-99/RegNav_AI
```

### 2. Backend (FastAPI)
- Install Python dependencies  
- Set your OpenAI API key  
- Start the FastAPI server  

### 3. Frontend (Next.js)
- Install dependencies with `npm install`  
- Start the frontend using `npm run dev`  

### 4. Vector Database
- Uses Qdrant (local or cloud)
- Stores all regulation embeddings for semantic search

---

## 🧑‍💻 How to Use

1. Upload regulatory PDF documents.  
2. System extracts text and generates vector embeddings.  
3. Ask questions in the chatbot (e.g., “What permits are required for offshore drilling?”).  
4. The AI retrieves relevant law sections and responds with compliance guidance.  

---

## 📈 Future Improvements

- Support for DOCX, text files, and scanned PDFs  
- Integration of more advanced LLMs  
- Multi-country regulatory datasets  
- Dashboard for audit trails and compliance reporting  

---

## 🤝 Contributing

Contributions, issues, and suggestions are welcome.  
Feel free to open an issue or submit a pull request.

---
