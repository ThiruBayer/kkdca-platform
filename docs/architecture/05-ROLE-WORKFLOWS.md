# KDCA Platform - Role Workflows & Player Journeys

## Document Version: 1.0 | Date: 2026-01-27

---

## 1. USER JOURNEY MAPS

### 1.1 New Player Registration Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEW PLAYER REGISTRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

    DISCOVERY          REGISTRATION         VERIFICATION        MEMBERSHIP
    ─────────          ────────────         ────────────        ──────────
        │                   │                    │                   │
        ▼                   ▼                    ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│ Lands on     │───►│ Clicks       │───►│ Verifies     │───►│ Pays ₹75    │
│ Homepage     │    │ "Register"   │    │ Email/Phone  │    │ Membership  │
│              │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Fills Form:  │
                    │ - Name       │
                    │ - Email      │
                    │ - Phone      │
                    │ - DOB        │
                    │ - Taluk      │
                    │ - Guardian   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐    ┌──────────────┐
                    │ Submits      │───►│ Account      │
                    │ Registration │    │ Created      │
                    └──────────────┘    │ (PENDING)    │
                                        └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │ Receives     │
                                        │ Verification │
                                        │ Email/SMS    │
                                        └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │ Clicks Link  │
                                        │ to Verify    │
                                        └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐    ┌──────────────┐
                                        │ Status:      │───►│ Redirected   │
                                        │ VERIFIED     │    │ to Payment   │
                                        └──────────────┘    └──────────────┘
                                                                   │
                                                                   ▼
                                                            ┌──────────────┐
                                                            │ HDFC Gateway │
                                                            │ Payment      │
                                                            └──────────────┘
                                                                   │
                                          ┌────────────────────────┼───────────┐
                                          │                        │           │
                                          ▼                        ▼           │
                                   ┌──────────────┐         ┌──────────────┐   │
                                   │ Payment      │         │ Payment      │   │
                                   │ SUCCESS      │         │ FAILED       │───┘
                                   └──────────────┘         └──────────────┘
                                          │                 (Retry option)
                                          ▼
                                   ┌──────────────┐
                                   │ KDCA ID      │
                                   │ Generated:   │
                                   │ 001KKI2026   │
                                   └──────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ Status:      │
                                   │ ACTIVE       │
                                   │              │
                                   │ Welcome      │
                                   │ Email Sent   │
                                   └──────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ Dashboard    │
                                   │ Access       │
                                   │ Granted      │
                                   └──────────────┘
```

### 1.2 Tournament Registration Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOURNAMENT REGISTRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

    BROWSE             SELECT              REGISTER             CONFIRM
    ──────             ──────              ────────             ───────
        │                  │                   │                    │
        ▼                  ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│ Views        │───►│ Selects      │───►│ Clicks       │───►│ Receives     │
│ Tournament   │    │ Tournament   │    │ "Register"   │    │ Confirmation │
│ Listings     │    │ Details      │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                   │
                           ▼                   ▼
                    ┌──────────────┐    ┌──────────────┐
                    │ Checks:      │    │ If Paid      │
                    │ - Dates      │    │ Tournament:  │
                    │ - Categories │    │ Payment      │
                    │ - Venue      │    │ Required     │
                    │ - Fees       │    └──────────────┘
                    └──────────────┘           │
                                              ▼
                                       ┌──────────────┐
                                       │ Select       │
                                       │ Category     │
                                       │ (Age-based)  │
                                       └──────────────┘
                                              │
                                              ▼
                              ┌────────────────┼────────────────┐
                              │                │                │
                              ▼                ▼                ▼
                       ┌──────────┐     ┌──────────┐     ┌──────────┐
                       │ Free     │     │ Paid     │     │ Late     │
                       │ Entry    │     │ Entry    │     │ Fee      │
                       └──────────┘     └──────────┘     │ Applied  │
                              │                │         └──────────┘
                              │                │                │
                              ▼                ▼                ▼
                       ┌──────────────────────────────────────────┐
                       │         Registration Confirmed           │
                       │         Status: CONFIRMED                 │
                       └──────────────────────────────────────────┘
                                              │
                                              ▼
                       ┌──────────────────────────────────────────┐
                       │  Confirmation Email with:                 │
                       │  - Tournament details                     │
                       │  - Entry number                           │
                       │  - Venue map                              │
                       │  - Rules link                             │
                       └──────────────────────────────────────────┘
```

