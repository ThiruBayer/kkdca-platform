# KDCA Platform - API Contracts

## Document Version: 1.0 | Date: 2026-01-27

---

## 1. API OVERVIEW

### Base URL
- **Production**: `https://api.kallaichess.com/v1`
- **Staging**: `https://api-staging.kallaichess.com/v1`
- **Development**: `http://localhost:3000/v1`

### API Standards
- RESTful design principles
- JSON request/response bodies
- JWT Bearer token authentication
- Consistent error response format
- Pagination on list endpoints
- Rate limiting: 100 requests/minute

### Common Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>  # For request tracing
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-27T10:30:00Z",
    "requestId": "uuid"
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": { ... }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 2. AUTHENTICATION ENDPOINTS

### 2.1 Player/User Registration
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "player@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!",
  "firstName": "Rahul",
  "lastName": "Kumar",
  "dateOfBirth": "2010-05-15",
  "gender": "MALE",
  "talukId": "uuid-taluk",
  "guardianName": "Parent Name",
  "guardianPhone": "9876543211",
  "role": "PLAYER"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "player@example.com",
      "phone": "9876543210",
      "firstName": "Rahul",
      "lastName": "Kumar",
      "role": "PLAYER",
      "status": "PENDING"
    },
    "message": "Registration successful. Please verify your email."
  }
}
```

### 2.2 Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "identifier": "player@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "kdcaId": "001KKI2026",
      "email": "player@example.com",
      "firstName": "Rahul",
      "role": "PLAYER",
      "status": "ACTIVE",
      "organizationId": null
    },
    "tokens": {
      "accessToken": "jwt...",
      "refreshToken": "jwt...",
      "expiresIn": 900
    }
  }
}
```

### 2.3 Refresh Token
```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "jwt..."
}
```

### 2.4 Logout
```
POST /auth/logout
```
Revokes current refresh token.

### 2.5 Email Verification
```
POST /auth/verify-email
```

**Request Body:**
```json
{
  "token": "verification-token"
}
```

### 2.6 Password Reset Request
```
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "player@example.com"
}
```

### 2.7 Reset Password
```
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePass123!"
}
```

### 2.8 Change Password
```
POST /auth/change-password
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

---

## 3. USER ENDPOINTS

### 3.1 Get Current User Profile
```
GET /users/me
```
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "kdcaId": "001KKI2026",
    "email": "player@example.com",
    "phone": "9876543210",
    "firstName": "Rahul",
    "lastName": "Kumar",
    "role": "PLAYER",
    "status": "ACTIVE",
    "membershipStatus": "ACTIVE",
    "membershipValidTo": "2026-12-31",
    "profile": {
      "dateOfBirth": "2010-05-15",
      "gender": "MALE",
      "photoUrl": "https://...",
      "fideId": null,
      "aicfId": "TN12345",
      "fideRatingStd": null,
      "aicfRating": 1250,
      "address": { ... },
      "guardian": { ... }
    },
    "taluk": {
      "id": "uuid",
      "code": "KKI",
      "name": "Kallakurichi"
    }
  }
}
```

### 3.2 Update Profile
```
PATCH /users/me
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "firstName": "Rahul",
  "lastName": "Kumar",
  "profile": {
    "addressLine1": "123 Main St",
    "city": "Kallakurichi",
    "bio": "Aspiring chess player..."
  }
}
```

### 3.3 Upload Profile Photo
```
POST /users/me/photo
```
**Auth Required:** Yes
**Content-Type:** multipart/form-data

