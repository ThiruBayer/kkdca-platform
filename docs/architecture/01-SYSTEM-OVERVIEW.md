# KDCA Platform - System Overview & Technology Stack

## Document Version: 1.0 | Date: 2026-01-27

---

## 1. EXECUTIVE SUMMARY

The Kallakurichi District Chess Association (KDCA) Unified Digital Platform is a comprehensive, API-driven system designed to serve as the digital backbone for chess administration, player management, and community engagement at the district level, with architecture ready to scale to state, national, and international levels.

### Platform Domains

| Domain | Purpose | Audience |
|--------|---------|----------|
| `kallaichess.com` | Public Website | Players, Parents, Coaches, Public |
| `register.kallaichess.com` | Admin & Registration Portal | Admins, Organizations, Players |
| `api.kallaichess.com` | Backend API | All Frontend Applications |

---

## 2. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NGINX REVERSE PROXY                                  │
│                    (SSL Termination, Load Balancing)                        │
└─────────────────────────────────────────────────────────────────────────────┘
          │                         │                         │
          ▼                         ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────────┐
│  PUBLIC WEBSITE │     │  ADMIN PORTAL   │     │        BACKEND API          │
│  kallaichess.com│     │ register.       │     │    api.kallaichess.com      │
│                 │     │ kallaichess.com │     │                             │
│  Next.js 14+    │     │  Next.js 14+    │     │  NestJS 10+ / Node.js 20+   │
│  (SSR/SSG)      │     │  (CSR/SSR)      │     │  TypeScript                 │
└─────────────────┘     └─────────────────┘     └─────────────────────────────┘
                                                              │
                    ┌─────────────────────────────────────────┼─────────────┐
                    │                                         │             │
                    ▼                                         ▼             ▼
          ┌─────────────────┐                    ┌───────────────┐  ┌───────────┐
          │   PostgreSQL    │                    │     Redis     │  │   MinIO   │
          │   Database      │                    │    Cache      │  │  Storage  │
          │   (Primary)     │                    │   + Sessions  │  │  (Files)  │
          └─────────────────┘                    └───────────────┘  └───────────┘
```

---

## 3. TECHNOLOGY STACK

### 3.1 Backend Stack

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Runtime** | Node.js | 20 LTS | Stability, performance, async I/O |
| **Framework** | NestJS | 10.x | Enterprise-grade, modular, TypeScript-native |
| **Language** | TypeScript | 5.x | Type safety, better DX, maintainability |
| **ORM** | Prisma | 5.x | Type-safe queries, migrations, excellent DX |
| **Database** | PostgreSQL | 16.x | Robust, scalable, JSON support, full-text search |
| **Cache** | Redis | 7.x | Session management, caching, rate limiting |
| **Queue** | BullMQ | 5.x | Background jobs, email queues, scheduled tasks |
| **Validation** | Zod + class-validator | Latest | Runtime type checking, DTO validation |
| **API Docs** | Swagger/OpenAPI | 3.0 | Auto-generated API documentation |
| **Auth** | Passport.js + JWT | Latest | Flexible authentication strategies |
| **File Storage** | MinIO / S3-compatible | Latest | Scalable object storage |
| **Email** | Nodemailer + Templates | Latest | Transactional emails |

### 3.2 Frontend Stack

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Framework** | Next.js | 14.x | SSR, SSG, App Router, excellent performance |
| **Language** | TypeScript | 5.x | Type safety across stack |
| **UI Library** | React | 18.x | Component-based, large ecosystem |
| **Styling** | Tailwind CSS | 3.x | Utility-first, rapid development |
| **Components** | shadcn/ui | Latest | Accessible, customizable components |
| **State** | Zustand | 4.x | Simple, scalable state management |
| **Data Fetching** | TanStack Query | 5.x | Caching, background updates, optimistic UI |
| **Forms** | React Hook Form + Zod | Latest | Performant forms with validation |
| **Charts** | Recharts | 2.x | Responsive charts for dashboards |
| **Animations** | Framer Motion | 11.x | Smooth micro-interactions |
| **Icons** | Lucide React | Latest | Consistent, customizable icons |

### 3.3 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Web Server** | NGINX | Reverse proxy, SSL, static files |
| **Process Manager** | PM2 | Node.js process management, clustering |
| **SSL** | Let's Encrypt | Free SSL certificates |
| **Containerization** | Docker | Consistent deployment environments |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Monitoring** | PM2 Plus / Prometheus | Application monitoring |
| **Logging** | Winston + Loki | Centralized logging |

---

## 4. APPLICATION MODULES

### 4.1 Backend Modules (12 Core Modules)

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication & Authorization
│   │   ├── users/             # User management (Players, Arbiters)
│   │   ├── organizations/     # Taluk Associations & Academies
│   │   ├── office-bearers/    # Organization leadership
│   │   ├── tournaments/       # Tournament management
│   │   ├── registrations/     # Tournament registrations
│   │   ├── payments/          # Payment processing
│   │   ├── content/           # CMS for dynamic content
│   │   ├── media/             # File uploads & management
│   │   ├── notifications/     # Email & push notifications
│   │   ├── reports/           # Analytics & reporting
│   │   └── admin/             # Admin-specific operations
│   ├── common/
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Auth guards
│   │   ├── interceptors/      # Request/response interceptors
│   │   ├── pipes/             # Validation pipes
│   │   └── utils/             # Utility functions
│   ├── config/                # Configuration management
│   ├── database/              # Prisma schema & migrations
│   └── main.ts                # Application entry point
```

