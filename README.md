# Plantsite

A full-stack web application for plant cultivation knowledge, community discussion, and article management. Built as a collaborative school project using Node.js, Express, TypeScript, MySQL, and MongoDB.

---

## Overview

Plantsite is a gardening-focused web platform where users can browse a plant library with care guides and seasonal planting schedules, read and save articles, and participate in a community forum. The project demonstrates a layered backend architecture with two databases — a relational MySQL database for structured content and MongoDB for user accounts and community posts.

---

## Tech Stack

**Backend**
- Node.js + Express 5
- TypeScript
- MySQL 2 — plants, articles, authors, categories, tags
- MongoDB + Mongoose — users, forum posts
- JWT authentication (access + refresh token strategy)
- bcrypt password hashing

**Frontend**
- Vanilla TypeScript compiled to JavaScript
- HTML + CSS (no framework)
- Fetch API with automatic token refresh

---

## Features

- Plant library with care instructions, difficulty levels, and month-by-month planting/harvest schedules
- Article system with authors, categories, tags, and plant associations
- User registration and login with JWT (access token in localStorage, refresh token in httpOnly cookie)
- Saved/favorite articles per user
- Community forum with posts, comments, and tag filtering
- Protected routes requiring authentication
- Search and filter for both plants and articles

---

## Project Structure

```
Plantsite/
├── backend/
│   └── src/
│       ├── app.ts
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── models/          # Mongoose schemas
│       ├── middleware/      # JWT auth
│       ├── databases/       # MySQL & MongoDB connections
│       └── data/            # SQL schema and seed data
├── public/
│   ├── src/                 # Frontend TypeScript modules
│   ├── *.html               # Frontend pages
│   ├── style.css
│   └── assets/
├── package.json
└── tsconfig.json
```

---

## Database Design

### MySQL — Relational Data

| Table | Description |
|---|---|
| `plants` | Plant library with care and cultivation metadata |
| `planting_schedule` | Monthly planting and harvest windows per plant |
| `authors` | Article authors |
| `categories` | Article categories |
| `articles` | Blog and knowledge articles with slugs and premium flag |
| `tags` | Article tags |
| `article_plants` | Many-to-many: articles ↔ plants |
| `article_tags` | Many-to-many: articles ↔ tags |

MySQL is used for the content-heavy side of the application where normalized relational data and multi-table joins are needed.

### MongoDB — Document Data

| Collection | Description |
|---|---|
| `User` | Accounts with hashed password, favorite articles and plants |
| `ForumPost` | Community posts with nested comments and tags |

MongoDB handles user-owned data and the forum where a document model fits more naturally than a relational schema.

---

## REST API

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | — | Login, returns access token |
| POST | `/refresh` | Cookie | Refresh access token |
| POST | `/logout` | — | Clear refresh token |
| GET | `/me` | Bearer | Current user info |

### Users — `/api/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Register new account |
| POST | `/save-article` | Bearer | Save article to favorites |

### Plants — `/plants`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | All plants |
| GET | `/search` | — | Filter by name, sun, water, difficulty, soil |
| GET | `/get/:id` | — | Single plant with planting schedule |
| POST | `/` | — | Create plant |
| PUT | `/get/:id` | — | Update plant |
| DELETE | `/get/:id` | — | Delete plant |

### Articles — `/api/articles`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/latest` | — | Most recent article |
| GET | `/` | — | All articles |
| GET | `/search` | — | Filter by author, title, category, tag, plant |
| GET | `/get/:id` | — | Article by ID |
| GET | `/:slug` | — | Article by slug |
| POST | `/get/by-ids` | — | Multiple articles by ID list |
| GET | `/favorites` | Bearer | User's saved articles |
| POST | `/` | — | Create article |
| PUT | `/get/:id` | — | Update article |
| DELETE | `/get/:id` | — | Delete article |

### Community — `/community`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | All forum posts |
| GET | `/:id` | — | Single post with comments |
| POST | `/` | Bearer | Create post |
| PUT | `/:id` | — | Update post |
| DELETE | `/:id` | — | Delete post |

---

## Frontend Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Landing page with latest article |
| Plants | `plants.html` | Plant catalog with search |
| Articles | `articles.html` | Article list with previews |
| Article | `article.html` | Single article view with save button |
| Community | `community.html` | Forum posts with tag filtering |
| Create Post | `createPost.html` | New forum post form |
| Login | `login.html` | Email and password login |
| Sign Up | `signup.html` | Account registration |
| Profile | `profile.html` | User info and saved articles |
| About | `about.html` | Project credits |

---

## Getting Started

**Prerequisites:** Node.js, a running MySQL instance, a MongoDB connection string.

```bash
git clone https://github.com/tZandr/Plantsite.git
cd Plantsite
npm install
```

Create a `.env` file in the project root:

```env
MONGODB_URI=<your_mongodb_connection_string>
MYSQL_HOST=localhost
MYSQL_USER=<your_mysql_user>
MYSQL_PASSWORD=<your_mysql_password>
MYSQL_DATABASE=plantsite
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
PORT=3000
```

Import the SQL schema from `backend/src/data/` to set up the MySQL database, then:

```bash
npm run dev    # Start with watch mode
npm run build  # Compile TypeScript
```

The API runs on `http://localhost:3000` and the frontend is served as static files (open with Live Server or equivalent on port 5500).

---

## Team

| Name | Role |
|---|---|
| Alexander Tjernström | Full frontend, community forum (full CRUD + MongoDB) |
| Ebba Wahlström | Database design (ER diagram to code), plants backend (full CRUD) |
| Anna Ek | Authentication (JWT) |

---

## Context

This project was completed as part of a backend web development course at IT-Högskolan. The assignment required building a database-driven REST API with Node.js and Express, using both MySQL and MongoDB, alongside a frontend built with plain HTML, CSS, and JavaScript. The team followed a Scrum workflow throughout development.

The original repository is hosted under a collaborator's account and is not public. This is a personal mirror of the project.
