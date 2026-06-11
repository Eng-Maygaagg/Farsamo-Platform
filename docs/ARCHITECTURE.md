# Farsamo Platform - System Architecture

## Overview

Farsamo Platform is a three-tier marketplace application connecting customers with skilled service professionals. The architecture follows clean separation of concerns with a React SPA frontend, RESTful Node.js/Express API, and MongoDB Atlas database.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React SPA (Vercel) │ React Router │ Axios │ CSS │ Dark Mode    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST API
┌────────────────────────────▼────────────────────────────────────┐
│                        API LAYER (Render)                        │
│  Express.js │ JWT Auth │ RBAC │ Rate Limiting │ Validation      │
│  Controllers │ Services │ Middleware │ Error Handler             │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
┌────────────────────────────▼────────────────────────────────────┐
│                     DATA LAYER (MongoDB Atlas)                   │
│  Users │ Providers │ Services │ Categories │ Bookings │ Reviews   │
│  Notifications │ ProviderVerification │ ContactMessages         │
│  AdminLogs │ PlatformSettings                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  SMTP (Email) │ SMS Gateway │ Google Maps (Contact Page)        │
└─────────────────────────────────────────────────────────────────┘
```

## Design Principles

- **SOLID**: Single-responsibility controllers, dependency injection via services
- **Clean Architecture**: Routes → Controllers → Services → Models
- **Security First**: JWT + refresh tokens, bcrypt, helmet, rate limiting, input sanitization
- **Scalability**: Stateless API, horizontal scaling on Render, indexed MongoDB queries

## Component Responsibilities

| Layer | Responsibility |
|-------|---------------|
| Frontend | UI/UX, routing, client state, API consumption |
| API Gateway | Auth, validation, rate limiting, CORS |
| Controllers | Request handling, business logic orchestration |
| Services | Notifications, email, SMS, cross-cutting concerns |
| Models | Data schema, validation, indexes |
| Database | Persistent storage, aggregations |

## Authentication Flow

1. User submits credentials
2. Server validates and returns access + refresh tokens
3. Access token stored in localStorage + httpOnly cookies
4. API requests include Bearer token
5. On 401, client refreshes token automatically
6. Role-based middleware enforces authorization

## Deployment Topology

- **Frontend**: Vercel (CDN, auto SSL, SPA rewrites)
- **Backend**: Render (Node.js web service)
- **Database**: MongoDB Atlas (managed cluster)
