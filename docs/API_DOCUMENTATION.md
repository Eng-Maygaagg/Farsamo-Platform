# Farsamo Platform - API Documentation

Base URL: `http://localhost:5000/api` (dev) | `https://your-api.onrender.com/api` (prod)

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register/customer` | Public | Register customer |
| POST | `/auth/register/provider` | Public | Register provider |
| POST | `/auth/login` | Public | Login |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | User | Logout |
| GET | `/auth/me` | User | Get current user |
| POST | `/auth/forgot-password` | Public | Request password reset |
| PUT | `/auth/reset-password/:token` | Public | Reset password |
| PUT | `/auth/update-password` | User | Update password |

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/users/profile` | User | Update profile |
| GET | `/users/dashboard` | Customer | Customer dashboard stats |

## Providers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/providers` | Public | List providers (filters: service, rating, location, price) |
| GET | `/providers/top` | Public | Top rated providers |
| GET | `/providers/:id` | Public | Provider details |
| GET | `/providers/me/profile` | Provider | Own profile |
| PUT | `/providers/me/profile` | Provider | Update profile |
| PUT | `/providers/me/availability` | Provider | Update availability |
| GET | `/providers/me/earnings` | Provider | Earnings statistics |

## Services & Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/services` | Public | List services |
| GET | `/services/popular` | Public | Popular services |
| GET | `/services/:id` | Public | Service details + suggested providers |
| GET | `/services/categories` | Public | List categories |
| POST | `/services` | Admin | Create service |
| PUT | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Delete service |
| POST | `/services/categories` | Admin | Create category |

## Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/track/:bookingId` | Public | Track booking by ID |
| GET | `/bookings` | User | List bookings (role-filtered) |
| GET | `/bookings/:id` | User | Booking details |
| POST | `/bookings` | Customer | Create booking |
| PATCH | `/bookings/:id/status` | Provider/Admin | Update status |
| GET | `/bookings/stats` | User | Booking statistics |

## Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews` | Public/User | List reviews |
| POST | `/reviews` | Customer | Create review |
| PATCH | `/reviews/:id/moderate` | Admin | Moderate review |
| DELETE | `/reviews/:id` | Admin | Delete review |

## Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | User | List notifications |
| PATCH | `/notifications/:id/read` | User | Mark as read |
| PATCH | `/notifications/read-all` | User | Mark all as read |

## Contact

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contact` | Public | Submit contact form |
| GET | `/contact` | Admin | List messages |

## Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats/public` | Public | Public platform stats |
| GET | `/admin/dashboard` | Admin | Dashboard analytics |
| GET | `/admin/users` | Admin | List users |
| PUT | `/admin/users/:id` | Admin | Update user |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/verifications` | Admin | Provider verifications |
| PATCH | `/admin/verifications/:id` | Admin | Approve/reject provider |
| GET | `/admin/bookings` | Admin | All bookings |
| GET | `/admin/settings` | Admin | Platform settings |
| PUT | `/admin/settings` | Admin | Update settings |
| GET | `/admin/reports?type=&format=` | Admin | Generate PDF/Excel reports |

## Response Format

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10 }
}
```

## Error Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error details"]
}
```
