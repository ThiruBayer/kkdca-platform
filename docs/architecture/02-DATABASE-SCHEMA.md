# KDCA Platform - Database Schema

## Document Version: 1.0 | Date: 2026-01-27

---

## 1. SCHEMA OVERVIEW

The database uses PostgreSQL 16+ with Prisma ORM. The schema is designed for:
- Multi-tenant organization support
- Audit trail on all critical operations
- Soft deletes for data recovery
- Full-text search capabilities
- JSON fields for flexible metadata

---

## 2. ENTITY RELATIONSHIP DIAGRAM

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      users      │       │  organizations  │       │   tournaments   │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ kdca_id         │◄──────│ created_by (FK) │       │ org_id (FK)     │──┐
│ email           │       │ type            │       │ name            │  │
│ phone           │       │ name            │       │ level           │  │
│ role            │       │ taluk_id (FK)   │──┐    │ status          │  │
│ org_id (FK)     │───────►                 │  │    │ dates           │  │
└────────┬────────┘       └────────┬────────┘  │    └────────┬────────┘  │
         │                         │           │             │           │
         │    ┌────────────────────┘           │             │           │
         │    │                                │             │           │
         │    ▼                                ▼             ▼           │
         │ ┌─────────────────┐       ┌─────────────────┐                 │
         │ │ office_bearers  │       │     taluks      │                 │
         │ │─────────────────│       │─────────────────│                 │
         │ │ id (PK)         │       │ id (PK)         │                 │
         │ │ org_id (FK)     │       │ code            │                 │
         │ │ user_id (FK)    │       │ name            │                 │
         │ │ role            │       └─────────────────┘                 │
         │ └─────────────────┘                                           │
         │                                                               │
         ▼                                                               │
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐ │
│ player_profiles │       │tournament_regs  │       │    payments     │ │
│─────────────────│       │─────────────────│       │─────────────────│ │
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │ │
│ user_id (FK)    │◄──────│ user_id (FK)    │       │ user_id (FK)    │ │
│ dob             │       │ tournament_id   │───────│ tournament_id   │◄┘
│ fide_id         │       │ category        │       │ order_id        │
│ aicf_id         │       │ status          │       │ amount          │
│ rating          │       │ result          │       │ status          │
└─────────────────┘       └─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    content      │       │     media       │       │   audit_logs    │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ type            │       │ entity_type     │       │ user_id (FK)    │
│ title           │       │ entity_id       │       │ action          │
│ slug            │       │ file_path       │       │ entity          │
│ body            │       │ mime_type       │       │ changes (JSON)  │
│ status          │       │ purpose         │       │ ip_address      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 3. ENUMS

```prisma
enum UserRole {
  SUPER_ADMIN
  ADMIN
  TALUK_ASSOCIATION
  ACADEMY
  PLAYER
  ARBITER
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  INACTIVE
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum OrganizationType {
  TALUK_ASSOCIATION
  ACADEMY
  SCHOOL
  CLUB
}

enum OrganizationStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum TournamentLevel {
  TALUK
  DISTRICT
  STATE
  NATIONAL
  INTERNATIONAL
}

enum TournamentStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REGISTRATION_OPEN
  REGISTRATION_CLOSED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TournamentCategory {
  OPEN
  UNDER_7
  UNDER_9
  UNDER_11
  UNDER_13
  UNDER_15
  UNDER_17
  UNDER_19
  VETERANS
  WOMEN
  SCHOOL
}

enum TimeControl {
  CLASSICAL
  RAPID
  BLITZ
  BULLET
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  WITHDRAWN
  NO_SHOW
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCESS
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentPurpose {
  MEMBERSHIP_NEW
  MEMBERSHIP_RENEWAL
  TOURNAMENT_REGISTRATION
  ARBITER_CERTIFICATION
}

enum ContentType {
  NEWS
  ANNOUNCEMENT
  PAGE
  BANNER
  TESTIMONIAL
  ACHIEVEMENT
}

enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  ARCHIVED
}

enum MediaPurpose {
  PROFILE_PHOTO
  DOCUMENT
  CERTIFICATE
  TOURNAMENT_IMAGE
  BANNER
  GALLERY
  LOGO
}

enum OfficeBearerRole {
  PRESIDENT
  VICE_PRESIDENT
  SECRETARY
  JOINT_SECRETARY
  TREASURER
  EXECUTIVE_MEMBER
  HONORARY_PRESIDENT
  PATRON
}
```

