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

### Docker

Prerequisite: [Docker Desktop](https://www.docker.com/products/docker-desktop/) with the Linux engine running.

Start the frontend and backend together:

```bash
docker compose up --build
```

Open the app at `http://localhost:8081`. The API is available at `http://localhost:5000`.

Stop the containers with:

```bash
docker compose down
```

### Local development

Install dependencies and start the Vite frontend:

```bash
npm install
npm run dev
```

Start the API in a second terminal:

```bash
npm run backend
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## 📡 API Endpoints
- `GET /api/destinations` - Fetches all available tourist destinations.
- `GET /api/inquiries` - Fetches submitted booking inquiries.
- `POST /api/inquiries` - Submits a user inquiry from the contact form.

## 👨‍💻 Author
**Harsh Bhardwaj**