### 4.2 Frontend Applications

#### Public Website (kallaichess.com)

```
public-website/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About KDCA
│   │   ├── office-bearers/    # Leadership
│   │   ├── associations/      # Taluk associations
│   │   ├── academies/         # Chess academies
│   │   ├── tournaments/       # Tournament listings
│   │   ├── news/              # News & updates
│   │   └── contact/           # Contact page
│   └── (resources)/
│       ├── downloads/         # Downloadable resources
│       └── gallery/           # Photo gallery
├── components/
│   ├── layout/                # Header, Footer, Navigation
│   ├── home/                  # Homepage sections
│   ├── cards/                 # Reusable card components
│   └── ui/                    # Base UI components
└── lib/
    ├── api/                   # API client
    └── utils/                 # Utilities
```

#### Admin Portal (register.kallaichess.com)

```
admin-portal/
├── app/
│   ├── (auth)/
│   │   ├── login/             # Login page
│   │   └── register/          # Registration
│   ├── (dashboard)/
│   │   ├── dashboard/         # Role-based dashboard
│   │   ├── players/           # Player management
│   │   ├── tournaments/       # Tournament management
│   │   ├── organizations/     # Org management
│   │   ├── payments/          # Payment records
│   │   ├── content/           # Content management
│   │   ├── reports/           # Analytics
│   │   └── settings/          # System settings
│   └── (organization)/
│       ├── profile/           # Org profile
│       ├── members/           # Member management
│       └── office-bearers/    # Office bearer management
├── components/
│   ├── layout/                # Dashboard layout
│   ├── tables/                # Data tables
│   ├── forms/                 # Form components
│   └── charts/                # Dashboard charts
└── lib/
    ├── api/                   # API client
    ├── hooks/                 # Custom hooks
    └── stores/                # Zustand stores
```

---

## 5. USER ROLES & PERMISSIONS

### 5.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPER ADMIN                               │
│           (Full system access, configuration)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    ADMIN      │    │    TALUK      │    │   ACADEMY     │
│  (District    │    │ ASSOCIATION   │    │  (Academy     │
│   level ops)  │    │  (Taluk ops)  │    │   level ops)  │
└───────────────┘    └───────────────┘    └───────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    PLAYER     │    │    ARBITER    │    │    PUBLIC     │
│  (Registered) │    │  (Certified)  │    │  (Anonymous)  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 5.2 Permission Matrix

| Feature | Super Admin | Admin | Taluk Assoc | Academy | Player | Arbiter | Public |
|---------|:-----------:|:-----:|:-----------:|:-------:|:------:|:-------:|:------:|
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Admins | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage All Orgs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve Orgs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Own Org | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Tournaments | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Tournaments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bulk Register Players | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Players | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Content | ✅ | ✅ | 🔶 | 🔶 | ❌ | ❌ | ❌ |
| Register Self | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Own Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Register Tournament | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Public Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

🔶 = With approval workflow

---

## 6. KDCA ID SYSTEM

### 6.1 ID Format

```
Format: {SEQUENCE}{TALUK_CODE}{YEAR}

Example: 001KKI2026
         ┃┃┃ ┃┃┃ ┃┃┃┃
         ┃┃┃ ┃┃┃ └┴┴┴── Year of registration
         ┃┃┃ └┴┴────── Taluk code (3 chars)
         └┴┴────────── Sequence number (3 digits, zero-padded)
```

### 6.2 Taluk Codes