### 1.3 Organization Registration Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ORGANIZATION REGISTRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

    INITIATE           SUBMIT              REVIEW              APPROVED
    ────────           ──────              ──────              ────────
        │                 │                   │                    │
        ▼                 ▼                   ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│              │   │              │   │              │   │              │
│ User selects │──►│ Completes    │──►│ Admin        │──►│ Organization │
│ "Register    │   │ Org Profile  │   │ Reviews      │   │ Activated    │
│ Organization"│   │              │   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                  │                  │                  │
       │                  ▼                  ▼                  ▼
       │           ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
       │           │ Required:    │   │ Status:      │   │ Login        │
       │           │ - Org Name   │   │ PENDING      │   │ Credentials  │
       │           │ - Type       │   │              │   │ Sent         │
       │           │ - Taluk      │   │ Admin        │   └──────────────┘
       │           │ - Contact    │   │ Notification │          │
       │           │ - Address    │   └──────────────┘          ▼
       │           │ - Logo       │          │           ┌──────────────┐
       │           │ - Documents  │          ▼           │ Org Admin    │
       │           └──────────────┘   ┌──────────────┐   │ Dashboard    │
       │                  │           │ Options:     │   │ Access       │
       │                  ▼           │              │   └──────────────┘
       │           ┌──────────────┐   │ ✓ APPROVE    │
       ▼           │ Creates      │   │ ✗ REJECT     │
┌──────────────┐   │ Admin User   │   │   (reason)   │
│ Two Options: │   │ Account      │   │              │
│              │   │ (linked)     │   └──────────────┘
│ 1. New User  │   └──────────────┘          │
│ 2. Existing  │                             │
│    User      │                             ▼
│    (upgrade) │                      ┌──────────────┐
└──────────────┘                      │ If Rejected: │
                                      │ - Reason     │
                                      │   shared     │
                                      │ - Can edit   │
                                      │   & resubmit │
                                      └──────────────┘
```

---

## 2. ROLE-BASED WORKFLOWS

### 2.1 Super Admin Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUPER ADMIN CAPABILITIES                            │
└─────────────────────────────────────────────────────────────────────────────┘

SYSTEM MANAGEMENT
├── Configure System Settings
│   ├── Site name, tagline, contact
│   ├── Membership fees
│   ├── Payment gateway settings
│   └── Email templates
│
├── Manage Admin Accounts
│   ├── Create new admins
│   ├── Assign permissions
│   ├── Suspend/activate admins
│   └── View admin activity logs
│
├── Database Operations
│   ├── View audit logs
│   ├── Export data (CSV, Excel)
│   ├── Backup management
│   └── Data cleanup tasks
│
└── Analytics & Reports
    ├── System-wide statistics
    ├── Revenue reports
    ├── User growth trends
    └── Performance metrics

CONTENT MANAGEMENT
├── All Admin capabilities (see below)
└── Manage homepage content
```

### 2.2 Admin Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN CAPABILITIES                                │
└─────────────────────────────────────────────────────────────────────────────┘

USER MANAGEMENT
├── Player Management
│   ├── View all players
│   ├── Search by name, ID, taluk
│   ├── Edit player profiles
│   ├── Activate/suspend accounts
│   └── Reset passwords
│
├── Arbiter Management
│   ├── View arbiter applications
│   ├── Approve/reject arbiters
│   │   ├── Verify certification
│   │   └── Set arbiter grade
│   └── Manage arbiter listings
│
└── Membership Management
    ├── View payment history
    ├── Manual membership activation
    ├── Generate reports
    └── Process refunds

ORGANIZATION MANAGEMENT
├── Approve/Reject Organizations
│   ├── Review application
│   ├── Verify documents
│   ├── Approve with comments
│   └── Reject with reason
│
├── Manage Organization Profiles
│   ├── Edit organization details
│   ├── Update status
│   └── View activity logs
│
└── Assign Organization Admins

TOURNAMENT MANAGEMENT
├── Approve Tournament Proposals
│   ├── Review tournament details
│   ├── Check conflicts (dates, venues)
│   ├── Approve/reject
│   └── Assign level (Taluk/District)
│
├── Manage All Tournaments
│   ├── Edit tournament details
│   ├── View registrations
│   ├── Cancel tournaments
│   └── Publish results
│
└── Tournament Reports