---

## 4. COMPLETE TABLE DEFINITIONS

### 4.1 Core Tables

#### `taluks` - Geographic Regions

```prisma
model Taluk {
  id          String   @id @default(uuid())
  code        String   @unique @db.VarChar(3)  // KKI, CHI, SAN, etc.
  name        String   @db.VarChar(100)
  nameTamil   String?  @map("name_tamil") @db.VarChar(100)
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")

  // Relations
  organizations Organization[]
  users         User[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("taluks")
}
```

#### `users` - All System Users

```prisma
model User {
  id              String      @id @default(uuid())
  kdcaId          String?     @unique @map("kdca_id") @db.VarChar(15)

  // Authentication
  email           String      @unique @db.VarChar(255)
  phone           String      @unique @db.VarChar(15)
  passwordHash    String      @map("password_hash")
  role            UserRole    @default(PLAYER)
  status          UserStatus  @default(PENDING)

  // Basic Info
  firstName       String      @map("first_name") @db.VarChar(100)
  lastName        String?     @map("last_name") @db.VarChar(100)
  displayName     String?     @map("display_name") @db.VarChar(200)

  // Organization link (for org admins)
  organizationId  String?     @map("organization_id")
  organization    Organization? @relation(fields: [organizationId], references: [id])

  // Taluk link
  talukId         String?     @map("taluk_id")
  taluk           Taluk?      @relation(fields: [talukId], references: [id])

  // Membership
  membershipValidFrom DateTime? @map("membership_valid_from")
  membershipValidTo   DateTime? @map("membership_valid_to")
  membershipStatus    String?   @map("membership_status") @db.VarChar(20)

  // Security
  emailVerified     Boolean   @default(false) @map("email_verified")
  phoneVerified     Boolean   @default(false) @map("phone_verified")
  twoFactorEnabled  Boolean   @default(false) @map("two_factor_enabled")
  lastLoginAt       DateTime? @map("last_login_at")
  failedLoginCount  Int       @default(0) @map("failed_login_count")
  lockedUntil       DateTime? @map("locked_until")

  // Relations
  profile             PlayerProfile?
  managedOrganization Organization?     @relation("OrganizationCreator")
  officeBearerRoles   OfficeBearer[]
  tournamentRegistrations TournamentRegistration[]
  payments            Payment[]
  createdContent      Content[]
  auditLogs           AuditLog[]
  notifications       Notification[]
  refreshTokens       RefreshToken[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  @@index([email])
  @@index([phone])
  @@index([kdcaId])
  @@index([role, status])
  @@map("users")
}
```

#### `player_profiles` - Extended Player Information

