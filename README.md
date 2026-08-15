# Ankit Anand — Dynamic Portfolio (Node.js + Express + MongoDB)

A backend-powered personal portfolio. The visitor counter, guestbook, and
contact form are all real — backed by MongoDB through a REST API, not
hardcoded frontend mockups.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)

## Features

- 🖥️ Animated terminal hero (pure CSS/JS, no backend needed)
- 👀 Live visitor counter — increments in MongoDB on every page load
- 📝 Guestbook — visitors can leave a message, stored in MongoDB, shown instantly
- 📬 Contact form — submissions saved to MongoDB (check your database to read them)
- 🛡️ Server-side validation and rate limiting on both write endpoints

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up MongoDB
You need a MongoDB connection string. The easiest free option is
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas):
1. Create a free cluster
2. Create a database user (username + password)
3. Under Network Access, allow your IP (or `0.0.0.0/0` for quick testing)
4. Copy the connection string

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your MongoDB URI:
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio
PORT=3000
```

### 4. Run it
```bash
npm start
```
Visit **http://localhost:3000**

For auto-restart on file changes during development:
```bash
npm run dev
```

## Project Structure

```
portfolio-app/
├── server.js              # Express app entry point
├── models/
│   ├── Visitor.js         # Visitor counter schema
│   ├── Message.js         # Guestbook message schema
│   └── Contact.js         # Contact form submission schema
├── routes/
│   └── api.js             # /api/visitors, /api/guestbook, /api/contact
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## API Endpoints

| Method | Endpoint         | Description                          |
|--------|------------------|---------------------------------------|
| GET    | `/api/visitors`  | Increments and returns visitor count |
| GET    | `/api/guestbook` | Returns latest 20 guestbook messages |
| POST   | `/api/guestbook` | Adds a new guestbook message         |
| POST   | `/api/contact`   | Saves a contact form submission      |

## Deploying

This runs on any Node.js host — Render, Railway, or Vercel (with a serverless
adapter) all work well with a free MongoDB Atlas cluster. Set the same
`MONGODB_URI` environment variable on whichever platform you choose.