CONTENT MANAGEMENT
├── News & Announcements
│   ├── Create news articles
│   ├── Manage announcements
│   ├── Schedule publication
│   └── Archive content
│
├── Static Pages
│   ├── Edit About page
│   ├── Manage Contact info
│   └── Update policies
│
└── Media Library
    ├── Upload images
    ├── Manage gallery
    └── Delete files
```

### 2.3 Taluk Association Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TALUK ASSOCIATION CAPABILITIES                          │
└─────────────────────────────────────────────────────────────────────────────┘

PROFILE MANAGEMENT
├── Edit Organization Profile
│   ├── Name, description
│   ├── Contact information
│   ├── Address, location
│   ├── Social media links
│   └── Logo, banner images
│
└── Manage Office Bearers
    ├── Add new office bearers
    │   ├── Name, role, contact
    │   ├── Photo upload
    │   └── Bio/description
    ├── Edit existing bearers
    ├── Remove/deactivate bearers
    └── Set display order

MEMBER MANAGEMENT
├── View Association Members
│   ├── List players from taluk
│   ├── Filter by status
│   └── Search functionality
│
├── Bulk Player Registration
│   ├── Download CSV template
│   ├── Fill player details
│   ├── Upload CSV file
│   ├── Review import preview
│   ├── Confirm registration
│   └── View import results
│
└── Individual Player Registration
    ├── Register single player
    └── Assign to association

TOURNAMENT MANAGEMENT
├── Create Tournament Proposal
│   ├── Tournament name
│   ├── Level (Taluk only - District requires Admin)
│   ├── Categories
│   ├── Dates (registration, event)
│   ├── Venue details
│   ├── Entry fees
│   ├── Prizes
│   └── Rules & regulations
│
├── Submit for Approval
│   └── Sends to Admin for review
│
├── Manage Own Tournaments
│   ├── Edit (before approval)
│   ├── View registrations
│   ├── Export participant list
│   ├── Enter results
│   └── Publish results
│
└── Tournament Reports
    └── View participation stats

DASHBOARD
├── Association Stats
│   ├── Total members
│   ├── New registrations
│   └── Active tournaments
│
└── Recent Activity
    └── Member registrations, tournament updates
```

### 2.4 Academy Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ACADEMY CAPABILITIES                                │
└─────────────────────────────────────────────────────────────────────────────┘

PROFILE MANAGEMENT
├── Edit Academy Profile
│   ├── Academy name, description
│   ├── Location, address
│   ├── Contact details
│   ├── Timings, batches
│   ├── Coaching staff
│   └── Facilities
│
├── Manage Coaches (Office Bearers)
│   ├── Add coach profiles
│   ├── Qualifications
│   ├── Photos, bios
│   └── Contact info
│
└── Media Management
    ├── Academy photos
    ├── Achievement gallery
    └── Promotional content

STUDENT MANAGEMENT
├── View Academy Students
│   ├── List affiliated players
│   ├── Performance tracking
│   └── Attendance (future)
│
├── Bulk Student Registration
│   ├── Same as Taluk workflow
│   └── Students linked to academy
│
└── Individual Registration
    └── Register new student

TOURNAMENT MANAGEMENT
├── Create Academy Tournaments
│   ├── Internal competitions
│   └── Open tournaments
│
├── View Student Registrations
│   └── Track student participation
│
└── Student Performance
    └── Tournament results tracking

DASHBOARD
├── Academy Stats
│   ├── Total students
│   ├── Active members
│   └── Tournament participation
│
└── Recent Activity
```

### 2.5 Player Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PLAYER CAPABILITIES                                │
└─────────────────────────────────────────────────────────────────────────────┘

PROFILE MANAGEMENT
├── View Profile
│   ├── Personal details
│   ├── KDCA ID
│   ├── Membership status
│   └── Ratings
│
├── Edit Profile
│   ├── Contact information
│   ├── Address
│   ├── Photo
│   └── Chess IDs (FIDE, AICF)
│
└── View Public Profile
    └── How others see your profile

MEMBERSHIP
├── View Membership Status
│   ├── Valid from/to dates
│   ├── Days remaining
│   └── Payment history
│
├── Renew Membership
│   ├── Pay annual fee (₹75)
│   └── Download receipt
│
└── Download ID Card (Future)

TOURNAMENTS
├── Browse Tournaments
│   ├── Filter by date, level, category
│   ├── View tournament details
│   └── Check eligibility
│
├── Register for Tournament
│   ├── Select category
│   ├── Pay entry fee (if required)
│   └── Receive confirmation
│
├── My Registrations
│   ├── View registered tournaments
│   ├── Cancel registration (if allowed)
│   └── View registration details
│
└── My Results
    ├── Tournament history
    ├── Results and rankings
    └── Performance stats

DASHBOARD
├── Quick Stats
│   ├── Membership status
│   ├── Upcoming tournaments
│   └── Recent results
│
├── Notifications
│   ├── Tournament announcements
│   ├── Payment reminders
│   └── System updates
│
└── Quick Actions
    ├── Register for tournament
    ├── Renew membership
    └── Update profile
```

