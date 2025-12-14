🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built as a modern Single Page Application (SPA).
This project demonstrates backend API development, frontend SPA architecture, database integration, automated testing, clean coding practices, and responsible use of AI tools.

📌 Project Overview

The application allows users to browse and purchase sweets, while administrators can manage inventory through a dedicated admin interface.
It is designed with role-based access control, RESTful APIs, and testable backend logic.

This repository contains both:

a Node.js backend (API + database)

a React frontend (SPA client)

🚀 Features
User

Register and login

View available sweets

Search sweets by name or category

Purchase sweets with quantity validation

Admin

Add new sweets

Update sweet details (price, quantity, category)

Restock inventory

Delete sweets

View and manage inventory

Technical

JWT-based authentication

Role-based authorization (User / Admin)

RESTful API design

Automated backend testing

Clean and maintainable code structure

🛠 Tech Stack
Backend

Node.js

TypeScript

Express.js

MongoDB + Mongoose

JWT Authentication

Frontend

React (Vite)

Axios

Custom CSS

Testing

Jest

Supertest

⚙️ Local Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/PIYUSH-14604/Sweet-Shop-Management-System.git
cd Sweet-Shop-Management-System

2️⃣ Backend Setup

Copy environment variables:

cp backend/.env.example backend/.env


Set the following values in backend/.env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Install dependencies and start backend:

cd backend
npm install
npm run dev


Backend runs at:

http://localhost:4000/api

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🧪 Running Tests

Backend tests are written using Jest and Supertest.

cd backend
npm test


All tests should pass successfully.

🌐 Live Deployment (Optional)

🔗 Live Application URL

https://your-vercel-deployment-link-here


Replace the link above with your deployed frontend (e.g. Vercel).
Backend can be deployed separately using Render / Railway / AWS.

🤖 My AI Usage

AI tools were used transparently and responsibly during development.

AI Tools Used

GitHub Copilot

ChatGPT

How I Used AI

GitHub Copilot

Assisted with boilerplate code generation

Helped speed up repetitive tasks such as CRUD handlers and React components

Provided inline code suggestions during development

ChatGPT

Helped reason about backend API design and data flow

Assisted in drafting and refining Jest & Supertest test cases

Guided refactoring for cleaner frontend components

Helped improve documentation and overall project structure

All AI-generated suggestions were reviewed, modified, and fully understood before being integrated.

Reflection on AI Usage

AI significantly improved productivity by reducing time spent on boilerplate and by acting as a technical assistant during debugging and refactoring.
Rather than replacing problem-solving, AI complemented my workflow and helped me focus on architecture, correctness, and code quality.
This project reflects my own implementation, augmented by modern AI tools used responsibly.

🧾 Test Report Summary

Authentication APIs (register & login) tested

Protected sweets APIs tested

Core inventory logic validated

Result:
✅ All tests passed successfully

🧠 Notes

MongoDB Compass was used only for local development and debugging

No code was copied from external repositories or developers

The project follows clean coding practices and modular design

AI usage is fully documented and transparent

👤 Author

Piyush