```prisma
model PlayerProfile {
  id              String    @id @default(uuid())
  userId          String    @unique @map("user_id")
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Personal Details
  dateOfBirth     DateTime  @map("date_of_birth") @db.Date
  gender          Gender
  bloodGroup      String?   @map("blood_group") @db.VarChar(5)

  // Address
  addressLine1    String?   @map("address_line1") @db.VarChar(255)
  addressLine2    String?   @map("address_line2") @db.VarChar(255)
  city            String?   @db.VarChar(100)
  district        String?   @db.VarChar(100)
  state           String    @default("Tamil Nadu") @db.VarChar(100)
  pincode         String?   @db.VarChar(10)

  // Guardian (for minors)
  guardianName    String?   @map("guardian_name") @db.VarChar(200)
  guardianPhone   String?   @map("guardian_phone") @db.VarChar(15)
  guardianEmail   String?   @map("guardian_email") @db.VarChar(255)
  guardianRelation String?  @map("guardian_relation") @db.VarChar(50)

  // Chess Identifiers
  fideId          String?   @map("fide_id") @db.VarChar(20)
  aicfId          String?   @map("aicf_id") @db.VarChar(20)
  tncaId          String?   @map("tnca_id") @db.VarChar(20)

  // Ratings
  fideRatingStd   Int?      @map("fide_rating_std")
  fideRatingRapid Int?      @map("fide_rating_rapid")
  fideRatingBlitz Int?      @map("fide_rating_blitz")
  aicfRating      Int?      @map("aicf_rating")

  // Education/Occupation
  occupation      String?   @db.VarChar(100)
  schoolName      String?   @map("school_name") @db.VarChar(255)
  collegeName     String?   @map("college_name") @db.VarChar(255)

  // Arbiter specific
  arbiterGrade    String?   @map("arbiter_grade") @db.VarChar(50)
  arbiterCertNo   String?   @map("arbiter_cert_no") @db.VarChar(50)
  arbiterValidTill DateTime? @map("arbiter_valid_till")

  // Documents (file paths)
  photoUrl        String?   @map("photo_url") @db.VarChar(500)
  aadhaarUrl      String?   @map("aadhaar_url") @db.VarChar(500)
  birthCertUrl    String?   @map("birth_cert_url") @db.VarChar(500)

  // Academy/Club affiliation
  affiliatedOrgId String?   @map("affiliated_org_id")
  affiliatedOrg   Organization? @relation(fields: [affiliatedOrgId], references: [id])

  // Achievements summary (JSON for flexibility)
  achievements    Json?     @default("[]")

  // Bio
  bio             String?   @db.Text

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([fideId])
  @@index([aicfId])
  @@map("player_profiles")
}
```

### 4.2 Organization Tables

#### `organizations` - Taluk Associations & Academies

```prisma
model Organization {
  id              String             @id @default(uuid())
  type            OrganizationType
  status          OrganizationStatus @default(PENDING)

  // Basic Info
  name            String             @db.VarChar(255)
  shortName       String?            @map("short_name") @db.VarChar(50)
  slug            String             @unique @db.VarChar(100)
  description     String?            @db.Text

  // Location
  talukId         String?            @map("taluk_id")
  taluk           Taluk?             @relation(fields: [talukId], references: [id])
  address         String?            @db.Text
  city            String?            @db.VarChar(100)
  pincode         String?            @db.VarChar(10)

  // Contact
  email           String?            @db.VarChar(255)
  phone           String?            @db.VarChar(15)
  alternatePhone  String?            @map("alternate_phone") @db.VarChar(15)
  website         String?            @db.VarChar(255)

  // Social Media
  facebookUrl     String?            @map("facebook_url") @db.VarChar(255)
  instagramUrl    String?            @map("instagram_url") @db.VarChar(255)
  youtubeUrl      String?            @map("youtube_url") @db.VarChar(255)

  // Branding
  logoUrl         String?            @map("logo_url") @db.VarChar(500)
  bannerUrl       String?            @map("banner_url") @db.VarChar(500)

  // Registration Info
  registrationNo  String?            @map("registration_no") @db.VarChar(100)
  establishedYear Int?               @map("established_year")

  // Admin user who created/manages
  createdById     String?            @map("created_by_id")
  createdBy       User?              @relation("OrganizationCreator", fields: [createdById], references: [id])

  // Approval
  approvedAt      DateTime?          @map("approved_at")
  approvedById    String?            @map("approved_by_id")
  rejectionReason String?            @map("rejection_reason") @db.Text

  // Settings (JSON for flexibility)
  settings        Json?              @default("{}")

  // Relations
  members         User[]
  officeBearers   OfficeBearer[]
  tournaments     Tournament[]
  affiliatedPlayers PlayerProfile[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  @@index([type, status])
  @@index([talukId])
  @@index([slug])
  @@map("organizations")
}
```

