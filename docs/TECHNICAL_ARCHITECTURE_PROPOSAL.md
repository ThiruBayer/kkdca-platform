# KDCA Platform - Complete Technical Architecture Proposal

**Version:** 2.0
**Created:** January 2026
**Target Horizon:** 2035+
**Domains:** new.kallaichess.com (Public) | register.kallaichess.com (Admin)

---

## Table of Contents

1. [System Overview & Architecture Summary](#1-system-overview--architecture-summary)
2. [Backend Module Breakdown](#2-backend-module-breakdown)
3. [Database Schema Design](#3-database-schema-design)
4. [API Contract Outline](#4-api-contract-outline)
5. [Frontend Data Flow Strategy](#5-frontend-data-flow-strategy)
6. [Admin & Role Workflows](#6-admin--role-workflows)
7. [Deployment Strategy](#7-deployment-strategy)
8. [Migration Strategy](#8-migration-strategy)

---

## 1. System Overview & Architecture Summary

### 1.1 Executive Summary

The KDCA (Kallakurichi District Chess Association) platform is an international-standard digital chess federation system designed to serve as the unified hub for chess activities in Kallakurichi District. The system consolidates:

- **Public Website** (new.kallaichess.com): Dynamic content-driven portal showcasing the association, tournaments, office bearers, academies, and news
- **Registration & Admin System** (register.kallaichess.com): Comprehensive management platform for player registration, tournament management, payments, and administrative functions

Both deployments share a **single backend API**, ensuring data consistency and reducing maintenance overhead.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           KDCA UNIFIED PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────┐       ┌──────────────────────────┐           │
│  │   PUBLIC WEBSITE          │       │   ADMIN/REGISTRATION     │           │
│  │   new.kallaichess.com    │       │   register.kallaichess.com│           │
│  │                          │       │                          │           │
│  │  • Dynamic Home Page     │       │  • Player Registration   │           │
│  │  • About KDCA            │       │  • Admin Dashboard       │           │
│  │  • Office Bearers        │       │  • Tournament Mgmt       │           │
│  │  • Taluk Associations    │       │  • Payment Processing    │           │
│  │  • Chess Academies       │       │  • Organization Panel    │           │
│  │  • Tournament Calendar   │       │  • Reports & Analytics   │           │
│  │  • News & Media          │       │  • Content Management    │           │
│  │  • Downloads/Resources   │       │  • Bulk Operations       │           │
│  └────────────┬─────────────┘       └────────────┬─────────────┘           │
│               │                                   │                          │
│               └───────────────┬───────────────────┘                          │
│                               │                                              │
│                               ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      UNIFIED BACKEND API                             │   │
│  │                     api.kallaichess.com                              │   │
│  │                                                                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │  Auth   │ │ Content │ │ Player  │ │ Tourney │ │ Payment │       │   │
│  │  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │ Module  │       │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │  Org    │ │  Media  │ │Notifica-│ │ Report  │ │ Storage │       │   │
│  │  │ Module  │ │ Module  │ │  tion   │ │ Module  │ │ Module  │       │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER                                    │   │
│  │                                                                      │   │
│  │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐               │   │
│  │  │  PostgreSQL │   │    Redis    │   │    S3/CDN   │               │   │
│  │  │  (Primary)  │   │  (Cache)    │   │  (Storage)  │               │   │
│  │  └─────────────┘   └─────────────┘   └─────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Technology Stack Recommendation

#### Backend Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Runtime** | Node.js 20+ LTS | Excellent async I/O, mature ecosystem, long-term support |
| **Framework** | NestJS 10+ | Enterprise-grade, TypeScript-first, modular architecture |
| **Database** | PostgreSQL 16+ | ACID compliance, JSON support, excellent for complex queries |
| **ORM** | Prisma | Type-safe, modern, excellent DX, auto-generated migrations |
| **Cache** | Redis 7+ | Session management, caching, rate limiting |
| **Queue** | BullMQ | Background jobs, email sending, report generation |
| **API Docs** | OpenAPI/Swagger | Auto-generated, interactive documentation |
| **Validation** | Zod + class-validator | Runtime type validation, schema enforcement |

#### Frontend Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG, optimal SEO, excellent performance |
| **Language** | TypeScript 5+ | Type safety, better maintainability |
| **Styling** | Tailwind CSS 4+ | Utility-first, highly customizable, excellent DX |
| **UI Library** | Radix UI + Shadcn/ui | Accessible, unstyled primitives, modern patterns |
| **State** | TanStack Query + Zustand | Server state + client state separation |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation |
| **Charts** | Recharts / Apache ECharts | Rich visualization capabilities |

#### Infrastructure Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Hosting** | AWS / DigitalOcean | Scalable cloud infrastructure |
| **Container** | Docker + Docker Compose | Consistent deployments |
| **Orchestration** | Kubernetes (future) | Auto-scaling, high availability |
| **CDN** | CloudFront / Cloudflare | Static asset delivery, DDoS protection |
| **Storage** | S3-compatible | Media files, documents |
| **SSL** | Let's Encrypt | Automated certificate management |
| **Monitoring** | Prometheus + Grafana | Performance monitoring |
| **Logging** | ELK Stack / Loki | Centralized logging |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

### 1.4 Core Design Principles

1. **API-First Architecture**: All content comes from backend APIs. No hardcoded content in frontend.

2. **Single Source of Truth**: One backend serves both public website and admin portal.

3. **Dynamic Everything**: All content (banners, text, images, structure) managed via admin panel.

4. **Role-Based Access Control (RBAC)**: Granular permissions for Super Admin, Admin, Taluk, Academy roles.

5. **Mobile-First Responsive Design**: All interfaces work seamlessly across devices.

6. **Internationalization-Ready**: Architecture supports future multi-language requirements.

7. **Offline Capability**: Progressive Web App features for basic offline access.

8. **Audit Trail**: All changes are logged with user attribution and timestamps.

---

## 2. Backend Module Breakdown

### 2.1 Module Architecture

```
src/
├── main.ts                        # Application entry point
├── app.module.ts                  # Root module
│
├── common/                        # Shared utilities
│   ├── decorators/               # Custom decorators
│   ├── filters/                  # Exception filters
│   ├── guards/                   # Auth guards
│   ├── interceptors/             # Request/response interceptors
│   ├── pipes/                    # Validation pipes
│   └── utils/                    # Utility functions
│
├── config/                        # Configuration management
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── storage.config.ts
│   └── payment.config.ts
│
├── prisma/                        # Database layer
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
└── modules/
    ├── auth/                      # Authentication & Authorization
    ├── users/                     # User/Player/Arbiter management
    ├── organizations/             # Taluk & Academy management
    ├── office-bearers/            # Office bearer management
    ├── tournaments/               # Tournament lifecycle
    ├── payments/                  # Payment processing
    ├── content/                   # CMS for website content
    ├── media/                     # Media & file management
    ├── notifications/             # Email, SMS, push notifications
    ├── reports/                   # Analytics & reporting
    └── admin/                     # Admin-specific operations
```

### 2.2 Module Specifications

#### 2.2.1 Auth Module (`/modules/auth`)

**Purpose:** Handle authentication, authorization, and session management.

**Components:**
- `auth.controller.ts` - Login, logout, token refresh endpoints
- `auth.service.ts` - Authentication business logic
- `jwt.strategy.ts` - JWT validation strategy
- `local.strategy.ts` - Username/password strategy
- `auth.guard.ts` - Route protection guard
- `roles.guard.ts` - Role-based access guard
- `permissions.guard.ts` - Permission-based access guard

**Features:**
- Multi-type login (Player, Admin, Organization)
- JWT token with refresh token rotation
- Password hashing with bcrypt (12 rounds)
- OTP-based password reset
- Session tracking and device management
- Brute force protection with rate limiting

**Endpoints:**
```
POST   /auth/login                    # Universal login
POST   /auth/logout                   # Logout current session
POST   /auth/refresh                  # Refresh access token
POST   /auth/forgot-password          # Request password reset
POST   /auth/reset-password           # Reset password with OTP
GET    /auth/me                       # Get current user profile
POST   /auth/change-password          # Change password (authenticated)
```

#### 2.2.2 Users Module (`/modules/users`)

**Purpose:** Manage players and arbiters.

**Features:**
- KKDCA ID generation (format: {SEQ}{TALUK_CODE}{YEAR})
- Profile management with document uploads
- Membership tracking and renewals
- Search and filtering with pagination
- Bulk import via Excel/CSV
- Profile verification workflow

**Sub-modules:**
- Players - Chess player management
- Arbiters - Arbiter management with title verification (IA/FA/NA/SA)

**Endpoints:**
```
# Player Endpoints
POST   /users/players/register        # Player registration
GET    /users/players                 # List players (paginated)
GET    /users/players/:id             # Get player by ID
PUT    /users/players/:id             # Update player
GET    /users/players/search          # Search players (public)
POST   /users/players/bulk-import     # Bulk import players
GET    /users/players/export          # Export players to Excel

# Arbiter Endpoints
POST   /users/arbiters/register       # Arbiter registration
GET    /users/arbiters                # List arbiters
GET    /users/arbiters/:id            # Get arbiter by ID
PUT    /users/arbiters/:id/approve    # Approve arbiter
PUT    /users/arbiters/:id/reject     # Reject arbiter
```

#### 2.2.3 Organizations Module (`/modules/organizations`)

**Purpose:** Manage Taluk Associations and Chess Academies.

**Features:**
- Organization registration and approval
- Profile management with logo and certificate uploads
- Office bearer management
- Affiliated player tracking
- Tournament bid management
- Annual renewal processing

**Sub-modules:**
- Taluk Associations - 7 taluk chess associations
- Academies - Affiliated chess academies

**Endpoints:**
```
# Organization CRUD
POST   /organizations/register        # Register new organization
GET    /organizations                 # List all organizations
GET    /organizations/:id             # Get organization details
PUT    /organizations/:id             # Update organization
PUT    /organizations/:id/approve     # Approve organization
PUT    /organizations/:id/reject      # Reject organization

# Organization Portal
GET    /organizations/:id/dashboard   # Organization dashboard
GET    /organizations/:id/players     # Affiliated players
GET    /organizations/:id/arbiters    # Affiliated arbiters

# Office Bearers (nested)
GET    /organizations/:id/office-bearers
POST   /organizations/:id/office-bearers
PUT    /organizations/:id/office-bearers/:bearerId
DELETE /organizations/:id/office-bearers/:bearerId
```

#### 2.2.4 Office Bearers Module (`/modules/office-bearers`)

**Purpose:** Manage office bearers at district and organization levels.

**Features:**
- Designation-based ordering (President, Secretary, Treasurer, etc.)
- Photo management with role-based naming
- Active/inactive status
- Term tracking
- Display order customization

**Designations Hierarchy:**
```
1. Honorary President(s)
2. President
3. Secretary
4. Treasurer
5. Vice President(s)
6. Joint Secretary(ies)
7. Executive Member(s)
```

**Endpoints:**
```
GET    /office-bearers                # List all (with filters)
GET    /office-bearers/district       # District-level bearers
GET    /office-bearers/organization/:orgId  # Organization bearers
POST   /office-bearers                # Create bearer
PUT    /office-bearers/:id            # Update bearer
PUT    /office-bearers/:id/order      # Update display order
DELETE /office-bearers/:id            # Remove bearer
```

#### 2.2.5 Tournaments Module (`/modules/tournaments`)

**Purpose:** Complete tournament lifecycle management.

**Features:**
- Tournament creation and approval workflow
- Multi-category tournaments (age groups, rating ranges)
- Player registration with fee collection
- Results and standings management
- Report and certificate generation
- Tournament bidding system

**Status Flow:**
```
DRAFT → PENDING_APPROVAL → APPROVED/REJECTED → OPEN → ONGOING → COMPLETED → ARCHIVED
```

**Endpoints:**
```
# Tournament Management
GET    /tournaments                   # List tournaments
GET    /tournaments/upcoming          # Upcoming tournaments (public)
GET    /tournaments/:id               # Tournament details
POST   /tournaments                   # Create tournament
PUT    /tournaments/:id               # Update tournament
PUT    /tournaments/:id/approve       # Approve tournament
PUT    /tournaments/:id/publish       # Publish tournament
PUT    /tournaments/:id/close         # Close registration
PUT    /tournaments/:id/start         # Start tournament
PUT    /tournaments/:id/complete      # Mark as completed

# Tournament Registrations
GET    /tournaments/:id/registrations # List registrations
POST   /tournaments/:id/register      # Register for tournament
PUT    /tournaments/:id/registrations/:regId  # Update registration
POST   /tournaments/:id/bulk-register # Bulk registration

# Tournament Results
POST   /tournaments/:id/results       # Upload results
GET    /tournaments/:id/standings     # Get standings

# Tournament Bids
GET    /tournaments/bids              # List all bids
POST   /tournaments/bids              # Submit tournament bid
PUT    /tournaments/bids/:id/approve  # Approve bid
PUT    /tournaments/bids/:id/reject   # Reject bid
```

#### 2.2.6 Payments Module (`/modules/payments`)

**Purpose:** Handle all payment processing.

**Features:**
- HDFC SmartGateway integration
- Multiple payment types (membership, tournament, bulk)
- Receipt generation
- Payment verification and reconciliation
- Refund processing
- Payment history and reports

**Payment Types:**
```
- PLAYER_MEMBERSHIP (₹75/year)
- ARBITER_MEMBERSHIP (₹250/year)
- TALUK_RENEWAL (₹1000/year)
- ACADEMY_RENEWAL (₹2000/year)
- TOURNAMENT_REGISTRATION (variable)
- TOURNAMENT_BOOKING (₹1000)
- BULK_REGISTRATION (per player rate)
```

**Endpoints:**
```
POST   /payments/initiate             # Initiate payment
POST   /payments/verify               # Verify payment (callback)
POST   /payments/webhook              # HDFC webhook
GET    /payments/:id                  # Get payment details
GET    /payments/:id/receipt          # Download receipt
GET    /payments/history              # Payment history
GET    /payments/reports              # Payment reports (admin)
POST   /payments/refund               # Initiate refund
```

#### 2.2.7 Content Module (`/modules/content`)

**Purpose:** CMS for all website content.

**Features:**
- Dynamic page content management
- Banner slider management
- News and announcements
- FAQ management
- Contact information
- SEO metadata management
- Content versioning

**Content Types:**
```
- BANNER         # Homepage banners with text overlay
- PAGE_CONTENT   # Static page content blocks
- NEWS           # News articles
- ANNOUNCEMENT   # Urgent announcements
- FAQ            # Frequently asked questions
- DOWNLOAD       # Downloadable resources
- VIDEO          # YouTube/video embeds
- SETTING        # System settings/configuration
```

**Endpoints:**
```
# Public Content
GET    /content/banners               # Active banners
GET    /content/pages/:slug           # Page content by slug
GET    /content/news                  # News listing
GET    /content/news/:slug            # News article
GET    /content/announcements         # Active announcements
GET    /content/faqs                  # FAQ list
GET    /content/downloads             # Downloadable files
GET    /content/videos                # Video gallery

# Admin Content Management
POST   /content/banners               # Create banner
PUT    /content/banners/:id           # Update banner
DELETE /content/banners/:id           # Delete banner
PUT    /content/banners/reorder       # Reorder banners
# Similar CRUD for other content types
```

#### 2.2.8 Media Module (`/modules/media`)

**Purpose:** File upload and media management.

**Features:**
- Multi-type file uploads (images, PDFs, documents)
- Image optimization and resizing
- Secure file storage (S3/local)
- Media library with search
- Usage tracking
- Virus scanning (optional)

**Supported Formats:**
```
Images: JPG, PNG, WEBP, AVIF (auto-converted)
Documents: PDF, DOC, DOCX, XLS, XLSX
Max Size: 5MB (images), 10MB (documents)
```

**Endpoints:**
```
POST   /media/upload                  # Upload file(s)
GET    /media                         # Media library (admin)
GET    /media/:id                     # Get media details
DELETE /media/:id                     # Delete media
GET    /media/serve/:filename         # Serve file (with CDN)
```

#### 2.2.9 Notifications Module (`/modules/notifications`)

**Purpose:** Multi-channel notification delivery.

**Channels:**
- Email (SendGrid/AWS SES)
- SMS (Twilio/MSG91)
- Push notifications (Firebase)
- In-app notifications

**Notification Types:**
```
- REGISTRATION_SUCCESS
- PAYMENT_SUCCESS
- PAYMENT_FAILED
- MEMBERSHIP_EXPIRING
- TOURNAMENT_ANNOUNCEMENT
- APPROVAL_REQUIRED
- APPROVAL_COMPLETED
```

**Endpoints:**
```
GET    /notifications                 # User's notifications
PUT    /notifications/:id/read        # Mark as read
PUT    /notifications/read-all        # Mark all as read
DELETE /notifications/:id             # Delete notification
POST   /notifications/send            # Send notification (admin)
GET    /notifications/preferences     # Notification preferences
PUT    /notifications/preferences     # Update preferences
```

#### 2.2.10 Reports Module (`/modules/reports`)

**Purpose:** Analytics and report generation.

**Report Types:**
- Player registration reports
- Payment collection reports
- Tournament participation reports
- Organization-wise statistics
- Taluk-wise player distribution
- Annual membership reports

**Endpoints:**
```
GET    /reports/dashboard             # Dashboard statistics
GET    /reports/players               # Player reports
GET    /reports/payments              # Payment reports
GET    /reports/tournaments           # Tournament reports
GET    /reports/organizations         # Organization reports
POST   /reports/generate              # Generate custom report
GET    /reports/:id/download          # Download generated report
```

---

## 3. Database Schema Design

### 3.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              KDCA DATABASE SCHEMA v2.0                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │     admins      │     │  organizations  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ kkdca_id        │     │ username        │     │ username        │
│ type            │     │ password_hash   │     │ password_hash   │
│ first_name      │     │ name            │     │ name            │
│ last_name       │     │ email           │     │ type            │
│ email           │     │ role            │     │ taluk           │
│ phone           │     │ is_active       │     │ status          │
│ password_hash   │     │ last_login_at   │     │ contact_person  │
│ date_of_birth   │     │ created_at      │     │ email           │
│ gender          │     │ updated_at      │     │ phone           │
│ taluk           │     └─────────────────┘     │ address         │
│ address         │                              │ logo_url        │
│ pincode         │                              │ certificate_url │
│ fide_id         │     ┌─────────────────┐     │ membership_valid│
│ aicf_id         │     │ office_bearers  │     │ created_at      │
│ tnsca_id        │     ├─────────────────┤     │ updated_at      │
│ arbiter_title   │     │ id (PK)         │◄────┤                 │
│ photo_url       │     │ org_id (FK)     │     └─────────────────┘
│ membership_paid │     │ level           │
│ membership_valid│     │ designation     │
│ approval_status │     │ name            │     ┌─────────────────┐
│ created_at      │     │ phone           │     │   tournaments   │
│ updated_at      │     │ email           │     ├─────────────────┤
└────────┬────────┘     │ photo_url       │     │ id (PK)         │
         │              │ display_order   │     │ name            │
         │              │ is_active       │     │ description     │
         │              │ created_at      │     │ venue           │
         │              └─────────────────┘     │ start_date      │
         │                                       │ end_date        │
         │     ┌─────────────────────────────────│ reg_deadline    │
         │     │                                 │ entry_fee       │
         │     │  ┌─────────────────┐           │ categories      │
         │     │  │ tournament_regs │           │ status          │
         │     │  ├─────────────────┤           │ approval_status │
         │     │  │ id (PK)         │           │ organized_by(FK)│
         └─────┼──│ user_id (FK)    │           │ banner_url      │
               │  │ tournament_id(FK)├───────────│ created_at      │
               │  │ category        │           │ updated_at      │
               │  │ fee_paid        │           └─────────────────┘
               │  │ board_number    │
               │  │ score           │           ┌─────────────────┐
               │  │ rank            │           │ tournament_bids │
               │  │ status          │           ├─────────────────┤
               │  │ created_at      │           │ id (PK)         │
               │  └─────────────────┘           │ org_id (FK)     │
               │                                │ level           │
               │  ┌─────────────────┐           │ event_name      │
               │  │    payments     │           │ venue           │
               │  ├─────────────────┤           │ time_control    │
               │  │ id (PK)         │           │ categories      │
               └──│ user_id (FK)    │           │ prize_pool      │
                  │ order_id        │           │ chief_arbiter   │
                  │ gateway_ref     │           │ status          │
                  │ amount          │           │ created_at      │
                  │ currency        │           └─────────────────┘
                  │ payment_type    │
                  │ status          │           ┌─────────────────┐
                  │ payment_method  │           │    content      │
                  │ paid_at         │           ├─────────────────┤
                  │ created_at      │           │ id (PK)         │
                  └─────────────────┘           │ type            │
                                               │ slug            │
                  ┌─────────────────┐           │ title           │
                  │     media       │           │ content (JSON)  │
                  ├─────────────────┤           │ is_active       │
                  │ id (PK)         │           │ display_order   │
                  │ filename        │           │ published_at    │
                  │ original_name   │           │ created_by (FK) │
                  │ mime_type       │           │ created_at      │
                  │ size            │           │ updated_at      │
                  │ url             │           └─────────────────┘
                  │ uploaded_by(FK) │
                  │ created_at      │           ┌─────────────────┐
                  └─────────────────┘           │ notifications   │
                                               ├─────────────────┤
                  ┌─────────────────┐           │ id (PK)         │
                  │  audit_logs     │           │ user_id (FK)    │
                  ├─────────────────┤           │ type            │
                  │ id (PK)         │           │ title           │
                  │ entity_type     │           │ message         │
                  │ entity_id       │           │ is_read         │
                  │ action          │           │ created_at      │
                  │ old_values      │           └─────────────────┘
                  │ new_values      │
                  │ user_id (FK)    │           ┌─────────────────┐
                  │ ip_address      │           │   settings      │
                  │ created_at      │           ├─────────────────┤
                  └─────────────────┘           │ key (PK)        │
                                               │ value           │
                                               │ description     │
                                               │ updated_by (FK) │
                                               │ updated_at      │
                                               └─────────────────┘
```

### 3.2 Detailed Table Definitions

#### 3.2.1 Users Table (players & arbiters)

```sql
CREATE TABLE users (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kkdca_id            VARCHAR(20) UNIQUE NOT NULL,    -- e.g., 01KKI2026
    type                 user_type NOT NULL,             -- PLAYER, ARBITER

    -- Personal Information
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    phone               VARCHAR(15) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    date_of_birth       DATE NOT NULL,
    gender              gender_type NOT NULL,           -- MALE, FEMALE, OTHER

    -- Address
    address             TEXT NOT NULL,
    taluk               taluk_type NOT NULL,            -- 7 taluks
    pincode             VARCHAR(6) NOT NULL,
    state               VARCHAR(50) DEFAULT 'Tamil Nadu',
    district            VARCHAR(50) DEFAULT 'Kallakurichi',

    -- Parent/Guardian
    parent_name         VARCHAR(100) NOT NULL,
    relationship        relationship_type NOT NULL,     -- FATHER, MOTHER, GUARDIAN, etc.

    -- Chess IDs (optional)
    fide_id             VARCHAR(20),
    aicf_id             VARCHAR(20),
    tnsca_id            VARCHAR(20),

    -- Arbiter specific
    arbiter_title       arbiter_title_type,             -- IA, FA, NA, SNA, SA

    -- Documents
    photo_url           TEXT,
    birth_certificate   TEXT,
    aadhaar_document    TEXT,

    -- Membership
    membership_paid     BOOLEAN DEFAULT FALSE,
    membership_valid_till DATE,

    -- Approval (for arbiters)
    approval_status     approval_status DEFAULT 'PENDING',
    approved_by         UUID REFERENCES admins(id),
    approved_at         TIMESTAMP,
    rejection_reason    TEXT,

    -- Metadata
    last_login_at       TIMESTAMP,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    -- Indexes
    CONSTRAINT valid_phone CHECK (phone ~ '^[6-9]\d{9}$'),
    CONSTRAINT valid_pincode CHECK (pincode ~ '^\d{6}$')
);

CREATE INDEX idx_users_kkdca_id ON users(kkdca_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_taluk ON users(taluk);
CREATE INDEX idx_users_type ON users(type);
CREATE INDEX idx_users_membership ON users(membership_valid_till);
```

#### 3.2.2 Organizations Table

```sql
CREATE TABLE organizations (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username            VARCHAR(50) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,

    -- Basic Info
    name                VARCHAR(200) NOT NULL,
    type                org_type NOT NULL,              -- TALUK_ASSOCIATION, ACADEMY
    taluk               taluk_type NOT NULL,

    -- Contact
    contact_person      VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(15) NOT NULL,
    address             TEXT NOT NULL,

    -- Documents
    logo_url            TEXT,
    registration_certificate TEXT,

    -- Status
    status              approval_status DEFAULT 'PENDING',
    approved_by         UUID REFERENCES admins(id),
    approved_at         TIMESTAMP,
    rejection_reason    TEXT,

    -- Membership
    membership_valid_till DATE,

    -- Metadata
    last_login_at       TIMESTAMP,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orgs_type ON organizations(type);
CREATE INDEX idx_orgs_taluk ON organizations(taluk);
CREATE INDEX idx_orgs_status ON organizations(status);
```

#### 3.2.3 Office Bearers Table

```sql
CREATE TABLE office_bearers (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID REFERENCES organizations(id) ON DELETE CASCADE,

    -- Level: DISTRICT (null org_id) or ORGANIZATION
    level               bearer_level NOT NULL,          -- DISTRICT, ORGANIZATION

    -- Bearer Info
    designation         designation_type NOT NULL,
    name                VARCHAR(100) NOT NULL,
    phone               VARCHAR(15),
    email               VARCHAR(255),
    photo_url           TEXT,

    -- Display
    display_order       INT DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,

    -- Term (optional)
    term_start          DATE,
    term_end            DATE,

    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bearers_org ON office_bearers(organization_id);
CREATE INDEX idx_bearers_level ON office_bearers(level);
CREATE INDEX idx_bearers_designation ON office_bearers(designation);
CREATE INDEX idx_bearers_order ON office_bearers(display_order);
```

#### 3.2.4 Tournaments Table

```sql
CREATE TABLE tournaments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    name                VARCHAR(200) NOT NULL,
    description         TEXT,
    venue               TEXT NOT NULL,

    -- Dates
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    registration_deadline DATE NOT NULL,

    -- Tournament Details
    entry_fee           DECIMAL(10,2) DEFAULT 0,
    categories          JSONB NOT NULL,                 -- [{name, ageMin, ageMax, ratingMin, ratingMax}]
    time_control        VARCHAR(50),
    rounds              INT,
    prize_pool          JSONB,                          -- Prize distribution

    -- Organization
    organized_by        UUID REFERENCES organizations(id),
    chief_arbiter       VARCHAR(100),

    -- Status
    status              tournament_status DEFAULT 'DRAFT',
    approval_status     approval_status DEFAULT 'PENDING',
    approved_by         UUID REFERENCES admins(id),
    approved_at         TIMESTAMP,

    -- Media
    banner_url          TEXT,
    report_file         TEXT,
    results_file        TEXT,

    -- Fees
    kkdca_fee_paid      BOOLEAN DEFAULT FALSE,
    kkdca_fee_percentage DECIMAL(5,2) DEFAULT 10,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_deadline CHECK (registration_deadline <= start_date)
);

CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournaments_organizer ON tournaments(organized_by);
```

#### 3.2.5 Payments Table

```sql
CREATE TABLE payments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Order Info
    order_id            VARCHAR(50) UNIQUE NOT NULL,    -- Internal order ID
    gateway_order_id    VARCHAR(100),                   -- HDFC order reference
    gateway_txn_id      VARCHAR(100),                   -- Transaction ID

    -- User Reference
    user_id             UUID REFERENCES users(id),
    organization_id     UUID REFERENCES organizations(id),
    tournament_id       UUID REFERENCES tournaments(id),

    -- Amount
    amount              DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(3) DEFAULT 'INR',

    -- Payment Details
    payment_type        payment_type NOT NULL,
    status              payment_status DEFAULT 'PENDING',
    payment_method      VARCHAR(50),

    -- Customer Info (for non-authenticated payments)
    customer_name       VARCHAR(100),
    customer_email      VARCHAR(255) NOT NULL,
    customer_phone      VARCHAR(15) NOT NULL,

    -- Timestamps
    initiated_at        TIMESTAMP DEFAULT NOW(),
    paid_at             TIMESTAMP,

    -- Gateway Response
    gateway_response    JSONB,

    -- Receipt
    receipt_number      VARCHAR(50),
    receipt_generated   BOOLEAN DEFAULT FALSE,

    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_date ON payments(created_at);
```

#### 3.2.6 Content Table (CMS)

```sql
CREATE TABLE content (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identification
    type                content_type NOT NULL,
    slug                VARCHAR(200) UNIQUE,

    -- Content
    title               VARCHAR(500),
    subtitle            VARCHAR(500),
    content             JSONB NOT NULL,                 -- Flexible content structure

    -- Media
    image_url           TEXT,
    thumbnail_url       TEXT,

    -- SEO
    meta_title          VARCHAR(200),
    meta_description    TEXT,
    keywords            TEXT[],

    -- Display
    is_active           BOOLEAN DEFAULT TRUE,
    display_order       INT DEFAULT 0,

    -- Publishing
    published_at        TIMESTAMP,
    expires_at          TIMESTAMP,

    -- Versioning
    version             INT DEFAULT 1,

    -- Metadata
    created_by          UUID REFERENCES admins(id),
    updated_by          UUID REFERENCES admins(id),
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_active ON content(is_active);
CREATE INDEX idx_content_published ON content(published_at);
```

### 3.3 Enum Definitions

```sql
-- User Types
CREATE TYPE user_type AS ENUM ('PLAYER', 'ARBITER');

-- Gender
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Taluks
CREATE TYPE taluk_type AS ENUM (
    'CHINNASALEM',
    'KALLAKURICHI',
    'KALVARAYAN_HILLS',
    'SANKARAPURAM',
    'THIRUKOILUR',
    'ULUNDURPET',
    'VANAPURAM'
);

-- Taluk Codes (for KKDCA ID generation)
-- CSM, KKI, KVH, SKP, TKR, ULP, VNP

-- Arbiter Titles
CREATE TYPE arbiter_title_type AS ENUM ('IA', 'FA', 'NA', 'SNA', 'SA');

-- Relationship Types
CREATE TYPE relationship_type AS ENUM (
    'FATHER', 'MOTHER', 'GUARDIAN', 'SPOUSE', 'SELF'
);

-- Organization Types
CREATE TYPE org_type AS ENUM ('TALUK_ASSOCIATION', 'ACADEMY');

-- Admin Roles
CREATE TYPE admin_role AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- Approval Status
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Tournament Status
CREATE TYPE tournament_status AS ENUM (
    'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED',
    'OPEN', 'CLOSED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'ARCHIVED'
);

-- Payment Type
CREATE TYPE payment_type AS ENUM (
    'PLAYER_MEMBERSHIP', 'ARBITER_MEMBERSHIP',
    'TALUK_RENEWAL', 'ACADEMY_RENEWAL',
    'TOURNAMENT_REGISTRATION', 'TOURNAMENT_BOOKING',
    'BULK_REGISTRATION'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
    'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'
);

-- Office Bearer Designations
CREATE TYPE designation_type AS ENUM (
    'HONORARY_PRESIDENT',
    'PRESIDENT',
    'SECRETARY',
    'TREASURER',
    'VICE_PRESIDENT',
    'JOINT_SECRETARY',
    'EXECUTIVE_MEMBER'
);

-- Bearer Level
CREATE TYPE bearer_level AS ENUM ('DISTRICT', 'ORGANIZATION');

-- Content Types
CREATE TYPE content_type AS ENUM (
    'BANNER', 'PAGE_CONTENT', 'NEWS', 'ANNOUNCEMENT',
    'FAQ', 'DOWNLOAD', 'VIDEO', 'RESOURCE'
);
```

---

## 4. API Contract Outline

### 4.1 API Design Principles

1. **RESTful Design**: Resource-oriented URLs with standard HTTP methods
2. **Versioning**: URL-based versioning (`/api/v1/...`)
3. **JSON Responses**: Consistent response format
4. **Pagination**: Cursor-based for large datasets
5. **Error Handling**: Standardized error responses
6. **Rate Limiting**: Tier-based rate limits
7. **Authentication**: JWT Bearer tokens

### 4.2 Response Format

#### Success Response
```json
{
    "success": true,
    "data": { ... },
    "meta": {
        "timestamp": "2026-01-26T10:30:00Z",
        "requestId": "req_abc123"
    }
}
```

#### Paginated Response
```json
{
    "success": true,
    "data": [ ... ],
    "pagination": {
        "total": 150,
        "page": 1,
        "limit": 20,
        "totalPages": 8,
        "hasNext": true,
        "hasPrev": false
    }
}
```

#### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            { "field": "email", "message": "Invalid email format" }
        ]
    },
    "meta": {
        "timestamp": "2026-01-26T10:30:00Z",
        "requestId": "req_abc123"
    }
}
```

### 4.3 Public API Endpoints (No Auth Required)

#### Content API
```yaml
# Home Page
GET /api/v1/public/home
  Response: { banners, announcements, upcomingTournaments, stats }

# About Pages
GET /api/v1/public/about
GET /api/v1/public/about/history
GET /api/v1/public/about/registration

# Office Bearers
GET /api/v1/public/office-bearers
  Query: level (DISTRICT|ORGANIZATION), orgId
  Response: Grouped by designation

# Organizations
GET /api/v1/public/taluks
GET /api/v1/public/taluks/:slug
GET /api/v1/public/academies
GET /api/v1/public/academies/:slug

# Tournaments
GET /api/v1/public/tournaments
  Query: status, upcoming, past
GET /api/v1/public/tournaments/:id

# Players (Search)
GET /api/v1/public/players/search
  Query: name, kkdcaId, taluk

# Arbiters
GET /api/v1/public/arbiters
  Query: title, taluk

# Resources
GET /api/v1/public/downloads
GET /api/v1/public/videos
GET /api/v1/public/news
GET /api/v1/public/news/:slug
GET /api/v1/public/faqs

# Contact
GET /api/v1/public/contact
```

### 4.4 Authentication API

```yaml
# Login (Universal)
POST /api/v1/auth/login
  Body: { identifier, password, userType }
  Response: { accessToken, refreshToken, user }

# Refresh Token
POST /api/v1/auth/refresh
  Body: { refreshToken }
  Response: { accessToken, refreshToken }

# Logout
POST /api/v1/auth/logout
  Headers: Authorization: Bearer {token}

# Password Reset
POST /api/v1/auth/forgot-password
  Body: { email }

POST /api/v1/auth/verify-otp
  Body: { email, otp }

POST /api/v1/auth/reset-password
  Body: { email, otp, newPassword }
```

### 4.5 Player/Arbiter API (Authenticated)

```yaml
# Registration
POST /api/v1/users/register
  Body: { type, personalInfo, contactInfo, documents, chessIds, password }
  Response: { user, paymentLink }

# Profile
GET /api/v1/users/me
PUT /api/v1/users/me
  Body: { ...updatable fields }

# Change Password
POST /api/v1/users/change-password
  Body: { currentPassword, newPassword }

# Membership
GET /api/v1/users/membership
POST /api/v1/users/membership/renew
  Response: { paymentLink }

# Tournament Registration
GET /api/v1/users/tournaments
POST /api/v1/users/tournaments/:id/register
  Body: { category }
  Response: { registration, paymentLink }
```

### 4.6 Organization API (Authenticated)

```yaml
# Dashboard
GET /api/v1/org/dashboard
  Response: { stats, recentActivities, pendingActions }

# Profile
GET /api/v1/org/profile
PUT /api/v1/org/profile
  Body: { ...updatable fields }

# Office Bearers
GET /api/v1/org/office-bearers
POST /api/v1/org/office-bearers
  Body: { designation, name, phone, email, photo }
PUT /api/v1/org/office-bearers/:id
DELETE /api/v1/org/office-bearers/:id
PUT /api/v1/org/office-bearers/reorder
  Body: { orders: [{ id, displayOrder }] }

# Affiliated Members
GET /api/v1/org/players
  Query: search, page, limit
GET /api/v1/org/arbiters

# Bulk Registration
POST /api/v1/org/players/bulk-register
  Body: { players: [...] } OR FormData with Excel file

# Tournament Bids
GET /api/v1/org/tournament-bids
POST /api/v1/org/tournament-bids
  Body: { level, eventName, venue, dates, ... }
GET /api/v1/org/tournament-bids/:id

# Payments
GET /api/v1/org/payments
POST /api/v1/org/membership/renew
  Response: { paymentLink }
```

### 4.7 Admin API (Admin Authenticated)

```yaml
# Dashboard
GET /api/v1/admin/dashboard
  Response: { stats, recentRegistrations, pendingApprovals, revenue }

# Players Management
GET /api/v1/admin/players
  Query: search, taluk, status, membershipStatus, page, limit
GET /api/v1/admin/players/:id
PUT /api/v1/admin/players/:id
DELETE /api/v1/admin/players/:id (soft delete)
POST /api/v1/admin/players/export
  Query: filters
  Response: Excel file

# Arbiters Management
GET /api/v1/admin/arbiters
GET /api/v1/admin/arbiters/pending
PUT /api/v1/admin/arbiters/:id/approve
PUT /api/v1/admin/arbiters/:id/reject
  Body: { reason }

# Organizations Management
GET /api/v1/admin/organizations
  Query: type, status, taluk
GET /api/v1/admin/organizations/:id
PUT /api/v1/admin/organizations/:id
PUT /api/v1/admin/organizations/:id/approve
PUT /api/v1/admin/organizations/:id/reject
  Body: { reason }

# Office Bearers (District Level)
GET /api/v1/admin/office-bearers
POST /api/v1/admin/office-bearers
PUT /api/v1/admin/office-bearers/:id
DELETE /api/v1/admin/office-bearers/:id

# Tournaments
GET /api/v1/admin/tournaments
POST /api/v1/admin/tournaments
PUT /api/v1/admin/tournaments/:id
PUT /api/v1/admin/tournaments/:id/approve
PUT /api/v1/admin/tournaments/:id/reject
GET /api/v1/admin/tournament-bids
PUT /api/v1/admin/tournament-bids/:id/approve
PUT /api/v1/admin/tournament-bids/:id/reject

# Payments
GET /api/v1/admin/payments
  Query: type, status, dateFrom, dateTo
GET /api/v1/admin/payments/:id
POST /api/v1/admin/payments/:id/refund
GET /api/v1/admin/payments/reports
  Query: period, type

# Content Management
GET /api/v1/admin/content
POST /api/v1/admin/content
PUT /api/v1/admin/content/:id
DELETE /api/v1/admin/content/:id

# Settings (Super Admin)
GET /api/v1/admin/settings
PUT /api/v1/admin/settings
GET /api/v1/admin/settings/fees
PUT /api/v1/admin/settings/fees

# Admin Users (Super Admin)
GET /api/v1/admin/users
POST /api/v1/admin/users
PUT /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
```

### 4.8 Payment API

```yaml
# Initiate Payment
POST /api/v1/payments/initiate
  Body: {
    type,
    entityId,        # userId, orgId, or tournamentRegId
    customerEmail,
    customerPhone,
    customerName
  }
  Response: { paymentId, paymentLink }

# Verify Payment (Return URL)
POST /api/v1/payments/verify
  Body: { orderId, gatewayResponse }

# Webhook (HDFC Callback)
POST /api/v1/payments/webhook
  Body: HDFC webhook payload

# Payment Status
GET /api/v1/payments/:orderId/status
GET /api/v1/payments/:orderId/receipt
```

---

## 5. Frontend Data Flow Strategy

### 5.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   Next.js App   │     │   Next.js App   │     │  Shared Package │       │
│  │  Public Website │     │   Admin Portal  │     │   (Monorepo)    │       │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘       │
│           │                       │                       │                 │
│           │                       │                       │                 │
│           └───────────────┬───────┴───────────────────────┘                 │
│                           │                                                  │
│                           ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       STATE MANAGEMENT LAYER                         │   │
│  │                                                                      │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │   │
│  │  │  TanStack Query  │  │     Zustand      │  │    React Hook    │  │   │
│  │  │  (Server State)  │  │  (Client State)  │  │      Form        │  │   │
│  │  │                  │  │                  │  │                  │  │   │
│  │  │ • API Caching    │  │ • UI State       │  │ • Form State     │  │   │
│  │  │ • Auto Refetch   │  │ • Auth Context   │  │ • Validation     │  │   │
│  │  │ • Optimistic UI  │  │ • Theme/Prefs    │  │ • Error Handling │  │   │
│  │  │ • Background     │  │ • Sidebar State  │  │                  │  │   │
│  │  │   Refresh        │  │                  │  │                  │  │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                  │
│                           ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API CLIENT LAYER                             │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  Axios Instance with Interceptors                             │  │   │
│  │  │                                                               │  │   │
│  │  │  • Base URL Configuration (per environment)                   │  │   │
│  │  │  • Auth Token Injection                                       │  │   │
│  │  │  • Token Refresh Logic                                        │  │   │
│  │  │  • Error Transformation                                       │  │   │
│  │  │  • Request/Response Logging (dev)                            │  │   │
│  │  │  • Retry Logic for Network Errors                            │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Project Structure (Monorepo)

```
kdca-platform/
├── apps/
│   ├── web/                      # Public website
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── (public)/        # Public routes group
│   │   │   │   ├── page.tsx     # Home
│   │   │   │   ├── about/
│   │   │   │   ├── office-bearers/
│   │   │   │   ├── taluks/
│   │   │   │   ├── academies/
│   │   │   │   ├── tournaments/
│   │   │   │   ├── news/
│   │   │   │   ├── downloads/
│   │   │   │   └── contact/
│   │   │   ├── (auth)/          # Auth routes
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── (player)/        # Protected player routes
│   │   │       ├── profile/
│   │   │       └── tournaments/
│   │   ├── components/
│   │   └── styles/
│   │
│   └── admin/                    # Admin portal
│       ├── app/
│       │   ├── (auth)/
│       │   │   └── login/
│       │   ├── (dashboard)/     # Protected admin routes
│       │   │   ├── page.tsx     # Dashboard
│       │   │   ├── players/
│       │   │   ├── arbiters/
│       │   │   ├── organizations/
│       │   │   ├── tournaments/
│       │   │   ├── payments/
│       │   │   ├── content/
│       │   │   └── settings/
│       │   └── (org)/           # Organization portal routes
│       │       ├── org-dashboard/
│       │       ├── org-profile/
│       │       ├── org-bearers/
│       │       └── org-tournaments/
│       ├── components/
│       └── styles/
│
├── packages/
│   ├── ui/                       # Shared UI components
│   │   ├── components/
│   │   │   ├── buttons/
│   │   │   ├── forms/
│   │   │   ├── cards/
│   │   │   ├── tables/
│   │   │   ├── modals/
│   │   │   └── layouts/
│   │   └── styles/
│   │
│   ├── api-client/               # Shared API client
│   │   ├── client.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useTournaments.ts
│   │   │   └── useContent.ts
│   │   └── types/
│   │
│   └── utils/                    # Shared utilities
│       ├── validators.ts
│       ├── formatters.ts
│       └── constants.ts
│
├── turbo.json                    # Turborepo config
└── package.json
```

### 5.3 Data Fetching Patterns

#### Server Components (Static/SSG)
```typescript
// For public content that changes infrequently
// apps/web/app/(public)/about/page.tsx

export const revalidate = 3600; // Revalidate every hour

async function AboutPage() {
  const content = await api.public.getAbout();

  return <AboutContent data={content} />;
}
```

#### Server Components (Dynamic/ISR)
```typescript
// For content that updates more frequently
// apps/web/app/(public)/tournaments/page.tsx

export const revalidate = 60; // Revalidate every minute

async function TournamentsPage() {
  const tournaments = await api.public.getTournaments();

  return <TournamentList data={tournaments} />;
}
```

#### Client Components (Real-time)
```typescript
// For user-specific or frequently changing data
// apps/admin/app/(dashboard)/players/page.tsx

'use client';

function PlayersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['players', filters],
    queryFn: () => api.admin.getPlayers(filters),
  });

  return <PlayerTable data={data} loading={isLoading} />;
}
```

### 5.4 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    User Login Request
           │
           ▼
    ┌─────────────┐
    │   Frontend  │ ────POST /auth/login────► ┌─────────────┐
    │             │                            │   Backend   │
    │             │ ◄───{ tokens, user }────── │             │
    └─────────────┘                            └─────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────┐
    │  Store Tokens                                            │
    │  • accessToken → Memory (Zustand)                       │
    │  • refreshToken → HttpOnly Cookie (secure)              │
    │  • user → Memory (Zustand)                              │
    └─────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────┐
    │  Subsequent Requests                                     │
    │  • Axios interceptor adds: Authorization: Bearer {token}│
    │  • On 401: Auto-refresh token                           │
    │  • On refresh fail: Redirect to login                   │
    └─────────────────────────────────────────────────────────┘
```

### 5.5 Dynamic Content Rendering Strategy

The frontend NEVER assumes content structure. It receives data from APIs and renders dynamically:

```typescript
// Example: Dynamic Banner Rendering
interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  displayOrder: number;
}

function HeroBanner() {
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: api.public.getBanners,
  });

  // Frontend decides HOW to render, not WHAT to render
  return (
    <Carousel autoPlay interval={5000}>
      {banners?.map(banner => (
        <Slide key={banner.id}>
          <Image src={banner.imageUrl} alt={banner.title || ''} />
          {banner.title && <Title>{banner.title}</Title>}
          {banner.subtitle && <Subtitle>{banner.subtitle}</Subtitle>}
        </Slide>
      ))}
    </Carousel>
  );
}
```

### 5.6 Responsive Design Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RESPONSIVE BREAKPOINTS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Mobile (320px - 640px)                                                      │
│  • Single column layout                                                      │
│  • Hamburger navigation                                                      │
│  • Touch-optimized interactions                                              │
│  • Reduced image sizes                                                       │
│                                                                              │
│  Tablet (641px - 1024px)                                                     │
│  • Two column layouts where appropriate                                      │
│  • Collapsible sidebar                                                       │
│  • Optimized for both touch and pointer                                      │
│                                                                              │
│  Desktop (1025px+)                                                           │
│  • Full multi-column layouts                                                 │
│  • Persistent navigation                                                     │
│  • Rich hover states                                                         │
│  • Maximum content density                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Admin & Role Workflows

### 6.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────┐
                        │   SUPER ADMIN    │
                        │   (Full Access)  │
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │   ADMIN   │ │   TALUK   │ │  ACADEMY  │
            │ (District)│ │   ASSOC   │ │           │
            └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                  │             │             │
                  │             │             │
                  ▼             ▼             ▼
            ┌───────────────────────────────────────┐
            │             PUBLIC USERS              │
            │     (Players, Arbiters, Visitors)     │
            └───────────────────────────────────────┘
```

### 6.2 Permission Matrix

| Permission | Super Admin | Admin | Taluk | Academy | Player |
|------------|:-----------:|:-----:|:-----:|:-------:|:------:|
| **Content Management** |
| Manage Banners | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Pages | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage News | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Downloads | ✅ | ✅ | ❌ | ❌ | ❌ |
| **User Management** |
| View All Players | ✅ | ✅ | Own Taluk | Own Affiliated | ❌ |
| Edit Players | ✅ | ✅ | ❌ | ❌ | Own Profile |
| Approve Arbiters | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bulk Register | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Organization Management** |
| View All Orgs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Orgs | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Orgs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Own Org | - | - | ✅ | ✅ | ❌ |
| Manage Office Bearers | ✅ | ✅ | Own Org | Own Org | ❌ |
| **Tournament Management** |
| Create Tournament | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve Tournament | ✅ | ✅ | ❌ | ❌ | ❌ |
| Register for Tournament | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Payment Management** |
| View All Payments | ✅ | ✅ | Own | Own | Own |
| Issue Refunds | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Settings** |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fee Configuration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ | ❌ | ❌ |

### 6.3 Key Workflows

#### 6.3.1 Player Registration Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PLAYER REGISTRATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ User visits  │
    │  /register   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 1: Personal Information                                 │
    │  • First Name, Last Name, Email, Phone                       │
    │  • Date of Birth, Gender                                      │
    │  • Mother Tongue (optional)                                   │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 2: Parent/Guardian & Address                           │
    │  • Parent Name, Relationship                                  │
    │  • Address, Taluk (dropdown), Pincode                        │
    │  • State/District auto-filled                                │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 3: Documents (All Optional)                            │
    │  • Photo (JPG/PNG, max 3MB)                                  │
    │  • Birth Certificate                                          │
    │  • Aadhaar Document                                          │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 4: Chess IDs & Password                                │
    │  • FIDE ID, AICF ID, TNSCA ID (optional)                    │
    │  • Password (8+ chars, mixed case, number)                   │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  BACKEND PROCESSING                                          │
    │  1. Validate all fields                                      │
    │  2. Check email uniqueness                                   │
    │  3. Hash password (bcrypt)                                   │
    │  4. Generate KKDCA ID: {SEQ}{TALUK_CODE}{YEAR}              │
    │  5. Upload documents to storage                              │
    │  6. Create user record (membershipPaid = false)             │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  PAYMENT INITIATION                                          │
    │  • Amount: ₹75 (Player) / ₹250 (Arbiter)                    │
    │  • Create payment record                                      │
    │  • Generate HDFC payment link                                │
    │  • Redirect to payment gateway                               │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
            ┌─────────────┐               ┌─────────────┐
            │   SUCCESS   │               │   FAILED    │
            ├─────────────┤               ├─────────────┤
            │ • Update    │               │ • Payment   │
            │   payment   │               │   status =  │
            │   status    │               │   failed    │
            │ • membership│               │ • Show      │
            │   Paid=true │               │   retry     │
            │ • Valid till│               │   option    │
            │   Dec 31    │               │ • User can  │
            │ • Send      │               │   pay from  │
            │   welcome   │               │   profile   │
            │   email     │               │             │
            └─────────────┘               └─────────────┘
```

#### 6.3.2 Tournament Approval Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TOURNAMENT APPROVAL WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  Organization    │
    │  creates event   │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: DRAFT                                    │
    │  • Organization can edit all details             │
    │  • Not visible to public                         │
    │  • Save as draft or submit for approval          │
    └────────────────────┬─────────────────────────────┘
                         │
                         │ [Submit for Approval]
                         ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: PENDING_APPROVAL                        │
    │  • Organization cannot edit                      │
    │  • Admin notification triggered                  │
    │  • Appears in Admin approval queue              │
    └────────────────────┬─────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    [APPROVED]     [REJECTED]    [REQUEST CHANGES]
         │               │               │
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐   ┌─────────────┐  ┌─────────────┐
    │ STATUS: │   │ STATUS:     │  │ STATUS:     │
    │APPROVED │   │ REJECTED    │  │ DRAFT       │
    │         │   │             │  │             │
    │ • Can   │   │ • Org gets  │  │ • Org can   │
    │   publish│   │   reason    │  │   edit &    │
    │ • Fee   │   │ • Can       │  │   resubmit  │
    │   payment│   │   modify &  │  │             │
    │   due    │   │   resubmit  │  │             │
    └────┬────┘   └─────────────┘  └─────────────┘
         │
         │ [After KKDCA Fee Payment]
         ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: OPEN                                     │
    │  • Visible on public website                     │
    │  • Players can register                          │
    │  • Registration deadline countdown               │
    └────────────────────┬─────────────────────────────┘
                         │
                         │ [Deadline reached OR manual close]
                         ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: CLOSED                                  │
    │  • No new registrations                          │
    │  • Final participant list generated             │
    └────────────────────┬─────────────────────────────┘
                         │
                         │ [Tournament date]
                         ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: ONGOING                                 │
    │  • Live updates (optional)                       │
    │  • Results entry enabled                        │
    └────────────────────┬─────────────────────────────┘
                         │
                         │ [Upload results]
                         ▼
    ┌──────────────────────────────────────────────────┐
    │  STATUS: COMPLETED                               │
    │  • Results published                             │
    │  • Certificates available                        │
    │  • Report file uploaded                          │
    └──────────────────────────────────────────────────┘
```

#### 6.3.3 Bulk Registration Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BULK REGISTRATION WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │  TWO INPUT METHODS                                           │
    │                                                              │
    │  ┌─────────────────────┐    ┌─────────────────────────┐     │
    │  │  METHOD 1           │    │  METHOD 2               │     │
    │  │  Multi-Entry Form   │    │  Excel/CSV Import       │     │
    │  │                     │    │                         │     │
    │  │  • Add players      │    │  • Download template    │     │
    │  │    one by one      │    │  • Fill offline        │     │
    │  │  • Inline validation│    │  • Upload file         │     │
    │  │  • Live preview     │    │  • Preview & validate  │     │
    │  └─────────────────────┘    └─────────────────────────┘     │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  VALIDATION STEP                                             │
    │                                                              │
    │  For each player entry:                                      │
    │  • Email uniqueness check                                    │
    │  • Phone format validation                                   │
    │  • Required fields check                                     │
    │  • Duplicate detection within batch                         │
    │                                                              │
    │  Results:                                                    │
    │  ┌─────────┐  ┌─────────┐                                   │
    │  │ VALID   │  │ INVALID │                                   │
    │  │ Entries │  │ Entries │ → Show errors, allow correction   │
    │  └─────────┘  └─────────┘                                   │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   │ [All valid]
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  PAYMENT CALCULATION                                         │
    │                                                              │
    │  Total = Number of Players × ₹75                            │
    │                                                              │
    │  Display:                                                    │
    │  • Player count: 25                                         │
    │  • Per player: ₹75                                          │
    │  • Total: ₹1,875                                            │
    └──────────────────────────────┬───────────────────────────────┘
                                   │
                                   │ [Confirm & Pay]
                                   ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  PAYMENT PROCESSING                                          │
    │                                                              │
    │  • Create bulk payment record                               │
    │  • Redirect to HDFC gateway                                 │
    │  • On success:                                              │
    │    - Create all player accounts                             │
    │    - Generate KKDCA IDs                                     │
    │    - Mark membership as paid                                │
    │    - Send credentials via email                            │
    │  • On failure:                                              │
    │    - No records created                                     │
    │    - Retry option available                                 │
    └──────────────────────────────────────────────────────────────┘
```

---

## 7. Deployment Strategy

### 7.1 Domain Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DOMAIN ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    PRODUCTION DOMAINS
    ──────────────────────────────────────────────────────────────────────────

    kallaichess.com          →  Public Website (eventually)
    new.kallaichess.com      →  Public Website (Phase 1)
    register.kallaichess.com →  Admin & Registration Portal
    api.kallaichess.com      →  Backend API
    cdn.kallaichess.com      →  Static Assets / Media Files

    STAGING DOMAINS
    ──────────────────────────────────────────────────────────────────────────

    staging.kallaichess.com          →  Public Website
    staging-register.kallaichess.com →  Admin Portal
    staging-api.kallaichess.com      →  Backend API

    DEVELOPMENT DOMAINS
    ──────────────────────────────────────────────────────────────────────────

    localhost:3000           →  Public Website
    localhost:3001           →  Admin Portal
    localhost:4000           →  Backend API
```

### 7.2 Environment Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ENVIRONMENT STRATEGY                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │   DEVELOPMENT   │ ──► │     STAGING     │ ──► │   PRODUCTION    │
    └─────────────────┘     └─────────────────┘     └─────────────────┘

    Development:
    • Local Docker Compose
    • Hot reload enabled
    • Mock payment gateway
    • Seeded test data
    • Verbose logging

    Staging:
    • Mirror of production
    • HDFC UAT environment
    • Real-like data (anonymized)
    • Full monitoring
    • Automated deployments

    Production:
    • High availability setup
    • HDFC Production
    • Real user data
    • Strict security
    • Blue-green deployment
```

### 7.3 Infrastructure Setup

```yaml
# docker-compose.production.yml

version: '3.8'

services:
  # Backend API
  api:
    image: kdca/api:${VERSION}
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - kdca-network

  # Public Website
  web:
    image: kdca/web:${VERSION}
    deploy:
      replicas: 2
    environment:
      - NEXT_PUBLIC_API_URL=https://api.kallaichess.com
    networks:
      - kdca-network

  # Admin Portal
  admin:
    image: kdca/admin:${VERSION}
    deploy:
      replicas: 2
    environment:
      - NEXT_PUBLIC_API_URL=https://api.kallaichess.com
    networks:
      - kdca-network

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=kdca
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    networks:
      - kdca-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - kdca-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/html:/usr/share/nginx/html
    depends_on:
      - api
      - web
      - admin
    networks:
      - kdca-network

volumes:
  postgres_data:
  redis_data:

networks:
  kdca-network:
    driver: bridge
```

### 7.4 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy KDCA Platform

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Run linting
        run: pnpm lint

  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [api, web, admin]
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t kdca/${{ matrix.app }}:${{ github.sha }} \
            -f apps/${{ matrix.app }}/Dockerfile .

      - name: Push to registry
        run: |
          docker push kdca/${{ matrix.app }}:${{ github.sha }}

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          ssh ${{ secrets.STAGING_SERVER }} << 'EOF'
            cd /opt/kdca
            docker-compose pull
            docker-compose up -d
          EOF

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Blue-Green Deploy
        run: |
          # Deploy to blue/green environment
          # Run health checks
          # Switch traffic
```

### 7.5 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MONITORING STACK                                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │    Prometheus   │     │     Grafana     │     │      Loki       │
    │   (Metrics)     │ ──► │  (Dashboards)   │ ◄── │    (Logs)       │
    └─────────────────┘     └─────────────────┘     └─────────────────┘

    Metrics Collected:
    • Request latency (p50, p95, p99)
    • Request count by endpoint
    • Error rates by type
    • Database query performance
    • Cache hit/miss ratios
    • Payment success rates

    Alerts:
    • High error rate (>1%)
    • Slow response time (>2s p95)
    • Database connection issues
    • Payment gateway failures
    • Disk space warnings
    • Memory usage alerts
```

---

## 8. Migration Strategy

### 8.1 Current State Analysis

Based on the existing system at prs.kallaichess.com:

**Existing Data:**
- ~15 registered players
- 1 Taluk Association (Chinnasalem)
- 0 Academies
- 0 Arbiters
- Unknown number of payment records

**Existing Features:**
- Player/Arbiter registration with KKDCA ID generation
- HDFC payment integration (UAT)
- Admin dashboard with basic management
- Organization management
- Office bearer management

### 8.2 Migration Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIGRATION TIMELINE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    PHASE 1: Foundation (Week 1-4)
    ──────────────────────────────────────────────────────────────────────────
    • Set up new infrastructure
    • Implement core backend modules
    • Create new database schema
    • Build admin content management
    • Develop public website skeleton

    PHASE 2: Data Migration (Week 5-6)
    ──────────────────────────────────────────────────────────────────────────
    • Export data from existing system
    • Transform data to new schema
    • Import users, organizations, payments
    • Verify data integrity
    • Test payment reconciliation

    PHASE 3: Feature Parity (Week 7-10)
    ──────────────────────────────────────────────────────────────────────────
    • Complete player registration flow
    • Implement organization portal
    • Build tournament management
    • Set up payment processing (production)
    • Admin dashboard completion

    PHASE 4: Public Website (Week 11-14)
    ──────────────────────────────────────────────────────────────────────────
    • Dynamic home page
    • About pages
    • Office bearers display
    • Tournament listings
    • News/media sections
    • Contact and resources

    PHASE 5: Testing & Launch (Week 15-16)
    ──────────────────────────────────────────────────────────────────────────
    • End-to-end testing
    • Performance optimization
    • Security audit
    • User acceptance testing
    • DNS cutover
    • Launch monitoring
```

### 8.3 Data Migration Script Outline

```typescript
// migration/migrate-users.ts

import { PrismaClient as OldPrisma } from './old-schema';
import { PrismaClient as NewPrisma } from './new-schema';

async function migrateUsers() {
  const oldDb = new OldPrisma();
  const newDb = new NewPrisma();

  // Fetch all users from old system
  const oldUsers = await oldDb.players_arbiters.findMany();

  for (const oldUser of oldUsers) {
    // Transform data to new schema
    const newUser = {
      id: oldUser.playerArbiterId,
      kkdcaId: oldUser.kkdcaId,
      type: oldUser.type.toUpperCase(),
      firstName: oldUser.firstName,
      lastName: oldUser.lastName,
      email: oldUser.email,
      phone: oldUser.phone,
      passwordHash: oldUser.password, // Same bcrypt hash
      dateOfBirth: oldUser.dateOfBirth,
      gender: oldUser.gender.toUpperCase(),
      taluk: mapTaluk(oldUser.taluk),
      address: oldUser.address,
      pincode: oldUser.pincode,
      parentName: oldUser.parentName,
      relationship: mapRelationship(oldUser.relationShip),
      fideId: oldUser.fideId,
      aicfId: oldUser.aicfId,
      tnscaId: oldUser.tnscaId,
      arbiterTitle: oldUser.arbiterTitle?.toUpperCase(),
      photoUrl: oldUser.photo,
      membershipPaid: oldUser.membershipPaid,
      membershipValidTill: oldUser.membershipValidTill,
      createdAt: oldUser.createdAt,
      updatedAt: oldUser.updatedAt,
    };

    // Insert into new database
    await newDb.users.create({ data: newUser });

    console.log(`Migrated user: ${newUser.kkdcaId}`);
  }

  console.log(`Total users migrated: ${oldUsers.length}`);
}

// Helper functions
function mapTaluk(oldTaluk: string): string {
  const talukMap = {
    'Chinnasalem': 'CHINNASALEM',
    'Kallakurichi': 'KALLAKURICHI',
    'Kalvarayan Hills': 'KALVARAYAN_HILLS',
    'Sankarapuram': 'SANKARAPURAM',
    'Thirukoilur': 'THIRUKOILUR',
    'Ulundurpet': 'ULUNDURPET',
    'Vanapuram': 'VANAPURAM',
  };
  return talukMap[oldTaluk] || 'KALLAKURICHI';
}
```

### 8.4 Rollback Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROLLBACK STRATEGY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    IMMEDIATE ROLLBACK (< 24 hours post-launch)
    ──────────────────────────────────────────────────────────────────────────
    • DNS switch back to old system
    • Old system remains fully operational during transition
    • No data loss as changes sync back

    PARTIAL ROLLBACK (> 24 hours)
    ──────────────────────────────────────────────────────────────────────────
    • Export new registrations from new system
    • Import into old system
    • DNS switch back
    • Manual reconciliation for payments

    NO ROLLBACK POSSIBLE (After old system decommission)
    ──────────────────────────────────────────────────────────────────────────
    • Only after 30 days of stable operation
    • Old system archived but not accessible
    • Full support commitment to new system
```

### 8.5 Content Migration

All content from the docs/content_sources folder needs to be imported into the new CMS:

| Content Type | Source | Migration Method |
|--------------|--------|------------------|
| District Office Bearers | KKDCA_District_Office_Bearers.docx | Admin panel entry |
| Taluk Associations | Taluk Associations/*.docx | Admin panel entry |
| Academies | Academy/*.docx | Admin panel entry |
| Office Bearer Photos | Various folders | Upload via admin |
| Logo & Branding | Images/KKDCA_LOGO.jpg | Upload via admin |
| Downloadable Forms | Download/*.pdf | Upload via admin |
| History Content | History of KKDCA.docx | CMS page entry |
| Resources | Resource.docx | CMS page entry |

---

## 9. Recommendations & Future Enhancements

### 9.1 Phase 1 Priorities (Must Have)

1. **Core Registration System** - Player and arbiter registration with KKDCA ID generation
2. **Payment Integration** - HDFC production setup with proper receipt generation
3. **Admin Dashboard** - Full management capabilities for users, organizations, content
4. **Public Website** - Dynamic homepage, about, office bearers, tournaments
5. **Organization Portal** - Taluk and Academy self-management

### 9.2 Phase 2 Enhancements (Should Have)

1. **Email Notifications** - Registration confirmations, membership reminders
2. **Bulk Import** - Excel-based bulk player registration
3. **Tournament Module** - Complete tournament lifecycle management
4. **Reports** - PDF generation for ID cards, certificates, reports
5. **Search Optimization** - Advanced player search with filters

### 9.3 Phase 3 Future-Ready (Nice to Have)

1. **Mobile App** - React Native companion app
2. **SMS Integration** - OTP verification, tournament alerts
3. **Rating System** - Internal rating tracking
4. **Multi-language** - Tamil language support
5. **Analytics Dashboard** - Advanced reporting with visualizations
6. **API for Third Parties** - Public API for chess apps integration
7. **Live Tournament Updates** - Real-time score boards
8. **Automated Certificate Generation** - Post-tournament certificates

### 9.4 Security Recommendations

1. **Implement WAF** - Web Application Firewall for DDoS protection
2. **Regular Security Audits** - Quarterly penetration testing
3. **Data Encryption** - Encrypt sensitive data at rest
4. **Backup Strategy** - Daily automated backups with 30-day retention
5. **Access Logging** - Comprehensive audit trails for all admin actions
6. **Two-Factor Authentication** - For admin and organization accounts

### 9.5 Performance Targets

| Metric | Target |
|--------|--------|
| Page Load Time (FCP) | < 1.5s |
| Time to Interactive | < 3s |
| API Response Time (p95) | < 200ms |
| Uptime SLA | 99.9% |
| Max Concurrent Users | 1,000 |

---

## 10. Conclusion

This technical architecture provides a comprehensive foundation for building the KDCA platform as an international-standard chess federation system. The design prioritizes:

- **Scalability**: Architecture supports growth from current ~15 players to thousands
- **Maintainability**: Modular design with clear separation of concerns
- **Security**: Industry-standard security practices and RBAC
- **User Experience**: Modern, responsive interfaces for all user types
- **Future-Readiness**: Extensible design that accommodates 2035+ requirements

The single backend serving both public website and admin portal ensures data consistency while enabling independent frontend evolution. The API-first approach guarantees that all content remains dynamic and manageable without code changes.

---

**Document Version:** 2.0
**Last Updated:** January 26, 2026
**Prepared By:** System Architecture Team
