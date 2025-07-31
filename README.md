# CSA-AFCU: Customer Satisfaction Analysis Platform

A full-stack web application designed to **collect**, **analyze**, and **visualize** feedback from farmers to improve the services provided by the Afran Qalloo Farmers’ Cooperative Union (AFCU).

## 🚀 Features

### 🔐 Authentication & Access Control
- User registration and login using one-time registration keys
- Password reset via reset key
- Role-based access: **Admin**, **Cooperative**, and **Farmer**

### 🛠️ Service & Feedback Management
- Admins and cooperatives can manage available services
- Farmers can submit feedback in various languages
- Feedback includes:
  - Sentiment classification (positive/neutral/negative)
  - Translation
  - Summarization

### 📊 Analytics & Visualization
- Pie chart: Sentiment distribution
- Bar graph: Sentiment by service category
- Line graph: Sentiment trends over time
- Radar chart: Sentiment segmentation
- All charts are filterable and dynamically updated

### 💡 Recommendations
- Admins can generate recommendations based on filtered and summarized feedback

### 🔐 Security
- Passwords hashed using Django’s SHA-256 password hasher
- Input validation throughout the platform

## 🧱 Tech Stack

### 🔙 Backend
- **Framework**: Django (Python)
- **Database**: PostgreSQL
- **APIs**:
  - Local APIs for backend services and ML model integration
  - Remote APIs for translation and recommendation
- **Apps**:
  - `accounts`: Handles user management and auth
  - `feedback`: Manages services and feedback
  - `insights`: Handles analytics and recommendation logic

### 🔜 Frontend
- **Framework**: React with Vite
- **UI**: Material UI (MUI), Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context (auth, language)
- **Graphs**: Recharts (Pie, Bar, Line, Radar)

## 👥 User Roles

| Role       | Capabilities |
|------------|--------------|
| **Admin**  | Full access to users, services, feedback, analytics, and recommendations |
| **PC (Cooperative)** | Manages services and farmers under their cooperative |
| **Farmer** | Submits feedback on used services |

## 🗃️ Database Models (Simplified)

### `accounts_user`
- `username`, `phone_number`, `role`, `last_name`, `address`, `number_of_farmers`, `active_services`

### `feedback_service`
- `name`, `name_am`, `name_or`, `description`, `category`, `created_at`

### `feedback_feedback`
- `customer (FK)`, `service (FK)`, `message`, `message_in_english`, `summarized`, `sentiment`, `created_at`

### `accounts_registrationkey`
- One-time keys for user registration and password reset

### `insights_savedrecommendation`
- Stores recommendations and associated filters

## 🤖 Machine Learning

- **Model**: Random Forest Classifier
- **Text Vectorization**: TF-IDF (Term Frequency-Inverse Document Frequency)
- **Workflow**:
  1. Raw feedback is vectorized using TF-IDF
  2. Vectorized input is classified into sentiment categories
  3. Translated and summarized for recommendation generation

## 🏁 Getting Started

### Backend Setup

\`\`\`bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 📄 License

This project is for academic and developmental use only. All rights reserved by the contributors and affiliated institutions.