### 2.6 Arbiter Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARBITER CAPABILITIES                               │
└─────────────────────────────────────────────────────────────────────────────┘

All Player capabilities PLUS:

ARBITER PROFILE
├── Arbiter Certification
│   ├── Grade (NA, FA, IA)
│   ├── Certificate number
│   ├── Valid until
│   └── Upload certificate
│
└── Arbiter Listing
    └── Appear in public arbiter directory

ASSIGNMENTS (Future Enhancement)
├── View Available Assignments
├── Apply for Assignment
└── Track Assignments
```

---

## 3. APPROVAL WORKFLOWS

### 3.1 Organization Approval Flow

```
                    ┌───────────────┐
                    │  SUBMISSION   │
                    │  Org submits  │
                    │  registration │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   PENDING     │
                    │  Status set   │
                    │  Admin notified│
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │   APPROVED    │       │   REJECTED    │
        │ - Status:     │       │ - Status:     │
        │   APPROVED    │       │   REJECTED    │
        │ - Credentials │       │ - Reason sent │
        │   sent        │       │ - Can resubmit│
        │ - Dashboard   │       └───────────────┘
        │   access      │
        └───────────────┘
```

### 3.2 Tournament Approval Flow

```
                    ┌───────────────┐
                    │    DRAFT      │
                    │  Org creates  │
                    │  tournament   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   SUBMITTED   │
                    │  For approval │
                    │  Admin notified│
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │   APPROVED    │       │   REJECTED    │
        │ - Can open    │       │ - Reason      │
        │   registration│       │   provided    │
        │ - Public      │       │ - Can edit &  │
        │   listing     │       │   resubmit    │
        └───────┬───────┘       └───────────────┘
                │
                ▼
        ┌───────────────┐
        │  REGISTRATION │
        │     OPEN      │
        │ - Players can │
        │   register    │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │  REGISTRATION │
        │    CLOSED     │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │  IN PROGRESS  │
        │ Tournament    │
        │ happening     │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   COMPLETED   │
        │ Results       │
        │ published     │
        └───────────────┘
```

### 3.3 Arbiter Approval Flow

```
                    ┌───────────────┐
                    │  REGISTRATION │
                    │  User selects │
                    │  "Arbiter"    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   DOCUMENTS   │
                    │ - Certificate │
                    │ - Grade       │
                    │ - Valid date  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   PENDING     │
                    │  Admin review │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │   APPROVED    │       │   REJECTED    │
        │ - Role:       │       │ - Remains     │
        │   ARBITER     │       │   PLAYER      │
        │ - Arbiter ID  │       │ - Reason sent │
        │ - Listed      │       │ - Can retry   │
        └───────────────┘       └───────────────┘
```

---

## 4. DATA FLOW ARCHITECTURE

### 4.1 Frontend Data Flow (Public Website)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PUBLIC WEBSITE DATA FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   BROWSER    │────►│   NEXT.JS    │────►│   API        │
│              │◄────│   (SSR/SSG)  │◄────│   SERVER     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  TanStack    │
                     │  Query       │
                     │  (Caching)   │
                     └──────────────┘

DATA FETCHING STRATEGY:
├── Static Pages (SSG)
│   ├── About page
│   ├── Contact page
│   └── Policy pages
│
├── Dynamic Pages (SSR)
│   ├── Tournament listings
│   ├── Organization profiles
│   └── Player search results
│
├── Client-Side (CSR)
│   ├── Real-time data
│   ├── User interactions
│   └── Form submissions
│
└── Hybrid (ISR - Incremental Static Regeneration)
    ├── Homepage sections
    ├── News articles
    └── Cached for 60 seconds
```

