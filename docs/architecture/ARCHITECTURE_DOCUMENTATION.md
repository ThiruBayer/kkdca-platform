# KKDCA - Kallakurichi District Chess Association
## Complete Architecture Documentation

**Version:** 1.0
**Last Updated:** January 2026
**Live URL:** https://prs.kallaichess.com

---

## Table of Contents

1. [Project Purpose](#1-project-purpose)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Application Flows](#5-application-flows)
6. [API Endpoints](#6-api-endpoints)
7. [Critical Files Reference](#7-critical-files-reference)
8. [Environment Variables](#8-environment-variables)
9. [Deployment Information](#9-deployment-information)
10. [Current Status & Known Issues](#10-current-status--known-issues)

---

## 1. Project Purpose

### What does this project do?

KKDCA (Kallakurichi District Chess Association) is a **Player Registration System (PRS)** - a comprehensive web application for managing chess players, arbiters, tournaments, and organizations within Kallakurichi District, Tamil Nadu, India.

### Core Features

| Feature | Description |
|---------|-------------|
| **Player Registration** | Online registration with KKDCA ID generation |
| **Arbiter Registration** | Separate registration flow with title verification |
| **Membership Payment** | HDFC SmartGateway integration for annual fees |
| **Tournament Management** | Create, manage, and track chess tournaments |
| **Organization Management** | Taluk Associations and Chess Academies |
| **Admin Dashboard** | Complete administrative control panel |

### End Users

| User Type | Role | Access Level |
|-----------|------|--------------|
| **Player** | Chess players from Kallakurichi district | Register, pay membership, view profile, register for tournaments |
| **Arbiter** | Chess arbiters with official titles (IA/FA/NA/SA) | Register, pay membership, get approved by admin |
| **Admin** | KKDCA administrators | Full system control - approvals, management, reports |
| **Super Admin** | System owner | All admin privileges + settings management |
| **Organization** | Taluk Associations / Academies | Manage office bearers, submit tournament bids |

### KKDCA ID System

Unique identification format: `{SEQ}{TALUK_CODE}{YEAR}`

**Examples:**
- `01KKI2026` - First player from Kallakurichi in 2026
- `05CSM2026` - Fifth player from Chinnasalem in 2026

**Taluk Codes:**
| Taluk | Code |
|-------|------|
| Chinnasalem | CSM |
| Kallakurichi | KKI |
| Kalvarayan Hills | KVH |
| Sankarapuram | SKP |
| Thirukoilur | TKR |
| Ulundurpet | ULP |
| Vanapuram | VNP |

---

## 2. Technology Stack

Decide by claude
---

## 3. Project Structure

```
KKDCA/
├── docker-compose.yml          # Multi-container Docker setup
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── PROJECT_STATUS.md           # Project status tracking
│
├── deployment/
│   ├── deploy.sh               # Automated deployment script
│   ├── ecosystem.config.js     # PM2 configuration
│   └── nginx/                  # Nginx configuration files
│
├── Backend - Github/           # NestJS Backend Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   ├── Dockerfile
│   │
│   └── src/
│       ├── main.ts             # Application entry point
│       ├── app.module.ts       # Root module
│       ├── constant.ts         # Enums, constants, taluk codes
│       │
│       ├── config/
│       │   ├── database.config.ts   # TypeORM configuration
│       │   └── datasoure.ts         # DataSource for migrations
│       │
│       ├── entity/             # Database Models (8 tables)
│       │   ├── index.ts
│       │   ├── date.entity.ts           # Base entity
│       │   ├── players-arbiter.entity.ts
│       │   ├── admin.entity.ts
│       │   ├── organization.entity.ts
│       │   ├── office-bearer.entity.ts
│       │   ├── tournament.entity.ts
│       │   ├── tournament-registration.entity.ts
│       │   ├── tournament-bid.entity.ts
│       │   └── payment.entity.ts
│       │
│       ├── auth/               # Authentication Module
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.dto.ts
│       │   ├── jwt.strategy.ts
│       │   ├── jwt-auth.guard.ts
│       │   └── public.decorator.ts
│       │
│       ├── payment/            # Payment Module
│       │   ├── payment.module.ts
│       │   ├── payment.service.ts
│       │   ├── payment.controller.ts
│       │   └── hdfc.service.ts
│       │
│       ├── admin/              # Admin Module
│       │   ├── admin.module.ts
│       │   ├── admin.service.ts
│       │   ├── admin.controller.ts
│       │   ├── admin.guard.ts
│       │   └── dto/
│       │
│       ├── organization/       # Organization Module
│       │   ├── organization.module.ts
│       │   ├── organization.service.ts
│       │   ├── organization.controller.ts
│       │   ├── organization.guard.ts
│       │   └── dto/
│       │
│       └── storage/            # File Storage Module
│           ├── local-storage.module.ts
│           └── local-storage.service.ts
│
└── frontend/                   # React Frontend Application
    ├── package.json
    ├── .env.example
    ├── Dockerfile
    ├── public/
    │
    └── src/
        ├── App.js              # Main app with routes
        ├── index.js            # Entry point
        │
        ├── services/
        │   └── api.js          # Axios API client
        │
        ├── components/
        │   ├── Layout/
        │   ├── AdminLayout.js
        │   ├── OrganizationLayout.js
        │   ├── header.js
        │   ├── footer.js
        │   └── side-nav/
        │
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── RegisterArbiter.js
        │   ├── Profile.js
        │   ├── SearchPlayers.js
        │   ├── Arbiters.js
        │   ├── Tournament.js
        │   ├── PaymentSuccess.js
        │   ├── PaymentFailed.js
        │   │
        │   ├── admin/          # Admin Panel Pages
        │   │   ├── AdminLogin.js
        │   │   ├── AdminDashboard.js
        │   │   ├── AdminPlayers.js
        │   │   ├── AdminArbiters.js
        │   │   ├── AdminOrganizations.js
        │   │   ├── AdminTournaments.js
        │   │   ├── AdminPayments.js
        │   │   ├── AdminApprovals.js
        │   │   └── AdminSettings.js
        │   │
        │   └── organization/   # Organization Panel Pages
        │       ├── OrgLogin.js
        │       ├── OrgDashboard.js
        │       ├── OrgProfile.js
        │       ├── OrgOfficeBearers.js
        │       ├── OrgArbiters.js
        │       ├── OrgPlayers.js
        │       └── OrgTournamentBids.js
        │
        └── assets/
            ├── styles/         # SCSS stylesheets
            └── Images/         # Logo and images
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│   players_arbiters  │       │       admins        │
├─────────────────────┤       ├─────────────────────┤
│ playerArbiterId (PK)│       │ adminId (PK)        │
│ kkdcaId (unique)    │       │ username            │
│ type (player/arbiter│       │ password            │
│ firstName, lastName │       │ name                │
│ email, phone        │       │ role                │
│ dateOfBirth, gender │       └─────────────────────┘
│ taluk, address      │
│ fideId, aicfId      │       ┌─────────────────────┐
│ tnscaId             │       │    organizations    │
│ arbiterTitle        │       ├─────────────────────┤
│ photo, aadhaar      │       │ organizationId (PK) │
│ membershipPaid      │       │ username, password  │
│ membershipValidTill │       │ name, type          │
│ password            │       │ contactPerson       │
└─────────────────────┘       │ email, phone        │
         │                    │ address, taluk      │
         │                    │ status              │
         ▼                    │ membershipValidTill │
┌─────────────────────┐       └─────────────────────┘
│      payments       │                │
├─────────────────────┤                │
│ paymentId (PK)      │                ▼
│ orderId             │       ┌─────────────────────┐
│ hdfcOrderId         │       │   office_bearers    │
│ transactionId       │       ├─────────────────────┤
│ playerArbiterId (FK)│       │ bearerId (PK)       │
│ amount, currency    │       │ organizationId (FK) │
│ paymentType         │       │ role                │
│ status              │       │ name, phone, email  │
│ paymentMethod       │       │ photo               │
│ paidAt              │       │ displayOrder        │
└─────────────────────┘       └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│     tournaments     │       │  tournament_bids    │
├─────────────────────┤       ├─────────────────────┤
│ tournamentId (PK)   │       │ bidId (PK)          │
│ name                │       │ organizationId (FK) │
│ venue               │       │ level               │
│ startDate, endDate  │       │ eventName           │
│ registrationDeadline│       │ venue               │
│ entryFee            │       │ timeControl         │
│ status              │       │ categories          │
│ organizedById (FK)  │       │ prizeDistribution   │
│ approvalStatus      │       │ chiefArbiterName    │
│ tournamentFeePaid   │       │ paymentProof        │
│ reportFile          │       │ status              │
│ resultsFile         │       │ kkdcaFeePercentage  │
│ banner              │       └─────────────────────┘
└─────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  tournament_registrations   │
├─────────────────────────────┤
│ registrationId (PK)         │
│ tournamentId (FK)           │
│ playerId (FK)               │
│ category                    │
│ feePaid                     │
│ boardNumber                 │
│ score, rank                 │
│ status                      │
└─────────────────────────────┘
```

### 4.2 Table Details

#### `players_arbiters` - Users Table
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| playerArbiterId | UUID | Yes (PK) | Primary key |
| kkdcaId | VARCHAR | Yes | Unique KKDCA ID (e.g., 01KKI2026) |
| type | ENUM | Yes | 'player' or 'arbiter' |
| firstName | VARCHAR | Yes | First name |
| lastName | VARCHAR | Yes | Last name |
| email | VARCHAR | Yes | Email (unique) |
| phone | VARCHAR | Yes | Phone number |
| password | VARCHAR | Yes | Hashed password |
| dateOfBirth | DATE | Yes | Date of birth |
| gender | ENUM | Yes | 'male', 'female', 'other' |
| taluk | VARCHAR | Yes | Taluk name |
| address | TEXT | Yes | Full address |
| pincode | VARCHAR | Yes | 6-digit pincode |
| parentName | VARCHAR | Yes | Parent/Guardian name |
| relationShip | VARCHAR | Yes | Relationship to parent |
| motherTongue | VARCHAR | No | Mother tongue |
| fideId | VARCHAR | No | FIDE ID |
| aicfId | VARCHAR | No | AICF ID |
| tnscaId | VARCHAR | No | TNSCA ID |
| arbiterTitle | ENUM | No | IA/FA/SNA/NA/SA (for arbiters) |
| photo | TEXT | No | Photo file path |
| birthCertificate | TEXT | No | Birth certificate path |
| aadhaar | TEXT | No | Aadhaar document path |
| membershipPaid | BOOLEAN | Yes | Payment status |
| membershipValidTill | DATE | No | Membership expiry |
| createdAt | TIMESTAMP | Yes | Record creation time |
| updatedAt | TIMESTAMP | Yes | Last update time |

#### `admins` - Admin Users
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| adminId | UUID | Yes (PK) | Primary key |
| username | VARCHAR | Yes | Login username |
| password | VARCHAR | Yes | Hashed password |
| name | VARCHAR | Yes | Display name |
| email | VARCHAR | No | Admin email |
| role | ENUM | Yes | 'super_admin' or 'admin' |

#### `organizations` - Taluk Associations & Academies
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| organizationId | UUID | Yes (PK) | Primary key |
| username | VARCHAR | Yes | Login username |
| password | VARCHAR | Yes | Hashed password |
| name | VARCHAR | Yes | Organization name |
| type | ENUM | Yes | 'taluk_association' or 'academy' |
| contactPerson | VARCHAR | Yes | Contact person name |
| email | VARCHAR | Yes | Email address |
| phone | VARCHAR | Yes | Phone number |
| address | TEXT | Yes | Full address |
| taluk | VARCHAR | Yes | Taluk name |
| status | ENUM | Yes | 'pending', 'approved', 'rejected' |
| membershipValidTill | DATE | No | Membership expiry |
| logo | TEXT | No | Logo file path |
| certificate | TEXT | No | Registration certificate |

#### `office_bearers` - Organization Office Holders
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| bearerId | UUID | Yes (PK) | Primary key |
| organizationId | UUID | Yes (FK) | Organization reference |
| role | ENUM | Yes | president/secretary/treasurer/etc |
| name | VARCHAR | Yes | Bearer name |
| phone | VARCHAR | Yes | Phone number |
| email | VARCHAR | No | Email address |
| photo | TEXT | No | Photo file path |
| displayOrder | INT | Yes | Display order (default: 0) |
| isActive | BOOLEAN | Yes | Active status |

#### `payments` - Payment Transactions
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| paymentId | UUID | Yes (PK) | Primary key |
| orderId | VARCHAR | Yes | Internal order ID |
| hdfcOrderId | VARCHAR | No | HDFC order reference |
| transactionId | VARCHAR | No | HDFC transaction ID |
| playerArbiterId | UUID | No (FK) | User reference |
| amount | DECIMAL | Yes | Payment amount |
| currency | VARCHAR | Yes | Currency (INR) |
| paymentType | ENUM | Yes | 'MEMBERSHIP' or 'TOURNAMENT' |
| status | ENUM | Yes | 'pending', 'success', 'failed', 'cancelled' |
| customerEmail | VARCHAR | Yes | Customer email |
| customerPhone | VARCHAR | Yes | Customer phone |
| paymentMethod | VARCHAR | No | Payment method used |
| paidAt | TIMESTAMP | No | Payment timestamp |

#### `tournaments` - Tournament Events
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| tournamentId | UUID | Yes (PK) | Primary key |
| name | VARCHAR | Yes | Tournament name |
| venue | VARCHAR | Yes | Venue address |
| startDate | DATE | Yes | Start date |
| endDate | DATE | Yes | End date |
| registrationDeadline | DATE | Yes | Registration deadline |
| entryFee | DECIMAL | No | Entry fee amount |
| status | ENUM | Yes | draft/open/closed/ongoing/completed/cancelled |
| organizedById | UUID | No (FK) | Organizing entity |
| approvalStatus | ENUM | Yes | pending/approved/rejected |
| tournamentFeePaid | BOOLEAN | Yes | Fee payment status |
| reportFile | TEXT | No | Tournament report |
| resultsFile | TEXT | No | Results file |
| banner | TEXT | No | Banner image |

#### `tournament_registrations` - Player Tournament Entries
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| registrationId | UUID | Yes (PK) | Primary key |
| tournamentId | UUID | Yes (FK) | Tournament reference |
| playerId | UUID | Yes (FK) | Player reference |
| category | VARCHAR | No | Age/rating category |
| feePaid | BOOLEAN | Yes | Fee payment status |
| boardNumber | INT | No | Assigned board number |
| score | DECIMAL | No | Final score |
| rank | INT | No | Final rank |
| status | VARCHAR | Yes | Registration status |

#### `tournament_bids` - Tournament Hosting Applications
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| bidId | UUID | Yes (PK) | Primary key |
| organizationId | UUID | Yes (FK) | Bidding organization |
| level | ENUM | Yes | 'district', 'state', 'fide' |
| eventName | VARCHAR | Yes | Proposed event name |
| venue | VARCHAR | Yes | Proposed venue |
| timeControl | VARCHAR | Yes | Time control format |
| categories | TEXT | Yes | Event categories |
| prizeDistribution | TEXT | No | Prize structure |
| chiefArbiterName | VARCHAR | Yes | Chief arbiter name |
| paymentProof | TEXT | No | Payment proof document |
| status | ENUM | Yes | pending/approved/rejected |
| kkdcaFeePercentage | DECIMAL | No | KKDCA fee percentage |

---

## 5. Application Flows

### 5.1 Registration Flow (Player)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLAYER REGISTRATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

User visits /register
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Personal Information                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Required Fields:                                                │
│  • firstName (string)                                            │
│  • lastName (string)                                             │
│  • email (unique, valid email)                                   │
│  • phone (10 digits, starts with 6-9)                           │
│  • gender (Male/Female/Other)                                    │
│  • dateOfBirth (date)                                           │
│                                                                  │
│  Optional Fields:                                                │
│  • motherTongue                                                  │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Contact & Address                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Required Fields:                                                │
│  • parentName (parent/guardian name)                            │
│  • relationShip (Father/Mother/Guardian/Spouse/Self)            │
│  • address (full address)                                        │
│  • taluk (dropdown - 7 taluks)                                  │
│  • pincode (6 digits)                                           │
│                                                                  │
│  Auto-filled:                                                    │
│  • state = "Tamil Nadu"                                         │
│  • city = "Kallakurichi"                                        │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Documents (ALL OPTIONAL)                                │
│  ─────────────────────────────────────────────────────────────  │
│  Optional Uploads:                                               │
│  • photo (JPG/PNG, max 3MB)                                     │
│  • birthCertificate (JPG/PNG/PDF, max 3MB)                      │
│  • aadhaar (JPG/PNG/PDF, max 3MB)                               │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Chess IDs & Password                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Optional Fields:                                                │
│  • fideId                                                        │
│  • aicfId                                                        │
│  • tnscaId                                                       │
│                                                                  │
│  Required Fields:                                                │
│  • password (min 8 chars, uppercase+lowercase+number)           │
│  • confirmPassword                                               │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
    [Submit Form]
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: POST /auth/register                                    │
│  ─────────────────────────────────────────────────────────────  │
│  1. Validate all required fields                                 │
│  2. Check email doesn't already exist                           │
│  3. Hash password with bcrypt                                    │
│  4. Generate KKDCA ID based on taluk + year                     │
│  5. Upload documents to storage (if provided)                   │
│  6. Create user record with membershipPaid = false              │
│  7. Return user data                                             │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  PAYMENT INITIATION                                              │
│  ─────────────────────────────────────────────────────────────  │
│  POST /payment/initiate                                          │
│  {                                                               │
│    playerArbiterId: "uuid",                                      │
│    customerEmail: "email",                                       │
│    customerPhone: "phone",                                       │
│    customerName: "First Last"                                    │
│  }                                                               │
│                                                                  │
│  Amount: ₹75 (Player) / ₹250 (Arbiter)                          │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
    [Redirect to HDFC Payment Gateway]
        │
        ├─── SUCCESS ─────────────────────────────────────────────┐
        │                                                          │
        │    1. HDFC redirects to /payment/success                │
        │    2. Backend receives webhook/return callback          │
        │    3. Verify signature                                   │
        │    4. Update payment status = 'success'                 │
        │    5. Update user membershipPaid = true                 │
        │    6. Set membershipValidTill = Dec 31, current year    │
        │    7. Show success page with KKDCA ID                   │
        │                                                          │
        ├─── FAILURE ─────────────────────────────────────────────┤
        │                                                          │
        │    1. HDFC redirects to /payment/failed                 │
        │    2. Payment status = 'failed'                         │
        │    3. User can retry from profile page                  │
        │                                                          │
        └─────────────────────────────────────────────────────────┘
```

### 5.2 Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────────┘

User visits /login
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOGIN FORM                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  • email (required)                                              │
│  • password (required)                                           │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
    POST /auth/login
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND VALIDATION                                              │
│  ─────────────────────────────────────────────────────────────  │
│  1. Find user by email in players_arbiters table                │
│  2. Compare password with bcrypt                                 │
│  3. If valid:                                                    │
│     - Generate JWT token with { sub: playerArbiterId, email }   │
│     - Return { access_token, user }                             │
│  4. If invalid:                                                  │
│     - Return 401 Unauthorized                                    │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND TOKEN STORAGE                                          │
│  ─────────────────────────────────────────────────────────────  │
│  localStorage.setItem('token', access_token)                    │
│  localStorage.setItem('user', JSON.stringify(user))             │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
    Redirect to /profile
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUBSEQUENT API CALLS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Axios interceptor adds:                                         │
│  Authorization: Bearer <token>                                   │
│                                                                  │
│  Backend validates:                                              │
│  1. JwtAuthGuard extracts token from header                     │
│  2. JwtStrategy validates token signature                       │
│  3. Attaches user to request object                             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Payment Flow (CRITICAL)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW (HDFC)                           │
└─────────────────────────────────────────────────────────────────┘

                         WHEN IS PAYMENT TRIGGERED?
┌─────────────────────────────────────────────────────────────────┐
│  1. After successful player registration (₹75)                  │
│  2. After successful arbiter registration (₹250)                │
│  3. From profile page if membership expired                     │
│  4. Tournament registration (if entry fee applies)              │
└─────────────────────────────────────────────────────────────────┘

                         PAYMENT INITIATION
┌─────────────────────────────────────────────────────────────────┐
│  Frontend: POST /payment/initiate                                │
│  {                                                               │
│    playerArbiterId: "uuid",                                      │
│    customerEmail: "user@email.com",                             │
│    customerPhone: "9876543210",                                 │
│    customerName: "John Doe"                                      │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend: PaymentService.initiatePayment()                       │
│  ─────────────────────────────────────────────────────────────  │
│  1. Look up user to determine type (player/arbiter)             │
│  2. Set amount: Player = ₹75, Arbiter = ₹250                    │
│  3. Generate unique orderId                                      │
│  4. Call HdfcService.createPaymentSession()                     │
│  5. Create payment record with status = 'pending'               │
│  6. Return paymentLink to frontend                              │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  HDFC SmartGateway Integration                                   │
│  ─────────────────────────────────────────────────────────────  │
│  HdfcService.createPaymentSession():                            │
│                                                                  │
│  1. Generate request signature (HMAC SHA256)                    │
│  2. POST to HDFC API: /session                                  │
│  3. Payload:                                                     │
│     {                                                            │
│       merchant_id: env.HDFC_MERCHANT_ID,                        │
│       order_id: "KKDCA_1234567890",                             │
│       amount: "75.00",                                           │
│       currency: "INR",                                           │
│       customer_email: "user@email.com",                         │
│       customer_phone: "9876543210",                             │
│       return_url: "https://api.../payment/return",              │
│       webhook_url: "https://api.../payment/webhook"             │
│     }                                                            │
│  4. Receive payment_link from HDFC                              │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
    [User redirected to HDFC Payment Page]
        │
        ├─────────────────────────────────────────────────────────┐
        │                                                          │
   [User completes payment on HDFC]                               │
        │                                                          │
        ▼                                                          │
┌─────────────────────────────────────────────────────────────────┐
│  RETURN URL CALLBACK: POST /payment/return                       │
│  ─────────────────────────────────────────────────────────────  │
│  HDFC redirects user with payment data:                         │
│  {                                                               │
│    order_id: "KKDCA_1234567890",                                │
│    status: "CHARGED" | "FAILED" | "CANCELLED",                  │
│    transaction_id: "TXN123456",                                 │
│    signature: "abc123..."                                        │
│  }                                                               │
│                                                                  │
│  Backend:                                                        │
│  1. Verify signature using HDFC_API_KEY                         │
│  2. If signature invalid → reject                               │
│  3. Update payment record with transaction details              │
└─────────────────────────────────────────────────────────────────┘
        │
        ├─── STATUS: "CHARGED" (SUCCESS) ─────────────────────────┐
        │                                                          │
        │    1. payment.status = 'success'                        │
        │    2. payment.transactionId = txn_id                    │
        │    3. payment.paidAt = now()                            │
        │    4. user.membershipPaid = true                        │
        │    5. user.membershipValidTill = Dec 31, year           │
        │    6. Redirect to /payment/success?orderId=xxx          │
        │                                                          │
        ├─── STATUS: "FAILED" ────────────────────────────────────┤
        │                                                          │
        │    1. payment.status = 'failed'                         │
        │    2. Redirect to /payment/failed?orderId=xxx           │
        │                                                          │
        ├─── STATUS: "CANCELLED" ─────────────────────────────────┤
        │                                                          │
        │    1. payment.status = 'cancelled'                      │
        │    2. Redirect to /payment/failed?orderId=xxx           │
        │                                                          │
        └─────────────────────────────────────────────────────────┘

                         WEBHOOK HANDLING
┌─────────────────────────────────────────────────────────────────┐
│  POST /payment/webhook (Async notification from HDFC)            │
│  ─────────────────────────────────────────────────────────────  │
│  HDFC sends webhook for payment status updates:                 │
│                                                                  │
│  1. Verify webhook signature                                     │
│  2. Find payment by order_id                                    │
│  3. Update payment status                                        │
│  4. If success & not already processed:                         │
│     - Update user membership                                     │
│  5. Return 200 OK to HDFC                                       │
│                                                                  │
│  Note: Webhook provides backup in case return URL fails         │
└─────────────────────────────────────────────────────────────────┘

                         MEMBERSHIP FEES
┌─────────────────────────────────────────────────────────────────┐
│  User Type    │ Annual Fee │ Validity                           │
│  ─────────────┼────────────┼─────────────────────────────────── │
│  Player       │ ₹75        │ Jan 1 - Dec 31 of current year     │
│  Arbiter      │ ₹250       │ Jan 1 - Dec 31 of current year     │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Admin Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN FLOW                                │
└─────────────────────────────────────────────────────────────────┘

Admin visits /admin/login
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN LOGIN                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  POST /admin/login                                               │
│  { username, password }                                          │
│                                                                  │
│  Response:                                                       │
│  { adminToken, admin: { adminId, name, role } }                 │
│                                                                  │
│  Storage:                                                        │
│  localStorage.setItem('adminToken', token)                      │
│  localStorage.setItem('admin', JSON.stringify(admin))           │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN CAPABILITIES                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Dashboard (/admin/dashboard)                                    │
│  • View statistics: total players, arbiters, revenue            │
│  • Recent registrations                                          │
│  • Pending approvals count                                       │
│                                                                  │
│  Player Management (/admin/players)                              │
│  • View all registered players                                   │
│  • Search, filter, export                                        │
│  • Edit player details                                           │
│  • View payment history                                          │
│                                                                  │
│  Arbiter Management (/admin/arbiters)                            │
│  • View all arbiters                                             │
│  • Approve/Reject arbiter registrations                         │
│  • Verify arbiter titles (IA/FA/NA/SA)                          │
│  • Update arbiter information                                    │
│                                                                  │
│  Organization Management (/admin/taluk-associations)             │
│  • View Taluk Associations                                       │
│  • Approve/Reject organization registrations                    │
│  • View office bearers                                           │
│                                                                  │
│  Academy Management (/admin/academies)                           │
│  • View Chess Academies                                          │
│  • Approve/Reject registrations                                  │
│                                                                  │
│  Tournament Management (/admin/tournaments)                      │
│  • View all tournaments                                          │
│  • Approve/Reject tournament proposals                          │
│  • Edit tournament details                                       │
│  • View registrations                                            │
│                                                                  │
│  Payment Reports (/admin/payments)                               │
│  • View all transactions                                         │
│  • Filter by date, status, type                                 │
│  • Export reports                                                │
│                                                                  │
│  Approvals Queue (/admin/approvals)                              │
│  • Pending arbiter approvals                                     │
│  • Pending organization approvals                                │
│  • Pending tournament approvals                                  │
│                                                                  │
│  Settings (/admin/settings) - Super Admin only                   │
│  • System configuration                                          │
│  • Create new admin accounts                                     │
└─────────────────────────────────────────────────────────────────┘

                      APPROVAL WORKFLOW
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ARBITER APPROVAL:                                               │
│  1. Arbiter registers → status: pending                         │
│  2. Admin reviews documents, verifies title                     │
│  3. Admin approves → arbiter can login                          │
│     OR rejects → arbiter notified                               │
│                                                                  │
│  ORGANIZATION APPROVAL:                                          │
│  1. Org registers → status: PENDING                             │
│  2. Admin reviews certificate, details                          │
│  3. Admin approves → status: APPROVED                           │
│     OR rejects → status: REJECTED                               │
│                                                                  │
│  TOURNAMENT APPROVAL:                                            │
│  1. Org submits tournament → approvalStatus: pending            │
│  2. Admin reviews details, venue, dates                         │
│  3. Admin approves → status: OPEN (visible to players)          │
│     OR rejects → org notified                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Organization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORGANIZATION FLOW                             │
└─────────────────────────────────────────────────────────────────┘

Organization visits /org/login
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORGANIZATION LOGIN                                              │
│  ─────────────────────────────────────────────────────────────  │
│  POST /organization/login                                        │
│  { username, password }                                          │
│                                                                  │
│  Response:                                                       │
│  { orgToken, organization }                                      │
│                                                                  │
│  Storage:                                                        │
│  localStorage.setItem('orgToken', token)                        │
│  localStorage.setItem('organization', JSON.stringify(org))      │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORGANIZATION CAPABILITIES                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Dashboard (/org/dashboard)                                      │
│  • Organization overview                                         │
│  • Member statistics                                             │
│  • Recent activities                                             │
│                                                                  │
│  Profile (/org/profile)                                          │
│  • View/Edit organization details                               │
│  • Update logo, contact info                                    │
│  • Upload registration certificate                              │
│                                                                  │
│  Office Bearers (/org/office-bearers)                           │
│  • Add office bearers (President, Secretary, etc.)              │
│  • Edit bearer details                                           │
│  • Upload bearer photos                                          │
│  • Set display order                                             │
│  • Deactivate/Remove bearers                                    │
│                                                                  │
│  Affiliated Players (/org/players)                               │
│  • View players from same taluk                                 │
│                                                                  │
│  Affiliated Arbiters (/org/arbiters)                             │
│  • View arbiters from same taluk                                │
│                                                                  │
│  Tournament Bids (/org/tournament-bids)                          │
│  • Submit new tournament hosting bid                            │
│  • Required: level, eventName, venue, timeControl               │
│  • Required: categories, chiefArbiterName                       │
│  • Optional: prizeDistribution                                   │
│  • Upload payment proof                                          │
│  • View bid status (pending/approved/rejected)                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. API Endpoints

### 6.1 Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Register new player/arbiter |
| `/auth/login` | POST | No | User login |
| `/auth/profile` | GET | JWT | Get current user profile |
| `/auth/profile` | PUT | JWT | Update user profile |
| `/auth/search` | GET | No | Search players (public) |
| `/auth/arbiters` | GET | No | List arbiters (public) |
| `/auth/players/:id` | GET | No | Get player by ID (public) |

### 6.2 Payment Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/payment/initiate` | POST | No | Initiate membership payment |
| `/payment/return` | POST | No | HDFC return URL callback |
| `/payment/webhook` | POST | No | HDFC webhook notification |
| `/payment/status/:orderId` | GET | JWT | Check payment status |

### 6.3 Admin Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/admin/login` | POST | No | Admin login |
| `/admin/dashboard` | GET | Admin | Dashboard statistics |
| `/admin/players` | GET | Admin | List all players |
| `/admin/players/:id` | GET | Admin | Get player details |
| `/admin/players/:id` | PUT | Admin | Update player |
| `/admin/arbiters` | GET | Admin | List all arbiters |
| `/admin/arbiters/:id/approve` | PUT | Admin | Approve arbiter |
| `/admin/arbiters/:id/reject` | PUT | Admin | Reject arbiter |
| `/admin/organizations` | GET | Admin | List organizations |
| `/admin/organizations/:id/approve` | PUT | Admin | Approve organization |
| `/admin/organizations/:id/reject` | PUT | Admin | Reject organization |
| `/admin/tournaments` | GET | Admin | List tournaments |
| `/admin/tournaments/:id` | PUT | Admin | Update tournament |
| `/admin/tournaments/:id/approve` | PUT | Admin | Approve tournament |
| `/admin/payments` | GET | Admin | List all payments |
| `/admin/settings` | GET | Admin | Get system settings |
| `/admin/settings` | PUT | Admin | Update settings |

### 6.4 Organization Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/organization/login` | POST | No | Organization login |
| `/organization/dashboard` | GET | Org | Dashboard data |
| `/organization/profile` | GET | Org | Get organization profile |
| `/organization/profile` | PUT | Org | Update profile |
| `/organization/office-bearers` | GET | Org | List office bearers |
| `/organization/office-bearers` | POST | Org | Add office bearer |
| `/organization/office-bearers/:id` | PUT | Org | Update bearer |
| `/organization/office-bearers/:id` | DELETE | Org | Remove bearer |
| `/organization/players` | GET | Org | List affiliated players |
| `/organization/arbiters` | GET | Org | List affiliated arbiters |
| `/organization/tournament-bids` | GET | Org | List tournament bids |
| `/organization/tournament-bids` | POST | Org | Submit new bid |

### 6.5 File Upload Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/storage/upload` | POST | JWT | Upload file |
| `/storage/files/:filename` | GET | No | Download file |

---

## 7. Critical Files Reference

### 7.1 Authentication Logic

| Purpose | File Path |
|---------|-----------|
| Auth Module | `Backend - Github/src/auth/auth.module.ts` |
| Auth Service (registration, login, KKDCA ID generation) | `Backend - Github/src/auth/auth.service.ts` |
| Auth Controller (endpoints) | `Backend - Github/src/auth/auth.controller.ts` |
| JWT Strategy | `Backend - Github/src/auth/jwt.strategy.ts` |
| JWT Guard (global) | `Backend - Github/src/auth/jwt-auth.guard.ts` |
| Public Decorator | `Backend - Github/src/auth/public.decorator.ts` |
| Auth DTOs | `Backend - Github/src/auth/auth.dto.ts` |

### 7.2 Payment Handling

| Purpose | File Path |
|---------|-----------|
| Payment Module | `Backend - Github/src/payment/payment.module.ts` |
| Payment Service (business logic) | `Backend - Github/src/payment/payment.service.ts` |
| Payment Controller (endpoints) | `Backend - Github/src/payment/payment.controller.ts` |
| HDFC Integration | `Backend - Github/src/payment/hdfc.service.ts` |
| Payment Entity | `Backend - Github/src/entity/payment.entity.ts` |

### 7.3 Database Models

| Entity | File Path |
|--------|-----------|
| Base Entity | `Backend - Github/src/entity/date.entity.ts` |
| Players/Arbiters | `Backend - Github/src/entity/players-arbiter.entity.ts` |
| Admins | `Backend - Github/src/entity/admin.entity.ts` |
| Organizations | `Backend - Github/src/entity/organization.entity.ts` |
| Office Bearers | `Backend - Github/src/entity/office-bearer.entity.ts` |
| Tournaments | `Backend - Github/src/entity/tournament.entity.ts` |
| Tournament Registrations | `Backend - Github/src/entity/tournament-registration.entity.ts` |
| Tournament Bids | `Backend - Github/src/entity/tournament-bid.entity.ts` |
| Payments | `Backend - Github/src/entity/payment.entity.ts` |
| Entity Index | `Backend - Github/src/entity/index.ts` |

### 7.4 Main Routes/API

| Purpose | File Path |
|---------|-----------|
| App Entry Point | `Backend - Github/src/main.ts` |
| Root Module | `Backend - Github/src/app.module.ts` |
| Constants/Enums | `Backend - Github/src/constant.ts` |
| Database Config | `Backend - Github/src/config/database.config.ts` |
| Frontend Routes | `frontend/src/App.js` |
| Frontend API Client | `frontend/src/services/api.js` |

### 7.5 Admin & Organization

| Purpose | File Path |
|---------|-----------|
| Admin Module | `Backend - Github/src/admin/admin.module.ts` |
| Admin Service | `Backend - Github/src/admin/admin.service.ts` |
| Admin Controller | `Backend - Github/src/admin/admin.controller.ts` |
| Admin Guard | `Backend - Github/src/admin/admin.guard.ts` |
| Organization Module | `Backend - Github/src/organization/organization.module.ts` |
| Organization Service | `Backend - Github/src/organization/organization.service.ts` |
| Organization Controller | `Backend - Github/src/organization/organization.controller.ts` |

### 7.6 Frontend Pages

| Page | File Path |
|------|-----------|
| Home | `frontend/src/pages/Home.js` |
| Login | `frontend/src/pages/Login.js` |
| Player Registration | `frontend/src/pages/Register.js` |
| Arbiter Registration | `frontend/src/pages/RegisterArbiter.js` |
| Profile | `frontend/src/pages/Profile.js` |
| Payment Success | `frontend/src/pages/PaymentSuccess.js` |
| Payment Failed | `frontend/src/pages/PaymentFailed.js` |
| Admin Dashboard | `frontend/src/pages/admin/AdminDashboard.js` |
| Admin Players | `frontend/src/pages/admin/AdminPlayers.js` |

---

## 8. Environment Variables

### 8.1 Backend Environment Variables

decide by claude

---

## 9. Deployment Information

decide by claude
---

## 10. Current Status & Known Issues

### 10.1 What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| Player Registration | Working | 4-step form with payment |
| Arbiter Registration | Working | Requires admin approval |
| User Login | Working | JWT-based |
| Admin Login | Working | Separate auth context |
| Admin Dashboard | Working | Statistics, recent activities |
| Player Management | Working | CRUD operations |
| Arbiter Management | Working | Approval workflow |
| Organization Management | Working | Taluk associations & academies |
| Office Bearers | Working | Full CRUD |
| Payment Integration | Working | HDFC SmartGateway (UAT) |
| File Uploads | Working | Local storage |
| Search Players | Working | Public access |
| Tournament Creation | Working | Draft mode |

### 10.2 Known Issues / Areas for Improvement

| Issue | Priority | Description |
|-------|----------|-------------|
| HDFC Production | High | Currently using UAT environment; needs production credentials |
| Email Notifications | Medium | No email service configured for notifications |
| Password Reset | Medium | No forgot password functionality |
| Tournament Registration | Medium | Player tournament registration flow incomplete |
| Mobile Responsiveness | Low | Some admin pages need mobile optimization |
| Image Optimization | Low | Uploaded images not compressed |
| Pagination | Low | Large lists may need server-side pagination |

### 10.3 Security Considerations

| Area | Status | Notes |
|------|--------|-------|
| Password Hashing | Implemented | bcrypt with salt rounds |
| JWT Tokens | Implemented | HS256 signing |
| CORS | Configured | Restricted to frontend URL |
| Rate Limiting | Configured | Throttle guard |
| Input Validation | Implemented | class-validator |
| SQL Injection | Protected | TypeORM parameterized queries |
| XSS Protection | Partial | React escapes by default |
| HTTPS | Enabled | Let's Encrypt SSL |
| File Upload Validation | Implemented | Type and size checks |

### 10.4 Future Enhancements

1. **Email Service** - SendGrid/AWS SES for notifications
2. **SMS OTP** - Phone verification during registration
3. **Tournament Module** - Complete tournament workflow
4. **Rating System** - Chess rating tracking
5. **Reports** - PDF generation for ID cards, certificates
6. **Mobile App** - React Native companion app
7. **Analytics** - Dashboard analytics with charts
8. **Bulk Import** - Excel import for existing members

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Created Date** | January 2026 |
| **Author** | Architecture Documentation |

|

---

