# Farsamo Platform

A production-ready marketplace connecting skilled professionals (electricians, plumbers, carpenters, cleaners, IT technicians, and more) with customers who need their services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Refresh Tokens, RBAC |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

## Features

- **Public Website** - Home, About, Services, Providers, Contact, Booking Tracker
- **Customer Dashboard** - Bookings, reviews, profile management
- **Provider Dashboard** - Booking management, availability, earnings, profile
- **Admin Dashboard** - User management, provider verification, analytics, reports
- **Authentication** - Registration, login, password recovery
- **Notifications** - Email, SMS, and in-app notifications
- **Dark Mode** - System-aware theme with manual toggle
- **Responsive Design** - Mobile-first, accessible UI

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@farsamo.com | admin123 |
| Customer | customer@farsamo.com | customer123 |
| Provider | ahmed@farsamo.com | provider123 |

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System architecture and design |
| [Database ERD](docs/DATABASE_ERD.md) | Entity relationships and schemas |
| [API Documentation](docs/API_DOCUMENTATION.md) | REST API endpoints |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Vercel + Render + Atlas setup |
| [Workflows](docs/WORKFLOWS.md) | Booking, auth, verification flows |
| [Roadmap](docs/ROADMAP.md) | Sprint plan and future enhancements |
| [Folder Structure](docs/FOLDER_STRUCTURE.md) | Project organization |

## Project Structure

```
Farsamo Platform/
├── backend/     # Express API server
├── frontend/    # React SPA
└── docs/        # Documentation
```

## License

MIT