### 4.2 Frontend Data Flow (Admin Portal)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADMIN PORTAL DATA FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              REACT APPLICATION                                │
│                                                                              │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐      │
│  │   PAGES    │───►│ COMPONENTS │───►│   HOOKS    │───►│  STORES    │      │
│  │            │    │            │    │            │    │  (Zustand) │      │
│  └────────────┘    └────────────┘    └────────────┘    └────────────┘      │
│        │                                    │                │              │
│        │                                    ▼                │              │
│        │                             ┌────────────┐         │              │
│        │                             │  TanStack  │◄────────┘              │
│        │                             │   Query    │                         │
│        │                             └────────────┘                         │
│        │                                    │                               │
└────────│────────────────────────────────────│───────────────────────────────┘
         │                                    │
         │                                    ▼
         │                             ┌────────────┐
         │                             │   API      │
         │                             │  CLIENT    │
         │                             │  (Axios)   │
         │                             └────────────┘
         │                                    │
         │                                    ▼
         │                             ┌────────────┐
         └────────────────────────────►│   API      │
                                       │  SERVER    │
                                       └────────────┘

STATE MANAGEMENT:
├── Server State (TanStack Query)
│   ├── API data caching
│   ├── Background refetching
│   ├── Optimistic updates
│   └── Pagination handling
│
├── Client State (Zustand)
│   ├── Auth state
│   ├── UI state (sidebar, modals)
│   ├── Form state (complex forms)
│   └── Filters/preferences
│
└── URL State
    ├── Pagination params
    ├── Filter params
    └── Tab selection
```

### 4.3 API Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API REQUEST FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    REQUEST                  MIDDLEWARE                     HANDLER
    ───────                  ──────────                     ───────
        │                        │                             │
        ▼                        ▼                             ▼
┌──────────────┐         ┌──────────────┐             ┌──────────────┐
│   Client     │────────►│   NGINX      │────────────►│   NestJS     │
│   Request    │         │   (Proxy)    │             │   Gateway    │
└──────────────┘         └──────────────┘             └──────┬───────┘
                                                             │
                         ┌───────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Guards     │
                  │   (Auth)     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Interceptors │
                  │ (Logging)    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Pipes      │
                  │ (Validation) │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Controller  │
                  │  (Route)     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Service    │
                  │  (Logic)     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Prisma     │
                  │  (Database)  │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  PostgreSQL  │
                  │   Database   │
                  └──────────────┘
```

---

## 5. NOTIFICATION SYSTEM

### 5.1 Notification Triggers

| Event | Recipient | Channel | Template |
|-------|-----------|---------|----------|
| Registration success | Player | Email, SMS | `welcome_player` |
| Email verification | Player | Email | `verify_email` |
| Membership payment | Player | Email | `payment_success` |
| Membership expiring | Player | Email | `membership_reminder` |
| Tournament registration | Player | Email | `tournament_registered` |
| Tournament results | Player | Email | `tournament_results` |
| Organization approved | Org Admin | Email | `org_approved` |
| Organization rejected | Org Admin | Email | `org_rejected` |
| Tournament approved | Org Admin | Email | `tournament_approved` |
| New org submission | Admin | Email | `new_org_pending` |
| New arbiter application | Admin | Email | `new_arbiter_pending` |
| Password reset | User | Email | `password_reset` |

### 5.2 Notification Flow

```
    EVENT                  QUEUE                   DELIVERY
    ─────                  ─────                   ────────
        │                     │                        │
        ▼                     ▼                        ▼
┌──────────────┐      ┌──────────────┐        ┌──────────────┐
│   Service    │─────►│   BullMQ     │───────►│   Worker     │
│   Emits      │      │   Queue      │        │   Processes  │
│   Event      │      │              │        │              │
└──────────────┘      └──────────────┘        └──────┬───────┘
                                                      │
                           ┌──────────────────────────┼──────────────────┐
                           │                          │                  │
                           ▼                          ▼                  ▼
                    ┌──────────────┐          ┌──────────────┐   ┌──────────────┐
                    │   Email      │          │    SMS       │   │   In-App     │
                    │   Service    │          │   Service    │   │   Notif      │
                    │  (Nodemailer)│          │   (Future)   │   │   (DB)       │
                    └──────────────┘          └──────────────┘   └──────────────┘
```

---

*Next Document: 06-SCALABILITY-ROADMAP.md*
