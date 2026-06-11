# Farsamo Platform - Folder Structure

## Root

```
Farsamo Platform/
├── backend/                 # Node.js/Express API
├── frontend/                # React SPA
├── docs/                    # Documentation
└── README.md
```

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── constants.js     # App constants & enums
│   ├── models/
│   │   ├── User.js
│   │   ├── Provider.js
│   │   ├── Service.js
│   │   ├── Category.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   ├── ProviderVerification.js
│   │   ├── ContactMessage.js
│   │   ├── AdminLog.js
│   │   └── PlatformSettings.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── providerController.js
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── notificationController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── providerRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── contactRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js          # JWT protection & RBAC
│   │   ├── validate.js      # Request validation
│   │   ├── validators.js    # Validation rules
│   │   └── errorHandler.js  # Global error handler
│   ├── services/
│   │   ├── notificationService.js
│   │   ├── emailService.js
│   │   └── smsService.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateBookingId.js
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── seed.js
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
├── .env.example
├── package.json
└── render.yaml
```

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   └── booking/
│   │       └── BookingTimeline.jsx
│   ├── pages/
│   │   ├── public/          # Home, About, Services, etc.
│   │   ├── auth/            # Login, Register, Password Reset
│   │   ├── customer/        # Customer dashboard pages
│   │   ├── provider/        # Provider dashboard pages
│   │   └── admin/           # Admin dashboard pages
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   └── api.js           # Axios instance & interceptors
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx              # Routes
│   └── main.jsx             # Entry point
├── .env.example
├── index.html
├── vercel.json
└── package.json
```
