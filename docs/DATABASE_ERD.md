# Database ERD - Farsamo Platform

## Entity Relationship Diagram

```
┌──────────────┐       1:1        ┌──────────────┐
│    Users     │─────────────────│   Providers   │
│──────────────│                  │──────────────│
│ _id          │                  │ _id           │
│ fullName     │                  │ userId (FK)   │
│ email        │                  │ profession    │
│ phone        │                  │ experience    │
│ password     │                  │ location      │
│ role         │                  │ rating        │
│ avatar       │                  │ services[]    │
│ isActive     │                  │ pricing[]     │
│ refreshToken │                  │ verification  │
└──────┬───────┘                  └───────┬───────┘
       │                                   │
       │ 1:N                          1:N  │
       ▼                                   ▼
┌──────────────┐                  ┌──────────────┐
│   Bookings   │◄─────────────────│   Reviews    │
│──────────────│      1:1         │──────────────│
│ bookingId    │                  │ bookingId(FK)│
│ customerId   │                  │ customerId   │
│ providerId   │                  │ providerId   │
│ serviceId    │                  │ rating       │
│ date, time   │                  │ comment      │
│ status       │                  │ status       │
│ price        │                  └──────────────┘
│ statusHistory│
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐       N:1        ┌──────────────┐
│   Services   │─────────────────│  Categories   │
│──────────────│                  │──────────────│
│ name         │                  │ name         │
│ slug         │                  │ slug         │
│ categoryId   │                  │ icon         │
│ basePrice    │                  │ description  │
└──────────────┘                  └──────────────┘

┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│ ProviderVerification│  │ Notifications │  │ ContactMessages│
│ providerId (FK)  │  │ userId (FK)   │  │ name, email   │
│ nationalIdDoc    │  │ type, title   │  │ subject       │
│ certificates[]   │  │ message       │  │ message       │
│ status           │  │ isRead        │  └──────────────┘
└──────────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────────┐
│  AdminLogs   │  │ PlatformSettings  │
│ adminId (FK) │  │ siteName          │
│ action       │  │ commissionRate    │
│ entity       │  │ maintenanceMode   │
└──────────────┘  └──────────────────┘
```

## Relationships

| From | To | Type | Description |
|------|-----|------|-------------|
| User | Provider | 1:1 | Provider profile linked to user account |
| User | Booking | 1:N | Customer creates bookings |
| Provider | Booking | 1:N | Provider receives bookings |
| Service | Booking | 1:N | Booking references a service |
| Category | Service | 1:N | Services belong to categories |
| Booking | Review | 1:1 | One review per completed booking |
| Provider | ProviderVerification | 1:N | Verification history |
| User | Notification | 1:N | User receives notifications |

## Indexes

- `Users.email` - unique
- `Bookings.bookingId` - unique
- `Bookings.customerId + status` - compound
- `Bookings.providerId + status` - compound
- `Providers.profession + location + rating` - compound
- `Notifications.userId + isRead + createdAt` - compound
