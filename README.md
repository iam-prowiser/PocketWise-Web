# PocketWise – Smart Money Management for Students

[![Python](https://img.shields.io/badge/Language-Python-3776ab?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](#)

## Overview

**PocketWise** provides students with an intelligent platform for expense tracking, budgeting, savings guidance, and financial education. Our mission is to empower young adults with the tools and knowledge needed to manage their finances effectively and build healthy financial habits.

## Team

**Team Name:** TEAM FINNOVA

**Team Members:**
- Vidya Votarikari – VIDYC885C8
- Sonakshi – SONA979BE4
- Abhigyan Vardhan Singh – ABHI80CDE
- Ashutosh Gautam – ASHU94C6F6

## Product Vision

PocketWise empowers students to track expenses, manage budgets, save money, and build financial literacy through a simple and intelligent personal finance platform.

## Problem Statement

College students frequently face challenges in managing their personal finances. Overspending, inconsistent expense tracking, poor budgeting habits, and limited financial literacy often prevent students from building a strong financial foundation.

PocketWise addresses these challenges by providing:
- Simple expense and income tracking
- Intelligent budget planning
- Personalized savings guidance
- Financial education resources

## Core Features

### 🔐 User Authentication
- Sign Up / Login
- Profile Management
- Secure session handling

### 💰 Expense Tracking
- Add Income & Expenses
- Automatic Categorization
- Transaction History
- Expense Analytics

### 📊 Budget Planner
- Monthly Budget Creation
- Category-wise Budget Allocation
- Budget Progress Tracking
- Smart Budget Alerts

### 📈 Financial Dashboard
- Total Income Overview
- Total Expenses Summary
- Remaining Balance Tracking
- Savings Summary
- Monthly & Yearly Reports

### 📚 Financial Education Hub
- Budgeting Lessons
- Saving Tips & Tricks
- Financial Literacy Articles
- Interactive Quizzes & Assessments

### 🤖 AI Financial Assistant (Future Scope)
- Intelligent Spending Analysis
- Personalized Recommendations
- Smart Saving Suggestions
- Financial Q&A Support

## Tech Stack

### Language
- **Python** (100%)

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- FastAPI (Python Framework)
- Python 3.x

### Database
- Supabase (PostgreSQL)
- Real-time data synchronization

### Authentication
- Supabase Auth
- JWT Token Management

### Machine Learning & Analytics
- Python
- Pandas
- NumPy
- Scikit-Learn
- Statistical Analysis

### AI Layer (Future Scope)
- Gemini API
- LLM Integration

## Project Structure

```
PocketWise-Web/
│
├── client/                 # Frontend (React/Vite)
│   └── ...
├── server/                 # Backend (FastAPI/Python)
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── README.md               # This file
├── PRD.md                  # Product Requirements Document
├── Contribution.md         # Contribution Guidelines
└── .gitignore
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

### Backend Setup

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend API will start at `http://localhost:8000`

### Environment Variables

Create `.env` files in both `client/` and `server/` directories with the necessary configuration:

```env
# Backend (.env in server/)
DATABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key

# Frontend (.env in client/)
VITE_API_URL=http://localhost:8000
```

## API Documentation

Once the backend is running, access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Supabase
- **Authentication:** Supabase Auth

## Future Enhancements

- 🤖 Advanced AI Financial Assistant
- 🎯 Goal-Based Savings Tracking
- 🎮 Gamification Features
- 💡 Smart Spending Insights
- 👨‍🏫 Personalized Financial Coaching
- 📱 Mobile Application
- 🌍 Multi-currency Support
- 📊 Advanced Financial Reports

## Contributing

We welcome contributions! Please read our [Contribution Guidelines](Contribution.md) before submitting pull requests.

## Documentation

- [Product Requirements Document (PRD)](PRD.md)
- [Contribution Guidelines](Contribution.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please:
1. Check existing [GitHub Issues](../../issues)
2. Create a new issue with a detailed description
3. Contact the team through the project repository

---

**Made with ❤️ by Team FinnOva**
