# 🤖 AI Django + React Project

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Django-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/API-OpenRouter-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Database-MySQL-Django-ORM-lightgrey?style=for-the-badge"/>
</p>

---

## 🚀 Overview

A **full-stack AI-powered web application** built using **Django REST Framework** and **React**, integrated with an LLM via OpenRouter API.

> 💡 This project demonstrates real-world integration of AI with modern web technologies.

---

## ✨ Features

- 🧠 AI-generated responses using LLM  
- ⚡ Fast REST API backend (Django)  
- ⚛️ Interactive React frontend  
- 💾 Stores prompts & responses in database  
- 🔗 Full-stack integration (React ↔ Django)  

---

## 🖼️ Screenshots

### 🏠 Home Page
<p align="center">
  <img src="https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/homepage.png" width="800"/>
</p>

### 🤖 AI Response
<p align="center">
  <img src="https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/response.png" width="800"/>
</p>

### 📡 API Testing (Postman)
<p align="center">
  <img src="https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/Postman-response.png" width="800"/>
</p>

---

## 🔄 Workflow

```text
User Input → React UI → Django API → OpenRouter LLM → Database → Response → UI


🧱 Tech Stack
🔹 Backend
Python
Django
Django REST Framework
🔹 Frontend
React.js
JavaScript (Fetch API)
🔹 Database
SQLite / MySQL
🔹 API
OpenRouter LLM API
⚙️ Installation
🔹 Backend Setup
cd core
pip install -r requirements.txt
python manage.py runserver
🔹 Frontend Setup
cd ai_app_frontend
npm install
npm start
🔐 Environment Variables

Create .env file in backend:

OPENROUTER_API_KEY=your_api_key_here

⚠️ Never expose your API key publicly.

🧪 API Endpoint
POST Request
http://127.0.0.1:8000/ai/process/
Request Body
{
  "prompt": "Explain Python in simple terms"
}
📊 Advantages
✔ Fast and scalable architecture
✔ Real-world AI integration
✔ Clean API design
✔ Easy to extend
⚠️ Limitations
⚠ Depends on external API
⚠ Basic UI (can be improved)
⚠ No authentication yet
🚀 Future Enhancements
🔐 User Authentication (JWT)
💬 Chat history
⚡ Streaming responses
🌍 Deployment (Render / Netlify)
🎨 Advanced UI/UX
👨‍💻 Author

Mohammed Sohail

🔗 GitHub: https://github.com/mohammed-sohail1047

⭐ Support

If you found this project helpful:

👉 Give it a ⭐ on GitHub
👉 Share it with others
