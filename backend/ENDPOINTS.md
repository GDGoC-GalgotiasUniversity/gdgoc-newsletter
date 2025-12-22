# API Endpoints Documentation

## Base URL
```
http://localhost:5000
```

---

## Endpoints Overview

| # | Method | Endpoint | Description | Auth | Status |
|---|--------|----------|-------------|------|--------|
| 1 | `POST` | `/auth/signin` | Login (admin/reader) | No | 200/401 |
| 2 | `POST` | `/auth/signup` | Register reader account | No | 201/400 |
| 3 | `POST` | `/auth/verify` | Verify JWT token | Yes | 200/401 |
| 4 | `POST` | `/auth/logout` | Logout user | Yes | 200 |
| 5 | `GET` | `/api/newsletters` | Get all published newsletters | No | 200 |
| 6 | `GET` | `/api/newsletters/:slug` | Get single newsletter by slug | No | 200/404 |
| 7 | `POST` | `/admin/newsletters` | Create newsletter | Yes (Admin) | 201/400/403 |
| 8 | `PUT` | `/admin/newsletters/:id` | Update newsletter | Yes (Admin) | 200/400/403/404 |
| 9 | `DELETE` | `/admin/newsletters/:id` | Delete newsletter | Yes (Admin) | 200/403/404 |

**Legend:**
- **Auth**: Whether authentication is required (JWT token in Authorization header)
- **Yes (Admin)**: Requires JWT token + admin role
- **Status**: HTTP status codes for success/error responses

---

## Authentication Endpoints

### 1. Sign In (Admin or Reader)
**Endpoint**: `POST /auth/signin`

**Description**: Unified login for both admin (hardcoded) and readers (DB stored)

**Request Body**:
```json
{
  "email": "gdgocgu@gmail.com",
  "password": "1234@"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "admin",
  "message": "Sign in successful"
}
```

**Response (Failure - Wrong Credentials)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status Codes**:
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing email/password

**Database Interaction**:
- First checks hardcoded admin credentials
- If not admin, queries Users collection for reader email
- Compares password hash using bcryptjs
- Returns JWT token on success

---

### 2. Sign Up (Reader Only)
**Endpoint**: `POST /auth/signup`

**Description**: Register new reader account (admin registration not allowed)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "reader",
  "message": "Sign up successful"
}
```

**Response (Failure - Duplicate Email)**:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Response (Failure - Admin Email)**:
```json
{
  "success": false,
  "message": "Admin email cannot be used for signup"
}
```

**Status Codes**:
- `201 Created` - Account created successfully
- `400 Bad Request` - Duplicate email, invalid email, or weak password
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Checks if email already exists in Users collection
- Prevents registration with admin email (gdgocgu@gmail.com)
- Validates password minimum 6 characters
- Hashes password with bcryptjs before storing
- Creates new document in Users collection
- Returns JWT token

**Validations**:
- Email: Valid format required
- Password: Minimum 6 characters
- Name: Required
- Admin email: Blocked (gdgocgu@gmail.com)

---

### 3. Verify Token
**Endpoint**: `POST /auth/verify`

**Description**: Verify if JWT token is valid

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (Valid Token)**:
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "email": "john@example.com",
    "role": "reader"
  }
}
```

**Response (Invalid Token)**:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Status Codes**:
- `200 OK` - Token is valid
- `401 Unauthorized` - Token missing, invalid, or expired

**Token Details**:
- Expires in: 7 days
- Algorithm: HS256
- Payload: email, role

---

### 4. Logout
**Endpoint**: `POST /auth/logout`

**Description**: Logout (client-side token removal)

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes**:
- `200 OK` - Logout successful

**Note**: Token is not revoked on server (stateless JWT). Client must remove token from localStorage.

---

## Newsletter Endpoints (Public)

### 5. Get All Published Newsletters
**Endpoint**: `GET /api/newsletters`

**Description**: Retrieve all published newsletters (public, no auth required)

**Query Parameters**:
```
?limit=10&skip=0&sort=newest
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "GDG December Meeting",
      "slug": "gdg-december-meeting",
      "excerpt": "Join us for our December meetup",
      "contentMarkdown": "## Meeting Details\n\nCome join us...",
      "template": "announcement",
      "status": "published",
      "publishedAt": "2025-12-20T10:00:00Z",
      "createdAt": "2025-12-15T08:30:00Z",
      "updatedAt": "2025-12-20T10:00:00Z"
    }
  ],
  "count": 15,
  "message": "Newsletters retrieved successfully"
}
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Queries Newsletters collection with filter: `status: "published"`
- Sorts by `createdAt` descending (newest first)
- Returns array of all published newsletters
- Uses `status` index for fast filtering

---

### 6. Get Single Newsletter by Slug
**Endpoint**: `GET /api/newsletters/:slug`

**Description**: Retrieve a specific published newsletter by URL slug

**URL Parameters**:
```
:slug = "gdg-december-meeting"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "GDG December Meeting",
    "slug": "gdg-december-meeting",
    "excerpt": "Join us for our December meetup",
    "contentMarkdown": "## Meeting Details\n\nCome join us...",
    "template": "announcement",
    "status": "published",
    "publishedAt": "2025-12-20T10:00:00Z",
    "createdAt": "2025-12-15T08:30:00Z"
  },
  "message": "Newsletter retrieved successfully"
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "message": "Newsletter not found"
}
```

**Status Codes**:
- `200 OK` - Newsletter found
- `404 Not Found` - Newsletter not found
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Queries Newsletters collection with filter: `slug: slug, status: "published"`
- Uses `slug` index for fast lookup
- Returns single newsletter document
- Only returns published newsletters

---

## Newsletter Endpoints (Admin Only)

All admin endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Where the token must be from an admin account (hardcoded admin).

---

### 7. Create Newsletter
**Endpoint**: `POST /admin/newsletters`

**Description**: Create a new newsletter (admin only)

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "GDG December Recap",
  "slug": "gdg-december-recap",
  "excerpt": "Summary of our December meeting",
  "contentMarkdown": "## Meeting Summary\n\n- Attended by 50 people\n- Discussed latest tech trends",
  "template": "event-recap",
  "status": "draft"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Newsletter created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "GDG December Recap",
    "slug": "gdg-december-recap",
    "excerpt": "Summary of our December meeting",
    "contentMarkdown": "## Meeting Summary\n\n- Attended by 50 people\n- Discussed latest tech trends",
    "template": "event-recap",
    "status": "draft",
    "publishedAt": null,
    "createdAt": "2025-12-20T10:00:00Z",
    "updatedAt": "2025-12-20T10:00:00Z"
  }
}
```