#### `office_bearers` - Organization Leadership

```prisma
model OfficeBearer {
  id              String           @id @default(uuid())

  organizationId  String           @map("organization_id")
  organization    Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  // Can link to existing user or store external person
  userId          String?          @map("user_id")
  user            User?            @relation(fields: [userId], references: [id])

  // Role info
  role            OfficeBearerRole
  customRole      String?          @map("custom_role") @db.VarChar(100)

  // Person details (if not linked to user)
  name            String           @db.VarChar(200)
  designation     String?          @db.VarChar(200)
  email           String?          @db.VarChar(255)
  phone           String?          @db.VarChar(15)
  photoUrl        String?          @map("photo_url") @db.VarChar(500)
  bio             String?          @db.Text

  // Term
  termStart       DateTime?        @map("term_start") @db.Date
  termEnd         DateTime?        @map("term_end") @db.Date
  isActive        Boolean          @default(true) @map("is_active")

  sortOrder       Int              @default(0) @map("sort_order")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([organizationId, isActive])
  @@map("office_bearers")
}
```

### 4.3 Tournament Tables

#### `tournaments` - Chess Tournaments

```prisma
model Tournament {
  id              String            @id @default(uuid())

  // Organization hosting
  organizationId  String            @map("organization_id")
  organization    Organization      @relation(fields: [organizationId], references: [id])

  // Basic Info
  name            String            @db.VarChar(255)
  slug            String            @unique @db.VarChar(150)
  description     String?           @db.Text

  // Classification
  level           TournamentLevel
  categories      TournamentCategory[]
  timeControl     TimeControl
  format          String?           @db.VarChar(50)  // Swiss, Round Robin, etc.

  // Dates
  registrationStart DateTime        @map("registration_start")
  registrationEnd   DateTime        @map("registration_end")
  tournamentStart   DateTime        @map("tournament_start")
  tournamentEnd     DateTime        @map("tournament_end")

  // Venue
  venueName       String            @map("venue_name") @db.VarChar(255)
  venueAddress    String?           @map("venue_address") @db.Text
  venueCity       String?           @map("venue_city") @db.VarChar(100)
  venueMapUrl     String?           @map("venue_map_url") @db.VarChar(500)

  // Capacity
  maxParticipants Int?              @map("max_participants")
  currentCount    Int               @default(0) @map("current_count")

  // Fees
  entryFee        Decimal?          @map("entry_fee") @db.Decimal(10, 2)
  lateFee         Decimal?          @map("late_fee") @db.Decimal(10, 2)
  lateFeeDate     DateTime?         @map("late_fee_date")

  // Prizes (JSON for flexibility)
  prizes          Json?             @default("[]")

  // Rules & Info
  rules           String?           @db.Text
  chiefArbiter    String?           @map("chief_arbiter") @db.VarChar(200)
  contactEmail    String?           @map("contact_email") @db.VarChar(255)
  contactPhone    String?           @map("contact_phone") @db.VarChar(15)

  // Status
  status          TournamentStatus  @default(DRAFT)

  // Images
  posterUrl       String?           @map("poster_url") @db.VarChar(500)

  // Approval
  submittedAt     DateTime?         @map("submitted_at")
  approvedAt      DateTime?         @map("approved_at")
  approvedById    String?           @map("approved_by_id")
  rejectionReason String?           @map("rejection_reason") @db.Text

  // Results published
  resultsPublished Boolean          @default(false) @map("results_published")

  // Relations
  registrations   TournamentRegistration[]
  payments        Payment[]

  // Metadata
  metadata        Json?             @default("{}")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  @@index([status, tournamentStart])
  @@index([organizationId])
  @@index([level])
  @@map("tournaments")
}
```