### 3.4 Search Players (Public)
```
GET /users/players/search?q=rahul&taluk=KKI&page=1&limit=20
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search name, KDCA ID |
| taluk | string | Taluk code filter |
| status | string | ACTIVE, INACTIVE |
| page | number | Page number |
| limit | number | Items per page (max 50) |

### 3.5 Get Player Public Profile
```
GET /users/players/:kdcaId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kdcaId": "001KKI2026",
    "displayName": "Rahul Kumar",
    "photoUrl": "https://...",
    "taluk": "Kallakurichi",
    "memberSince": "2026-01-15",
    "ratings": {
      "fide": null,
      "aicf": 1250
    },
    "achievements": [ ... ],
    "recentTournaments": [ ... ]
  }
}
```

### 3.6 List Arbiters (Public)
```
GET /users/arbiters?page=1&limit=20
```

---

## 4. ORGANIZATION ENDPOINTS

### 4.1 Register Organization
```
POST /organizations
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "TALUK_ASSOCIATION",
  "name": "Chinnasalem Taluk Chess Association",
  "shortName": "CTCA",
  "talukId": "uuid",
  "email": "ctca@example.com",
  "phone": "9876543210",
  "address": "123 Main Road, Chinnasalem",
  "description": "Official chess association..."
}
```

### 4.2 List Organizations (Public)
```
GET /organizations?type=TALUK_ASSOCIATION&status=APPROVED&page=1
```

### 4.3 Get Organization Details (Public)
```
GET /organizations/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "TALUK_ASSOCIATION",
    "name": "Chinnasalem Taluk Chess Association",
    "slug": "chinnasalem-taluk-chess-association",
    "description": "...",
    "logoUrl": "https://...",
    "bannerUrl": "https://...",
    "contact": {
      "email": "ctca@example.com",
      "phone": "9876543210",
      "address": "..."
    },
    "social": {
      "facebook": "...",
      "instagram": "..."
    },
    "taluk": {
      "code": "CHI",
      "name": "Chinnasalem"
    },
    "officeBearers": [ ... ],
    "stats": {
      "memberCount": 45,
      "tournamentCount": 12
    }
  }
}
```

### 4.4 Update Organization (Own)
```
PATCH /organizations/:id
```
**Auth Required:** Yes (Organization Admin)

### 4.5 Organization Dashboard
```
GET /organizations/:id/dashboard
```
**Auth Required:** Yes (Organization Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMembers": 45,
      "newMembersThisMonth": 8,
      "upcomingTournaments": 2,
      "pendingApprovals": 3
    },
    "recentMembers": [ ... ],
    "upcomingTournaments": [ ... ],
    "recentActivities": [ ... ]
  }
}
```

### 4.6 Bulk Register Players
```
POST /organizations/:id/players/bulk
```
**Auth Required:** Yes (Organization Admin)
**Content-Type:** multipart/form-data

**Request:** CSV file with player data

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "successful": 23,
    "failed": 2,
    "errors": [
      { "row": 5, "error": "Invalid email format" },
      { "row": 12, "error": "Phone already exists" }
    ]
  }
}
```

---

## 5. OFFICE BEARER ENDPOINTS

### 5.1 List Office Bearers
```
GET /organizations/:orgId/office-bearers
```

### 5.2 Add Office Bearer
```
POST /organizations/:orgId/office-bearers
```
**Auth Required:** Yes (Organization Admin)

**Request Body:**
```json
{
  "role": "VICE_PRESIDENT",
  "name": "John Doe",
  "designation": "VP, Academic Affairs",
  "email": "john@example.com",
  "phone": "9876543210",
  "bio": "Experienced chess administrator...",
  "termStart": "2026-01-01",
  "termEnd": "2027-12-31",
  "sortOrder": 2
}
```

### 5.3 Update Office Bearer
```
PATCH /organizations/:orgId/office-bearers/:id
```
**Auth Required:** Yes (Organization Admin)

### 5.4 Delete Office Bearer
```
DELETE /organizations/:orgId/office-bearers/:id
```
**Auth Required:** Yes (Organization Admin)

### 5.5 Upload Office Bearer Photo
```
POST /organizations/:orgId/office-bearers/:id/photo
```
**Auth Required:** Yes (Organization Admin)

---

## 6. TOURNAMENT ENDPOINTS

### 6.1 List Tournaments (Public)
```
GET /tournaments?status=REGISTRATION_OPEN&level=DISTRICT&page=1
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | REGISTRATION_OPEN, UPCOMING, COMPLETED |
| level | string | TALUK, DISTRICT, STATE, NATIONAL |
| category | string | OPEN, UNDER_11, etc. |
| organizationId | uuid | Filter by organizer |
| fromDate | date | Start date filter |
| toDate | date | End date filter |
| page | number | Page number |
| limit | number | Items per page |

### 6.2 Get Tournament Details
```
GET /tournaments/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "KDCA District Rapid Championship 2026",
    "slug": "kdca-district-rapid-2026",
    "description": "...",
    "level": "DISTRICT",
    "categories": ["OPEN", "UNDER_11", "UNDER_13"],
    "timeControl": "RAPID",
    "format": "Swiss 7 Rounds",
    "dates": {
      "registrationStart": "2026-02-01",
      "registrationEnd": "2026-02-20",
      "tournamentStart": "2026-03-01",
      "tournamentEnd": "2026-03-02"
    },
    "venue": {
      "name": "Town Hall",
      "address": "...",
      "city": "Kallakurichi",
      "mapUrl": "https://maps.google.com/..."
    },
    "fees": {
      "entryFee": 200,
      "lateFee": 50,
      "lateFeeDate": "2026-02-15"
    },
    "prizes": [
      { "position": 1, "amount": 10000, "trophy": true },
      { "position": 2, "amount": 7000, "trophy": true }
    ],
    "organization": {
      "id": "uuid",
      "name": "KDCA",
      "logoUrl": "..."
    },
    "status": "REGISTRATION_OPEN",
    "stats": {
      "maxParticipants": 200,
      "registered": 85
    },
    "chiefArbiter": "FA John Doe",
    "contact": {
      "email": "tournament@kallaichess.com",
      "phone": "9876543210"
    }
  }
}
```

