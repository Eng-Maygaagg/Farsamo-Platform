# Farsamo Platform - Workflows

## Booking Workflow

```mermaid
sequenceDiagram
    participant C as Customer
    participant API as API Server
    participant DB as MongoDB
    participant P as Provider
    participant N as Notifications

    C->>API: Search services & providers
    API->>DB: Query providers
    DB-->>API: Provider list
    API-->>C: Display providers

    C->>API: POST /bookings
    API->>DB: Create booking (submitted)
    API->>N: Notify provider (email, SMS, in-app)
    API-->>C: Booking ID

    P->>API: PATCH /bookings/:id/status (accepted)
    API->>DB: Update status
    API->>N: Notify customer
    API-->>P: Updated booking

    P->>API: PATCH status (in_progress)
    P->>API: PATCH status (completed)
    API->>DB: Update provider earnings
    API->>N: Notify customer

    C->>API: POST /reviews
    API->>DB: Create review
    API->>N: Notify provider
```

## Provider Verification Workflow

```mermaid
flowchart TD
    A[Provider Registers] --> B[Submit National ID & Documents]
    B --> C[Status: Pending]
    C --> D{Admin Review}
    D -->|Approve| E[Status: Approved]
    D -->|Reject| F[Status: Rejected]
    E --> G[Provider Can Accept Bookings]
    F --> H[Notify Provider with Reason]
    E --> I[Send Approval Notification]
```

## Authentication Flow

```mermaid
flowchart LR
    A[Login Request] --> B{Valid Credentials?}
    B -->|No| C[401 Error]
    B -->|Yes| D[Generate Access + Refresh Tokens]
    D --> E[Set httpOnly Cookies]
    D --> F[Return Tokens to Client]
    F --> G[API Requests with Bearer Token]
    G --> H{Token Expired?}
    H -->|Yes| I[Refresh Token Endpoint]
    I --> J[New Access Token]
    H -->|No| K[Process Request]
```

## Admin Workflow

1. **Dashboard** - View platform analytics and growth metrics
2. **User Management** - CRUD customers and providers, activate/deactivate
3. **Verification** - Review provider documents, approve/reject
4. **Service Management** - CRUD categories and services
5. **Booking Oversight** - Monitor all bookings and statuses
6. **Review Moderation** - Approve, reject, or delete reviews
7. **Reports** - Export users, providers, bookings, revenue (PDF/Excel)
8. **Settings** - Configure platform name, contact info, commission rate

## Notification Flow

| Event | Channels | Recipients |
|-------|----------|------------|
| Registration | Email | New user |
| Provider Approval | Email, SMS, In-App | Provider |
| Booking Created | Email, SMS, In-App | Provider |
| Booking Accepted | Email, SMS, In-App | Customer |
| Booking Rejected | Email, SMS, In-App | Customer |
| Booking Completed | Email, SMS, In-App | Customer |
| New Review | Email, In-App | Provider |
