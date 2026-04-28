# Creator Growth OS

A full-stack MERN social media app that helps creators **post better content**, **predict engagement before posting**, and **track growth** — all in one clean workspace.

## Features

### Core (social network)
- JWT auth (signup / login)
- User profile with name, bio, profile image
- Create posts with text + image upload
- Like / comment system
- Follow / unfollow users
- Personal feed of posts from people you follow
- Explore page

### What makes it insane
1. **AI Content Assistant** — upload an image + draft caption, get:
   - 5 caption suggestions (hook + body + CTA structure)
   - Smart hashtags (mix of niche + broad)
   - Improvement tips (clarity, hook strength, length, CTA)
   - Best time to post (based on your audience activity)
2. **Engagement Predictor** — before you publish, see a Low / Medium / High score with concrete reasons and improvement suggestions.
3. **Growth Dashboard** — total posts, likes, comments, engagement rate per post, top post, weekly trend, and personalized insights.
4. **Activity Tracking** — every signup, login, post, like, comment, and follow is logged so you (or an admin) can see exactly what users are doing.

## Tech Stack

- **Frontend:** React 18 + Vite + React Router + Axios
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Uploads:** Multer (local `/uploads` folder, served statically)

## Project Structure

```
creator-growth-os/
├── client/           # React + Vite frontend
├── server/           # Express + Mongoose API
├── package.json      # root scripts (runs both with one command)
└── README.md
```

## Quick Start

### 1. Requirements
- **Node.js 18+** (`node -v`)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`
  *(or use a free MongoDB Atlas cluster — paste the URI into `server/.env`)*

### 2. Install everything (one command)

From the project root:

```bash
npm run install:all
```

### 3. Configure environment

Copy the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Open `server/.env` and set at minimum:

```
MONGO_URI=mongodb://127.0.0.1:27017/creator_growth_os
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Run dev (frontend + backend together)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

That's it. Sign up, create a post, try the AI Assistant, and check the Dashboard.

## Run only one side

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Build for production

```bash
npm run build           # builds the React client into client/dist
npm start               # runs the Express server (serves API)
```

For deployment, host the API (Render / Railway / Fly) and serve the built `client/dist` from any static host (Vercel / Netlify) — set `VITE_API_URL` in the client to your API URL.

## API Overview

All protected routes need `Authorization: Bearer <token>`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | create account |
| POST | `/api/auth/login` | login, returns JWT |
| GET  | `/api/users/me` | current user |
| PUT  | `/api/users/me` | update profile (name, bio, image) |
| GET  | `/api/users/:id` | public profile |
| POST | `/api/users/:id/follow` | follow / unfollow toggle |
| GET  | `/api/users/explore` | suggested users |
| GET  | `/api/posts/feed` | feed from followed users |
| GET  | `/api/posts/explore` | global feed |
| POST | `/api/posts` | create post (multipart: text, image) |
| POST | `/api/posts/:id/like` | like / unlike toggle |
| POST | `/api/posts/:id/comment` | add comment |
| GET  | `/api/posts/user/:id` | posts by user |
| POST | `/api/ai/analyze` | AI assistant (caption + hashtags + tips + best time) |
| POST | `/api/ai/predict` | engagement prediction |
| GET  | `/api/dashboard` | personal growth dashboard |
| GET  | `/api/admin/activity` | activity log (admin) |

## Notes

- Uploaded images are saved to `server/uploads` and served from `/uploads/...`.
- The AI is a smart on-device heuristic engine — no external API key needed, works offline. Swap `server/src/utils/ai.js` for an OpenAI / Gemini call if you want LLM-grade output.
- First account you sign up with becomes admin (sees the activity log at `/admin`).

Enjoy. Make something people love.