**Response (Duplicate Slug)**:
```json
{
  "success": false,
  "message": "Slug \"gdg-december-recap\" already exists"
}
```

**Response (Validation Error)**:
```json
{
  "success": false,
  "message": "Validation error: Slug must be lowercase with hyphens only"
}
```

**Status Codes**:
- `201 Created` - Newsletter created successfully
- `400 Bad Request` - Validation error or duplicate slug
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - User is not admin
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Inserts new document into Newsletters collection
- Validates all fields against schema
- Enforces slug uniqueness
- Creates indexes for slug (unique) and status
- Auto-adds timestamps (createdAt, updatedAt)
- publishedAt stays null until status changes to "published"

**Field Validations**:
- `title`: Required, 3-200 characters
- `slug`: Required, unique, lowercase with hyphens only
- `excerpt`: Optional, max 500 characters
- `contentMarkdown`: Required, minimum 10 characters
- `template`: Required, must be: event-recap, workshop, announcement, or default
- `status`: Optional, default "draft", must be: draft or published

---

### 8. Update Newsletter
**Endpoint**: `PUT /admin/newsletters/:id`

**Description**: Update existing newsletter (admin only)

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**URL Parameters**:
```
:id = "507f1f77bcf86cd799439011"
```

**Request Body** (partial update):
```json
{
  "title": "Updated Title",
  "contentMarkdown": "## Updated Content\n\nNew content here...",
  "status": "published"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Newsletter updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "slug": "gdg-december-recap",
    "contentMarkdown": "## Updated Content\n\nNew content here...",
    "template": "event-recap",
    "status": "published",
    "publishedAt": "2025-12-20T10:15:00Z",
    "updatedAt": "2025-12-20T10:15:00Z"
  }
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "message": "Newsletter not found"
}
```

**Status Codes**:
- `200 OK` - Newsletter updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - No token
- `403 Forbidden` - Not admin
- `404 Not Found` - Newsletter not found
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Uses `findByIdAndUpdate` to update document
- Validates all fields
- Auto-updates `updatedAt` timestamp
- If `status` changes to "published", auto-sets `publishedAt` (only once)
- Returns updated document

**Important Notes**:
- Slug can only be updated if new slug is not already taken
- Once published, `publishedAt` timestamp cannot be changed
- All fields are optional for update (partial updates allowed)

---

### 9. Delete Newsletter
**Endpoint**: `DELETE /admin/newsletters/:id`

**Description**: Delete a newsletter (admin only)

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**URL Parameters**:
```
:id = "507f1f77bcf86cd799439011"
```

**Response**:
```json
{
  "success": true,
  "message": "Newsletter deleted successfully"
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "message": "Newsletter not found"
}
```

**Status Codes**:
- `200 OK` - Newsletter deleted successfully
- `401 Unauthorized` - No token
- `403 Forbidden` - Not admin
- `404 Not Found` - Newsletter not found
- `500 Internal Server Error` - Server error

**Database Interaction**:
- Uses `findByIdAndDelete` to remove document from Newsletters collection
- Removes associated indexes
- Cannot be undone (no soft delete)

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## Authentication Flow

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ POST /auth/signin
       │ {email, password}
       ▼
┌──────────────────────────┐
│   routes/auth.js         │
│   Check credentials      │
└──────┬───────────────────┘
       │
       │ Query Users collection
       │ Check admin hardcoded
       ▼
┌──────────────────────────┐
│   MongoDB               │
│   Users collection      │
└──────┬───────────────────┘
       │
       │ Password hash match
       ▼
┌──────────────────────────┐
│   Generate JWT Token     │
│   {email, role}          │
│   Expires: 7 days        │
└──────┬───────────────────┘
       │
       │ Return token
       ▼
┌──────────────┐
│   Client     │
│ Stores token │
│ localStorage │
└──────────────┘
```

---

## API Rate Limiting

Currently: **No rate limiting**

Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS Configuration

Allowed Origins:
```
http://localhost:3000 (frontend)
```

Configure in `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## Testing Endpoints

See `db_test.md` for curl commands to test all endpoints.