#### `tournament_registrations` - Player Registrations

```prisma
model TournamentRegistration {
  id              String             @id @default(uuid())

  tournamentId    String             @map("tournament_id")
  tournament      Tournament         @relation(fields: [tournamentId], references: [id])

  userId          String             @map("user_id")
  user            User               @relation(fields: [userId], references: [id])

  // Registration details
  category        TournamentCategory
  status          RegistrationStatus @default(PENDING)
  registeredAt    DateTime           @default(now()) @map("registered_at")

  // Payment link
  paymentId       String?            @map("payment_id")
  payment         Payment?           @relation(fields: [paymentId], references: [id])

  // Result (after tournament)
  rank            Int?
  score           Decimal?           @db.Decimal(4, 1)
  tiebreak1       Decimal?           @db.Decimal(6, 2)
  tiebreak2       Decimal?           @db.Decimal(6, 2)
  prize           String?            @db.VarChar(255)

  // Notes
  notes           String?            @db.Text

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@unique([tournamentId, userId])
  @@index([tournamentId, category])
  @@index([userId])
  @@map("tournament_registrations")
}
```

### 4.4 Payment Tables

#### `payments` - All Financial Transactions

```prisma
model Payment {
  id              String         @id @default(uuid())

  // User making payment
  userId          String         @map("user_id")
  user            User           @relation(fields: [userId], references: [id])

  // Optional tournament link
  tournamentId    String?        @map("tournament_id")
  tournament      Tournament?    @relation(fields: [tournamentId], references: [id])

  // Purpose
  purpose         PaymentPurpose
  description     String?        @db.VarChar(255)

  // Amount
  amount          Decimal        @db.Decimal(10, 2)
  currency        String         @default("INR") @db.VarChar(3)

  // Gateway details
  gatewayOrderId  String?        @unique @map("gateway_order_id") @db.VarChar(100)
  gatewayPaymentId String?       @map("gateway_payment_id") @db.VarChar(100)
  gatewaySignature String?       @map("gateway_signature") @db.VarChar(255)
  gateway         String         @default("HDFC") @db.VarChar(50)

  // Status
  status          PaymentStatus  @default(PENDING)
  statusMessage   String?        @map("status_message") @db.VarChar(255)

  // Timestamps
  initiatedAt     DateTime       @default(now()) @map("initiated_at")
  completedAt     DateTime?      @map("completed_at")

  // Receipt
  receiptNo       String?        @unique @map("receipt_no") @db.VarChar(50)
  receiptUrl      String?        @map("receipt_url") @db.VarChar(500)

  // Gateway response (JSON)
  gatewayResponse Json?          @map("gateway_response")

  // Refund details
  refundedAt      DateTime?      @map("refunded_at")
  refundAmount    Decimal?       @map("refund_amount") @db.Decimal(10, 2)
  refundReason    String?        @map("refund_reason") @db.Text

  // Relations
  tournamentRegistrations TournamentRegistration[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@index([gatewayOrderId])
  @@map("payments")
}
```

### 4.5 Content Management Tables

#### `content` - Dynamic Content (News, Pages, Banners)

```prisma
model Content {
  id              String        @id @default(uuid())

  type            ContentType
  status          ContentStatus @default(DRAFT)

  // Basic
  title           String        @db.VarChar(255)
  slug            String        @unique @db.VarChar(150)
  excerpt         String?       @db.VarChar(500)
  body            String?       @db.Text

  // SEO
  metaTitle       String?       @map("meta_title") @db.VarChar(100)
  metaDescription String?       @map("meta_description") @db.VarChar(255)

  // Media
  featuredImage   String?       @map("featured_image") @db.VarChar(500)
  gallery         Json?         @default("[]")

  // Categorization
  tags            String[]      @default([])

  // Display options
  isPinned        Boolean       @default(false) @map("is_pinned")
  showOnHome      Boolean       @default(false) @map("show_on_home")
  sortOrder       Int           @default(0) @map("sort_order")

  // Scheduling
  publishedAt     DateTime?     @map("published_at")
  expiresAt       DateTime?     @map("expires_at")

  // Author
  authorId        String        @map("author_id")
  author          User          @relation(fields: [authorId], references: [id])

  // View tracking
  viewCount       Int           @default(0) @map("view_count")

  // Extra data (JSON)
  metadata        Json?         @default("{}")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  @@index([type, status])
  @@index([slug])
  @@index([publishedAt])
  @@map("content")
}
```

