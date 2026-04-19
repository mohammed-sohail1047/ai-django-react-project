# 🤖 AI Django + React Project

A full-stack AI-powered web application built using **Django REST Framework** and **React**, integrated with **OpenRouter LLM API**.

---

## 🚀 Live Features

- 🧠 AI-generated responses using LLM
- 🔗 REST API built with Django
- ⚛️ Interactive React frontend
- 💾 Stores prompts & responses in database
- 🌐 Full-stack integration (React ↔ Django)

---

## 🧱 Tech Stack

### 🔹 Backend
- Python
- Django
- Django REST Framework
- SQLite / MySQL
- OpenRouter API

### 🔹 Frontend
- React.js
- JavaScript (Fetch API)
- HTML / CSS

---

## 🔄 Application Workflow


User Input → React UI → Django API → OpenRouter LLM → Database → Response → UI


---

## 📂 Project Structure


ai-django-react-project/
│
├── core/ # Django Backend
│ ├── ai_app/
│ └── core/
│
├── ai_app_frontend/ # React Frontend
├── ScreenShots
└── README.md


---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd core
pip install -r requirements.txt
python manage.py runserver
🔹 Frontend Setup
cd ai_app_frontend
npm install
npm start
🔐 Environment Variables

Create a .env file in backend:

OPENROUTER_API_KEY=your_api_key_here

⚠️ Never expose your API key publicly.

🧪 API Endpoint
POST Request
http://127.0.0.1:8000/ai/process/
Request Body
{
  "prompt": "What is Ai"
}

## 📸 Screenshots

### 🏠 Home Page
![Home](https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/homepage.png)

### 🤖 AI Response
![Response](https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/response.png)

### 📡 API Testing (Postman)
![Postman](https://raw.githubusercontent.com/mohammed-sohail1047/ai-django-react-project/main/Screenshots/Postman-response.png)

🎯 Future Improvements
🔐 User Authentication (JWT)
💬 Chat history with sessions
⚡ Streaming responses (like ChatGPT)
🌍 Deployment (Render + Netlify)
🎨 Better UI/UX design
👨‍💻 Author

Mohammed Sohail

GitHub: https://github.com/mohammed-sohail1047
⭐ Support

If you found this project helpful:

👉 Give it a ⭐ on GitHub
👉 Share it with others
