# Customer Satisfaction Analysis (CSA) for Afran Qalloo Farmers' Cooperative Union (AFCU)

This project, "Customer Satisfaction Analysis Using Machine Learning: Enhancing the Services of Afran Qalloo Farmers’ Cooperative Union," is a full-stack web application designed to collect, analyze, and visualize feedback from farmers. [cite_start]It aims to empower better service delivery through real-time feedback and smart insights for AFCU. [cite: 1]

## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [User Roles & Permissions](#user-roles--permissions)
* [Data Model](#data-model)
* [Machine Learning Models & APIs](#machine-learning-models--apis)
* [Getting Started](#getting-started)

## Introduction

[cite_start]The CSA-AFCU platform is a full-stack web application designed to **Collect, Analyze, and Visualize feedback from farmers**. [cite: 1] [cite_start]Its purpose is to enhance the services of Afran Qalloo Farmers' Cooperative Union (AFCU) by providing a robust system for feedback management. [cite: 1]

## Features

* [cite_start]**Authentication & User Management:** Includes login, registration, and password reset (via registration key and reset key). [cite: 2] [cite_start]It also features role-based access control. [cite: 2]
* [cite_start]**Service Management:** Admins and cooperatives can manage available services. [cite: 3] [cite_start]They can also enable or disable services for cooperatives and farmers. [cite: 3]
* [cite_start]**Feedback Collection & Management:** Farmers submit feedback on services they used. [cite: 4] [cite_start]This feedback includes sentiment classification, translation, and summarization. [cite: 4] [cite_start]Admins can view and filter feedback. [cite: 5]
* [cite_start]**Tables & Data Views:** Provides paginated, searchable, and scrollable tables for users, services, feedback, and recommendations. [cite: 5] [cite_start]These tables use sticky columns and responsive layouts for usability. [cite: 6]
* [cite_start]**Analytics & Visualization:** The platform offers dynamic charts for data analysis, and all charts update dynamically based on filters. [cite: 8, 10] These include:
    * [cite_start]**Pie Chart:** Displays sentiment distribution. [cite: 7, 9]
    * [cite_start]**Bar Graph:** Shows sentiment by category. [cite: 7, 9]
    * [cite_start]**Line Graph:** Illustrates sentiment trend over time. [cite: 7, 9]
    * [cite_start]**Radar Chart:** Provides sentiment segmentation by category. [cite: 8, 10]
* [cite_start]**Recommendations:** Admins can generate recommendations based on summarized and filtered feedbacks. [cite: 11]
* [cite_start]**Security:** Passwords are always hashed using Django’s password hasher (Sha256). [cite: 11] [cite_start]Input validation is also implemented. [cite: 12]

## Technology Stack

**Backend:**
* [cite_start]**Framework:** Django (Python) [cite: 12]
* [cite_start]**Database:** PostgreSQL [cite: 12]
* [cite_start]**APIs:** We have 4 endpoints: 2 Local which are used for serving the backend and for analyzing feedback, and 2 Remote for translation and recommendations. [cite: 12, 13]
* **Key Apps:**
    * [cite_start]`accounts`: Handles user management, authentication, registration keys, and password reset. [cite: 13]
    * [cite_start]`feedback`: Manages services and feedback. [cite: 13]
    * [cite_start]`insights`: Supports analytics, recommendations, and data visualization. [cite: 14]

**Frontend:**
* [cite_start]**Framework:** React (with Vite for fast development) [cite: 15]
* [cite_start]**UI Libraries:** Material UI (MUI), Tailwind CSS (via Vite plugin) [cite: 15]
* [cite_start]**Routing:** React Router [cite: 15]
* [cite_start]**State Management:** React Context (for authentication and language) [cite: 15]
* [cite_start]**Visualization:** Recharts (for Pie, Bar, Line, and Radar graphs) [cite: 15]

## User Roles & Permissions

* [cite_start]**Admin:** Has access to all data and management features. [cite: 16] [cite_start]Can manage users, services, feedback, view analytics, and generate and save recommendations. [cite: 16, 17]
* [cite_start]**Cooperative (PC):** Manages their own farmers and services. [cite: 17] [cite_start]Can view and enable/disable services for their farmers. [cite: 17]
* [cite_start]**Farmer:** Submits feedback on services. [cite: 18]

## Data Model

The system utilizes a relational database with the following key models:

* [cite_start]**User (`accounts_user`):** Fields include username, password (hashed), phone\_number, role, last\_name, address, number\_of\_farmers, active\_services, etc. [cite: 19] [cite_start]For farmers, username is their phone\_number and last\_name is the username of their cooperative (linking the farmer to the cooperative). [cite: 19, 20] [cite_start]For cooperatives, username is the cooperative name. [cite: 20] [cite_start]For farmers, their address must match their cooperative's address. [cite: 21]
* [cite_start]**Service (`feedback_service`):** Fields include name, name\_am (Amharic), name\_or (Oromo), description, category (one of: seed, fertilizer, veterinary, fruits, others), and created\_at. [cite: 22]
* [cite_start]**Feedback (`feedback_feedback`):** Fields include customer (FK to user), service (FK to service), message, message\_in\_english, summarized, rating, sentiment, specific\_service, and created\_at. [cite: 23] [cite_start]`message_in_english` is the same as `message` if the feedback is in English [cite: 24][cite_start], and `summarized` is a short summary of the feedback. [cite: 25]
* [cite_start]**RegistrationKey (`accounts_registrationkey`):** Used for user registration and password reset flows. [cite: 26]
* [cite_start]**SavedRecommendation (`insights_savedrecommendation`):** Stores generated recommendations and the filters used to generate them. [cite: 27]

## Machine Learning Models & APIs

[cite_start]A custom Machine Learning model is integrated for sentiment analysis: [cite: 28]

* [cite_start]**Algorithm:** Random Forest Classifier [cite: 28]
* [cite_start]**Features:** TF-IDF vectorized text. [cite: 28, 29]
    * [cite_start]**TF-IDF** (Term Frequency-Inverse Document Frequency) is a way of converting text data (like sentences or documents) into numerical features that a machine learning model can understand. [cite: 29]
    * [cite_start]**Term Frequency (TF):** How often a word appears in a document. [cite: 30]
    * [cite_start]**Inverse Document Frequency (IDF):** How unique or rare a word is across all documents. [cite: 31]
    * [cite_start]**How it works:** Each text (e.g., a farmer's feedback) is transformed into a vector (a list of numbers). [cite: 32, 37] [cite_start]Each number represents the importance of a specific word in that text. [cite: 33, 38] [cite_start]Common words (like "the", "and") get lower scores, while unique or meaningful words get higher scores. [cite: 34, 39]
    * [cite_start]**Why use it?** It helps the model focus on the most relevant words for classification [cite: 35, 40][cite_start], and it turns raw text into a format suitable for the Random Forest model. [cite: 36, 41]
* [cite_start]**Output:** Classifies sentiment as positive, neutral, or negative. [cite: 28]

## Getting Started

Further instructions on how to set up and run the project locally will be provided here.