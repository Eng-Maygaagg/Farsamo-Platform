# Farsamo Platform - Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Vercel account (frontend)
- Render account (backend)
- SMTP credentials (optional, for email)

## 1. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user with read/write permissions
3. Whitelist IP `0.0.0.0/0` (or specific Render IPs)
4. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/farsamo`

## 2. Backend Deployment (Render)

1. Push code to GitHub
2. Create new **Web Service** on Render
3. Connect repository, set root directory to `backend`
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Set environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-app.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

6. Deploy and note the API URL (e.g., `https://farsamo-api.onrender.com`)

## 3. Seed Database

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed
```

## 4. Frontend Deployment (Vercel)

1. Import GitHub repository on Vercel
2. Set root directory to `frontend`
3. Framework preset: **Vite**
4. Environment variable:
   ```
   VITE_API_URL=https://farsamo-api.onrender.com/api
   ```
5. Deploy

## 5. Post-Deployment Checklist

- [ ] API health check: `GET /api/health`
- [ ] CORS configured with Vercel URL
- [ ] Database seeded with admin account
- [ ] SSL enabled on both services
- [ ] JWT secrets are strong and unique
- [ ] SMTP configured for password reset emails
- [ ] Test login for all three roles

## Local Development

```bash
# Terminal 1 - Backend
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# Terminal 2 - Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@farsamo.com | admin123 |
| Customer | customer@farsamo.com | customer123 |
| Provider | ahmed@farsamo.com | provider123 |
