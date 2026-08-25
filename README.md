# 🇮🇳 Tourism in India - Full Stack Project

A full-stack web application designed to showcase the vibrant and diverse tourist destinations across India. 

## ✨ Features
- **Interactive UI**: Beautiful, responsive frontend built with React.
- **RESTful API**: Node.js and Express backend serving dynamic tourism data.
- **Graceful Fallback**: The frontend is engineered to seamlessly switch to local mock data if the backend server is offline, ensuring an uninterrupted user experience.
- **Destination Filtering**: Browse destinations by category (e.g., Historical, Nature, Spiritual).
- **Inquiry Form**: Fully functional contact form connecting frontend to backend.

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js, CORS
- **Data Format:** JSON

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### 1. Backend Setup (Node.js Server)
1. Open a terminal and navigate to your backend folder.
2. Initialize the project and install dependencies:
   ```bash
   npm init -y
   npm install express cors
   ```
3. Place the `server.js` file in this folder.
4. Start the server:
   ```bash
   node server.js
   ```
   *The server will run on `http://localhost:5000`*

### 2. Frontend Setup (React App)
1. Open a new terminal and navigate to your frontend folder.
2. Create a new React app and install dependencies:
   ```bash
   npx create-react-app .
   ```
3. Replace the contents of `src/App.jsx` (or `App.js`) with the provided React code.
4. Start the React development server:
   ```bash
   npm start
   ```
   *The app will run on `http://localhost:3000`*

## 📡 API Endpoints
- `GET /api/destinations` - Fetches all available tourist destinations.
- `POST /api/inquiry` - Submits a user inquiry from the contact form.

## 👨‍💻 Author
**Harsh Bhardwaj**