#### `media` - File Storage Records

```prisma
model Media {
  id              String       @id @default(uuid())

  // Entity association (polymorphic)
  entityType      String       @map("entity_type") @db.VarChar(50)
  entityId        String       @map("entity_id")

  // File info
  fileName        String       @map("file_name") @db.VarChar(255)
  originalName    String       @map("original_name") @db.VarChar(255)
  filePath        String       @map("file_path") @db.VarChar(500)
  fileUrl         String       @map("file_url") @db.VarChar(500)
  mimeType        String       @map("mime_type") @db.VarChar(100)
  fileSize        Int          @map("file_size")  // bytes

  // Purpose
  purpose         MediaPurpose

  // Image dimensions (if applicable)
  width           Int?
  height          Int?

  // Alt text for accessibility
  altText         String?      @map("alt_text") @db.VarChar(255)

  // Thumbnails (JSON array of sizes)
  thumbnails      Json?        @default("[]")

  sortOrder       Int          @default(0) @map("sort_order")

  createdAt   DateTime @default(now()) @map("created_at")

  @@index([entityType, entityId])
  @@index([purpose])
  @@map("media")
}
```

### 4.6 System Tables

#### `audit_logs` - Activity Tracking

```prisma
model AuditLog {
  id              String   @id @default(uuid())

  userId          String?  @map("user_id")
  user            User?    @relation(fields: [userId], references: [id])

  action          String   @db.VarChar(50)  // CREATE, UPDATE, DELETE, LOGIN, etc.
  entityType      String   @map("entity_type") @db.VarChar(50)
  entityId        String?  @map("entity_id")

  // What changed (JSON)
  previousData    Json?    @map("previous_data")
  newData         Json?    @map("new_data")

  // Request info
  ipAddress       String?  @map("ip_address") @db.VarChar(50)
  userAgent       String?  @map("user_agent") @db.VarChar(500)

  // Additional context
  description     String?  @db.Text

  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

#### `notifications` - User Notifications

```prisma
model Notification {
  id              String   @id @default(uuid())

  userId          String   @map("user_id")
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type            String   @db.VarChar(50)  // EMAIL, SMS, PUSH, IN_APP
  category        String   @db.VarChar(50)  // TOURNAMENT, PAYMENT, MEMBERSHIP, SYSTEM

  title           String   @db.VarChar(255)
  message         String   @db.Text

  // For linking to related entity
  linkType        String?  @map("link_type") @db.VarChar(50)
  linkId          String?  @map("link_id")

  isRead          Boolean  @default(false) @map("is_read")
  readAt          DateTime? @map("read_at")

  // For scheduled notifications
  scheduledFor    DateTime? @map("scheduled_for")
  sentAt          DateTime? @map("sent_at")

  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}
```

#### `refresh_tokens` - JWT Refresh Tokens

```prisma
model RefreshToken {
  id              String   @id @default(uuid())

  userId          String   @map("user_id")
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  token           String   @unique @db.VarChar(500)
  expiresAt       DateTime @map("expires_at")

  // Device info
  deviceInfo      String?  @map("device_info") @db.VarChar(255)
  ipAddress       String?  @map("ip_address") @db.VarChar(50)

  isRevoked       Boolean  @default(false) @map("is_revoked")
  revokedAt       DateTime? @map("revoked_at")

  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}
