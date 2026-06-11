# Farsamo Platform - Wireframes & Dashboard Layouts

## Public Pages

### Home Page Layout
```
┌─────────────────────────────────────────────────┐
│  NAVBAR: Logo | Services | Providers | Login    │
├─────────────────────────────────────────────────┤
│              HERO SECTION                        │
│   "Find Trusted Professionals Near You"          │
│   [Search Service Input] [Search Button]         │
│   [Get Started] [Browse Professionals]           │
├─────────────────────────────────────────────────┤
│  HOW IT WORKS: [1.Search] [2.Choose] [3.Book]   │
├─────────────────────────────────────────────────┤
│  POPULAR SERVICES: [Card] [Card] [Card] [Card]  │
├─────────────────────────────────────────────────┤
│  TOP PROFESSIONALS: [Profile Card] x6            │
├─────────────────────────────────────────────────┤
│  TESTIMONIALS: [Quote Card] x3                  │
├─────────────────────────────────────────────────┤
│  STATS: Customers | Providers | Services | Jobs  │
├─────────────────────────────────────────────────┤
│  FOOTER: Links | Contact | Social               │
└─────────────────────────────────────────────────┘
```

### Booking Tracker Layout
```
┌─────────────────────────────────────────────────┐
│  [Booking ID Input] [Track Button]              │
├─────────────────────────────────────────────────┤
│  Booking: FAR-XXXXX-XXXX    [Status Badge]      │
│                                                  │
│  Timeline:                                       │
│  ● Submitted ──── ● Pending ──── ○ Accepted     │
│       │                │              │          │
│  ● In Progress ──── ○ Completed                 │
│                                                  │
│  Details: Date | Time | Location | Price        │
└─────────────────────────────────────────────────┘
```

## Dashboard Layout (All Roles)

```
┌──────────┬──────────────────────────────────────┐
│ SIDEBAR  │  HEADER: Dashboard Title | User     │
│          ├──────────────────────────────────────┤
│ 📊 Dash  │                                      │
│ 📅 Book  │         MAIN CONTENT AREA            │
│ ⭐ Rev   │                                      │
│ 👤 Prof  │   [Stat Cards Row]                   │
│          │   [Data Tables / Forms / Charts]     │
│ 🌙 Theme │                                      │
│ Logout   │                                      │
└──────────┴──────────────────────────────────────┘
```

### Customer Dashboard
- Overview: Active bookings, completed jobs, reviews count
- My Bookings: Filterable table (upcoming, active, completed)
- Booking Detail: Timeline + review form (if completed)
- Profile: Name, phone, password change

### Provider Dashboard
- Overview: Total bookings, active jobs, rating, earnings
- Bookings: Accept/Reject/Complete action buttons
- Availability: Weekly calendar with toggle per day
- Profile: Bio, services, pricing, certifications
- Earnings: Monthly bar chart + revenue table

### Admin Dashboard
- Overview: Users, bookings, revenue stats + charts
- Users: Searchable table with activate/deactivate
- Verifications: Provider cards with approve/reject
- Services: CRUD table with add form
- Bookings: All bookings with status filters
- Reviews: Moderation queue
- Reports: PDF/Excel download cards
- Settings: Platform configuration form