### 6.3 Create Tournament
```
POST /tournaments
```
**Auth Required:** Yes (Organization Admin)

**Request Body:**
```json
{
  "name": "Monthly Rapid Tournament",
  "description": "...",
  "level": "TALUK",
  "categories": ["OPEN"],
  "timeControl": "RAPID",
  "format": "Swiss 5 Rounds",
  "registrationStart": "2026-02-01",
  "registrationEnd": "2026-02-10",
  "tournamentStart": "2026-02-15",
  "tournamentEnd": "2026-02-15",
  "venueName": "Community Hall",
  "venueAddress": "...",
  "maxParticipants": 50,
  "entryFee": 100
}
```

### 6.4 Update Tournament
```
PATCH /tournaments/:id
```
**Auth Required:** Yes (Organization Admin, only own tournaments)

### 6.5 Submit Tournament for Approval
```
POST /tournaments/:id/submit
```
**Auth Required:** Yes (Organization Admin)

### 6.6 Approve/Reject Tournament (Admin)
```
POST /tournaments/:id/approve
```
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "approved": true,
  "comments": "Approved for district level"
}
```

### 6.7 Register for Tournament
```
POST /tournaments/:id/register
```
**Auth Required:** Yes (Player)

**Request Body:**
```json
{
  "category": "UNDER_13"
}
```

### 6.8 Get Tournament Registrations
```
GET /tournaments/:id/registrations?category=OPEN&page=1
```

### 6.9 Cancel Registration
```
DELETE /tournaments/:id/registrations/:registrationId
```
**Auth Required:** Yes (Own registration or Admin)

### 6.10 Update Tournament Results
```
POST /tournaments/:id/results
```
**Auth Required:** Yes (Organization Admin)

**Request Body:**
```json
{
  "results": [
    { "userId": "uuid", "rank": 1, "score": 6.5, "tiebreak1": 28.5, "prize": "1st Place - ₹10,000" },
    { "userId": "uuid", "rank": 2, "score": 6.0, "tiebreak1": 27.0, "prize": "2nd Place - ₹7,000" }
  ]
}
```

### 6.11 Publish Results
```
POST /tournaments/:id/publish-results
```
**Auth Required:** Yes (Organization Admin)

---

## 7. PAYMENT ENDPOINTS

### 7.1 Initiate Membership Payment
```
POST /payments/membership
```
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "orderId": "KDCA_MEM_20260127_001",
    "amount": 75,
    "currency": "INR",
    "gatewayUrl": "https://hdfc.gateway.com/...",
    "gatewayParams": { ... }
  }
}
```

### 7.2 Initiate Tournament Payment
```
POST /payments/tournament
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "tournamentId": "uuid",
  "registrationId": "uuid"
}
```

### 7.3 Payment Callback (Gateway)
```
POST /payments/callback
```
Called by payment gateway. Updates payment status.

### 7.4 Payment Webhook
```
POST /payments/webhook
```
For asynchronous payment status updates.

### 7.5 Get Payment Status
```
GET /payments/:orderId/status
```
**Auth Required:** Yes

### 7.6 Payment History
```
GET /payments/history?page=1&limit=20
```
**Auth Required:** Yes

### 7.7 Download Receipt
```
GET /payments/:id/receipt
```
**Auth Required:** Yes

---

## 8. CONTENT ENDPOINTS (CMS)

### 8.1 List Content (Public)
```
GET /content?type=NEWS&limit=10
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | NEWS, ANNOUNCEMENT, PAGE, BANNER |
| tag | string | Filter by tag |
| featured | boolean | Featured content only |
| page | number | Page number |
| limit | number | Items per page |

### 8.2 Get Content by Slug
```
GET /content/:slug
```

### 8.3 Create Content (Admin)
```
POST /content
```
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "type": "NEWS",
  "title": "KDCA Announces New Tournament Calendar",
  "excerpt": "Exciting new tournaments planned for 2026...",
  "body": "<p>Full HTML content...</p>",
  "featuredImage": "https://...",
  "tags": ["tournaments", "announcements"],
  "isPinned": false,
  "showOnHome": true,
  "status": "PUBLISHED",
  "publishedAt": "2026-01-27T10:00:00Z"
}
```