| Taluk | Code | Example ID |
|-------|------|------------|
| Kallakurichi | KKI | 001KKI2026 |
| Chinnasalem | CHI | 001CHI2026 |
| Sankarapuram | SAN | 001SAN2026 |
| Ulundurpet | ULP | 001ULP2026 |
| Thirukovilur | TKR | 001TKR2026 |
| Kalvarayan Hills | KVH | 001KVH2026 |
| External/Other | EXT | 001EXT2026 |

### 6.3 ID Generation Rules

1. Sequence resets to 001 each year per taluk
2. IDs are unique globally (taluk + year + sequence)
3. Once assigned, IDs are permanent (never reused)
4. Arbiters get same ID format with "ARB" suffix: `001KKI2026-ARB`

---

## 7. MEMBERSHIP SYSTEM

### 7.1 Membership Types

| Type | Annual Fee | Benefits |
|------|------------|----------|
| **Player** | ₹75 | KDCA ID, Tournament eligibility, Profile page |
| **Arbiter** | ₹250 | All player benefits + Arbiter certification, Assignment priority |

### 7.2 Membership Cycle

- **Period**: January 1 - December 31 (Calendar Year)
- **Renewal**: Available from November 1 onwards
- **Grace Period**: 30 days into new year
- **Lapsed**: Auto-marks inactive after grace period

### 7.3 Payment Integration

- **Gateway**: HDFC SmartGateway (Production)
- **Test Mode**: Razorpay (Development)
- **Methods**: UPI, Cards, Net Banking, Wallets

---

## 8. ENVIRONMENT CONFIGURATION

### 8.1 Environment Variables

```env
# Application
NODE_ENV=production
PORT=3101
API_URL=https://api.kallaichess.com
PUBLIC_URL=https://kallaichess.com
ADMIN_URL=https://register.kallaichess.com

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kdca_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=<secure-random-string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# HDFC Payment Gateway
HDFC_MERCHANT_ID=<merchant-id>
HDFC_ACCESS_CODE=<access-code>
HDFC_WORKING_KEY=<working-key>
HDFC_REDIRECT_URL=https://api.kallaichess.com/payments/callback

# File Storage (MinIO/S3)
STORAGE_ENDPOINT=localhost
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=<access-key>
STORAGE_SECRET_KEY=<secret-key>
STORAGE_BUCKET=kdca-files

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<app-password>
SMTP_FROM=noreply@kallaichess.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## 9. SECURITY MEASURES

### 9.1 Authentication Security

- JWT tokens with short expiry (15 min access, 7 day refresh)
- HTTP-only cookies for token storage
- CSRF protection on all state-changing operations
- Brute force protection (account lockout after 5 failed attempts)
- Password requirements: min 8 chars, mixed case, number, special char

### 9.2 API Security

- Rate limiting: 100 requests/minute per IP
- Request validation on all endpoints
- SQL injection prevention via Prisma ORM
- XSS prevention via input sanitization
- CORS configuration for allowed origins only

### 9.3 Data Security

- Passwords hashed with bcrypt (12 rounds)
- Sensitive data encrypted at rest
- PII access logged for audit
- Regular database backups (daily)
- SSL/TLS for all communications

---

## 10. DEPLOYMENT ARCHITECTURE

### 10.1 Current Production Setup

```
VPS Server (Ubuntu 22.04 LTS)
├── NGINX (Reverse Proxy)
│   ├── SSL Certificates (Let's Encrypt)
│   ├── kallaichess.com → Next.js Public (PM2)
│   ├── register.kallaichess.com → Next.js Admin (PM2)
│   └── api.kallaichess.com → NestJS API (PM2)
├── PM2 (Process Manager)
│   ├── kdca-public (cluster mode, 2 instances)
│   ├── kdca-admin (cluster mode, 2 instances)
│   └── kdca-api (cluster mode, 4 instances)
├── PostgreSQL 16 (Database)
├── Redis 7 (Cache/Sessions)
└── MinIO (File Storage)
```

### 10.2 PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'kdca-api',
      script: 'dist/main.js',
      cwd: '/var/www/kdca/backend',
      instances: 4,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3101
      }
    },
    {
      name: 'kdca-public',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3200',
      cwd: '/var/www/kdca/public-website',
      instances: 2,
      exec_mode: 'cluster'
    },
    {
      name: 'kdca-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3201',
      cwd: '/var/www/kdca/admin-portal',
      instances: 2,
      exec_mode: 'cluster'
    }
  ]
};
```

---

*Next Document: 02-DATABASE-SCHEMA.md*