```

#### `settings` - System Configuration

```prisma
model Setting {
  id              String   @id @default(uuid())

  key             String   @unique @db.VarChar(100)
  value           Json
  description     String?  @db.Text

  // Grouping
  group           String   @default("general") @db.VarChar(50)

  // Type hint for UI
  valueType       String   @map("value_type") @db.VarChar(20)  // string, number, boolean, json

  isPublic        Boolean  @default(false) @map("is_public")

  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([group])
  @@map("settings")
}
```

---

## 5. INDEXES & PERFORMANCE

### 5.1 Critical Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_kdca_id ON users(kdca_id);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Organization lookups
CREATE INDEX idx_orgs_type_status ON organizations(type, status);
CREATE INDEX idx_orgs_taluk ON organizations(taluk_id);

-- Tournament queries
CREATE INDEX idx_tournaments_status_date ON tournaments(status, tournament_start);
CREATE INDEX idx_tournaments_org ON tournaments(organization_id);
CREATE INDEX idx_tournament_regs_user ON tournament_registrations(user_id);

-- Payment tracking
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_order ON payments(gateway_order_id);

-- Content queries
CREATE INDEX idx_content_type_status ON content(type, status);
CREATE INDEX idx_content_published ON content(published_at);

-- Audit trail
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

### 5.2 Full-Text Search

```sql
-- Player search
ALTER TABLE users ADD COLUMN search_vector tsvector;
CREATE INDEX idx_users_search ON users USING GIN(search_vector);

-- Content search
ALTER TABLE content ADD COLUMN search_vector tsvector;
CREATE INDEX idx_content_search ON content USING GIN(search_vector);

-- Tournament search
ALTER TABLE tournaments ADD COLUMN search_vector tsvector;
CREATE INDEX idx_tournaments_search ON tournaments USING GIN(search_vector);
```

---

## 6. DATA MIGRATION SEEDS

### 6.1 Initial Taluk Data

```typescript
const taluks = [
  { code: 'KKI', name: 'Kallakurichi', nameTamil: 'கள்ளக்குறிச்சி', sortOrder: 1 },
  { code: 'CHI', name: 'Chinnasalem', nameTamil: 'சின்னசேலம்', sortOrder: 2 },
  { code: 'SAN', name: 'Sankarapuram', nameTamil: 'சங்கராபுரம்', sortOrder: 3 },
  { code: 'ULP', name: 'Ulundurpet', nameTamil: 'உளுந்தூர்பேட்டை', sortOrder: 4 },
  { code: 'TKR', name: 'Thirukovilur', nameTamil: 'திருக்கோவிலூர்', sortOrder: 5 },
  { code: 'KVH', name: 'Kalvarayan Hills', nameTamil: 'கல்வராயன் மலை', sortOrder: 6 },
  { code: 'EXT', name: 'External', nameTamil: 'வெளியூர்', sortOrder: 99 },
];
```

### 6.2 Default Settings

```typescript
const defaultSettings = [
  { key: 'site_name', value: 'Kallakurichi District Chess Association', group: 'general', isPublic: true },
  { key: 'site_tagline', value: 'Nurturing Chess Champions', group: 'general', isPublic: true },
  { key: 'membership_fee_player', value: 75, group: 'payments', isPublic: true },
  { key: 'membership_fee_arbiter', value: 250, group: 'payments', isPublic: true },
  { key: 'membership_year_start', value: 1, group: 'membership', isPublic: false },
  { key: 'membership_year_end', value: 12, group: 'membership', isPublic: false },
  { key: 'contact_email', value: 'info@kallaichess.com', group: 'contact', isPublic: true },
  { key: 'contact_phone', value: '+91 9876543210', group: 'contact', isPublic: true },
];
```

---

*Next Document: 03-API-CONTRACTS.md*