### 8.4 Update Content
```
PATCH /content/:id
```
**Auth Required:** Yes (Admin)

### 8.5 Delete Content
```
DELETE /content/:id
```
**Auth Required:** Yes (Admin)

### 8.6 Get Homepage Data
```
GET /content/homepage
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Welcome to KDCA",
      "subtitle": "Nurturing Chess Champions",
      "imageUrl": "...",
      "ctaText": "Register Now",
      "ctaLink": "/register"
    },
    "announcements": [ ... ],
    "upcomingTournaments": [ ... ],
    "recentNews": [ ... ],
    "featuredPlayers": [ ... ],
    "stats": {
      "totalPlayers": 1250,
      "totalTournaments": 45,
      "totalAcademies": 8,
      "totalTaluks": 6
    },
    "testimonials": [ ... ]
  }
}
```

---

## 9. MEDIA/FILE ENDPOINTS

### 9.1 Upload File
```
POST /media/upload
```
**Auth Required:** Yes
**Content-Type:** multipart/form-data

**Form Fields:**
- `file`: File to upload
- `purpose`: MediaPurpose enum
- `entityType`: Entity type (user, organization, etc.)
- `entityId`: Entity ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "photo_abc123.jpg",
    "fileUrl": "https://cdn.kallaichess.com/uploads/photo_abc123.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 245678,
    "thumbnails": {
      "small": "https://...",
      "medium": "https://..."
    }
  }
}
```

### 9.2 Delete File
```
DELETE /media/:id
```
**Auth Required:** Yes (Owner or Admin)

### 9.3 Get Gallery
```
GET /media/gallery?entityType=tournament&entityId=uuid
```

---

## 10. ADMIN ENDPOINTS

### 10.1 Admin Dashboard
```
GET /admin/dashboard
```
**Auth Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "activeMembers": 890,
      "pendingApprovals": 15,
      "totalRevenue": 125000,
      "revenueThisMonth": 15000
    },
    "charts": {
      "membershipTrend": [ ... ],
      "tournamentStats": [ ... ],
      "revenueChart": [ ... ]
    },
    "recentActivities": [ ... ],
    "pendingTasks": [ ... ]
  }
}
```

### 10.2 List All Users (Admin)
```
GET /admin/users?role=PLAYER&status=ACTIVE&page=1
```
**Auth Required:** Yes (Admin)

### 10.3 Update User Status (Admin)
```
PATCH /admin/users/:id/status
```
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "status": "ACTIVE",
  "reason": "Approved after verification"
}
```

### 10.4 Approve Arbiter
```
POST /admin/users/:id/approve-arbiter
```
**Auth Required:** Yes (Admin)

### 10.5 Approve Organization
```
POST /admin/organizations/:id/approve
```
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "approved": true,
  "comments": "All documents verified"
}
```

### 10.6 Payment Reports
```
GET /admin/reports/payments?from=2026-01-01&to=2026-01-31
```
**Auth Required:** Yes (Admin)

### 10.7 Export Data
```
GET /admin/export/players?format=csv
```
**Auth Required:** Yes (Admin)

### 10.8 System Settings
```
GET /admin/settings
PATCH /admin/settings
```
**Auth Required:** Yes (Super Admin)

### 10.9 Audit Logs
```
GET /admin/audit-logs?userId=uuid&action=LOGIN&page=1
```
**Auth Required:** Yes (Admin)

---

## 11. PUBLIC DATA ENDPOINTS

### 11.1 Get Taluks
```
GET /public/taluks
```

### 11.2 Get Site Settings
```
GET /public/settings
```

### 11.3 Get Statistics
```
GET /public/stats
```

### 11.4 Downloads List
```
GET /public/downloads
```

### 11.5 Contact Form
```
POST /public/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Tournament Inquiry",
  "message": "I would like to know..."
}
```

---

## 12. WEBHOOK ENDPOINTS (Internal)

### 12.1 HDFC Payment Webhook
```
POST /webhooks/hdfc
```

### 12.2 Email Delivery Status
```
POST /webhooks/email-status
```

---

## 13. API VERSIONING

All endpoints are versioned under `/v1`. Future breaking changes will be released under `/v2`, etc.

### Deprecation Policy
- Deprecated endpoints marked with `X-Deprecated: true` header
- Minimum 6 months notice before removal
- Migration guides provided for breaking changes

---

*Next Document: 04-UI-UX-DESIGN-SYSTEM.md*
