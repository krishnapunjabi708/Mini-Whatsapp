# Mini WhatsApp (Express + EJS) — Vercel-ready

This repository is prepared to deploy on Vercel as a single project using a serverless Express handler.

## What this repo contains
- `api/index.js` — Express app exported as a serverless handler (Vercel).
- `views/` — EJS templates.
- `public/` — static assets.
- `models/chat.js` — Mongoose model.
- `vercel.json` — routes all requests to `api/index.js`.
- `package.json` — dependencies and `start` script.

## Before you push
**DO NOT** commit any `.env` files or credentials.

Create a local `.env` for development (project root) with:
```
MONGODB_URI="mongodb+srv://<user>:<password>@<host>/?retryWrites=true&w=majority&appName=YourAppName"
PORT=3000
NODE_ENV=development
```

## Deploy to Vercel (recommended)
1. Push this repository to GitHub.
2. In Vercel dashboard, import the GitHub repository as a new project.
3. In Project Settings → Environment Variables, add:
   - `MONGODB_URI` = your MongoDB connection string (no quotes)
4. Deploy. Vercel will install dependencies and run the serverless function.

## Run locally
```bash
npm install
node api/index.js
# open http://localhost:3000
```

## Important notes
- Rotate your MongoDB password if it was exposed.
- For production, consider using MongoDB Atlas Private Endpoint or restrict IPs, and avoid `0.0.0.0/0`.
