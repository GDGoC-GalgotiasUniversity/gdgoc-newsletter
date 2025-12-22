# Database Setup & Configuration

## Overview
The GDG Newsletter Platform uses **MongoDB Atlas** (cloud-hosted) as the primary database with **Mongoose ODM** for schema validation and data management.

---

## Database Connection

### Connection Method
- **Provider**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose v7.x
- **Connection Type**: Replica Set (Production)
- **Connection String Format**: `mongodb+srv://username:password@cluster/database`  // see env.png for variables

### Connection File
**Location**: `db/connection.js`

```javascript
const mongoose = require('mongoose');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Global strict mode enforcement
mongoose.set('strict', true);
```

**Connection Flow**:
1. Loads `MONGODB_URI` from `.env` file
2. Establishes connection to MongoDB Atlas cluster
3. Enables strict schema validation
4. Logs success/error messages to console

---

## Environment Variables

### Required Keys (see .env file)

```
MONGODB_URI=mongodb+srv://gdgocgu:gdgoc%40newsletter@gdgoc.kqtg5.mongodb.net/gdgocgu?retryWrites=true&w=majority

MONGODB_TEST_URI=mongodb+srv://gdgocgu:gdgoc%40newsletter@gdgoc.kqtg5.mongodb.net/gdgocgu_test?retryWrites=true&w=majority

ADMIN_EMAIL=gdgocgu@gmail.com
ADMIN_PASSWORD=1234@

JWT_SECRET=gdgoc-newsletter-secret

PORT=5000
```

### Variable Descriptions
- `MONGODB_URI`: Connection string to **production database** (`gdgocgu`)
- `MONGODB_TEST_URI`: Connection string to **test database** (`gdgocgu_test`)
- `ADMIN_EMAIL`: Hardcoded admin email (not stored in DB)
- `ADMIN_PASSWORD`: Hardcoded admin password (not stored in DB)
- `JWT_SECRET`: Secret key for JWT token signing (7-day expiration)
- `PORT`: Server port (default: 5000)

---

## Database Structure

### Databases
1. **Production**: `gdgocgu`
2. **Testing**: `gdgocgu_test`

### Collections

#### 1. Users Collection
**Purpose**: Stores admin and reader accounts

**Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  passwordHash: String (bcrypt hashed),
  role: String (enum: "admin" | "reader"),
  createdAt: Date,
  updatedAt: Date
}
```

**Validation**:
- Email format validation
- Unique email constraint
- Password minimum 6 characters
- Role enum enforcement
- Automatic timestamps

**Indexes**:
- `email` (Unique) - Prevents duplicate accounts

**Important**:
- Admin account is NOT stored in this collection
- Admin credentials are hardcoded in `.env` file
- Only readers are dynamically registered in DB

---

#### 2. Newsletters Collection
**Purpose**: Stores newsletter content with metadata

**Fields**:
```javascript
{
  _id: ObjectId,
  title: String (required, 3-200 chars),
  slug: String (required, unique, lowercase-hyphens-only),
  excerpt: String (optional, max 500 chars),
  contentMarkdown: String (required, min 10 chars),
  template: String (enum: "event-recap" | "workshop" | "announcement" | "default"),
  status: String (enum: "draft" | "published", default: "draft"),
  publishedAt: Date (auto-set when status = "published"),
  createdAt: Date,
  updatedAt: Date
}
```

**Validation**:
- Slug must match pattern: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (lowercase letters, numbers, hyphens only)
- Template must be one of the 4 enum values
- Status must be "draft" or "published"
- Content minimum 10 characters
- Title 3-200 characters
- Excerpt max 500 characters

**Indexes** (6 total):
1. `_id` (Primary) - Auto-created by MongoDB
2. `slug` (Unique) - Ensures slug uniqueness, allows fast lookups
3. `status` (Regular) - Optimizes published newsletter queries
4. `createdAt` (Descending) - Optimizes date-based sorting

**Important**:
- `publishedAt` is automatically set when `status` changes to "published"
- Cannot be manually set during creation
- Slug is permanent once created (prevents URL changes)
- Markdown content is stored as-is (rendered on frontend)

---

## Database Models

### User Model
**File**: `db/models/User.js`

**Features**:
- Bcrypt password hashing (auto-hashed on save)
- `comparePassword()` method for authentication
- Email uniqueness enforcement
- Role-based (admin/reader)

**Methods**:
```javascript
// Hash password before save
pre('save', function(next) {
  // bcrypt.hash(password, salt)
})

// Compare provided password with hash
comparePassword(password) {
  // bcrypt.compare(password, hash)
}
```

### Newsletter Model
**File**: `db/models/Newsletter.js`

**Features**:
- Slug validation (lowercase, hyphens only)
- Auto `publishedAt` timestamp
- Template enum validation
- Status enum validation
- Markdown content validation

**Middleware**:
```javascript
pre('save', function(next) {
  // Sets publishedAt when status changes to "published"
})
```

---

## MongoDB Atlas Setup

### Cluster Information
- **Cluster**: `gdgoc.kqtg5.mongodb.net`
- **Provider**: MongoDB Atlas
- **Region**: Default

### Access Control
- **Username**: `gdgocgu`
- **Password**: `gdgoc@newsletter` (URL-encoded as `gdgoc%40newsletter`)
- **Authentication Method**: SCRAM

### IP Whitelist
- Allows connections from any IP (0.0.0.0/0)
- For production, restrict to specific IPs

---

## Connection Flow Diagram

```
┌─────────────┐
│  .env file  │
└──────┬──────┘
       │ MONGODB_URI
       ▼
┌─────────────────────────┐
│  db/connection.js       │
│  mongoose.connect()     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  MongoDB Atlas          │
│  - gdgocgu (production) │
│  - gdgocgu_test (test)  │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Collections            │
│  - Users                │
│  - Newsletters          │
└─────────────────────────┘
```

---

## Common Operations

### Connect to Database
```javascript
const db = require('./db/connection');
const { User, Newsletter } = require('./db/models');
```

### Create User
```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepass123', // Auto-hashed
  role: 'reader'
});
```

### Create Newsletter
```javascript
const newsletter = await Newsletter.create({
  title: 'GDG Meeting',
  slug: 'gdg-meeting-dec',
  contentMarkdown: '## Content here',
  template: 'announcement',
  status: 'draft'
});
```

### Update Newsletter Status
```javascript
const newsletter = await Newsletter.findByIdAndUpdate(
  id,
  { status: 'published' }, // publishedAt auto-set
  { new: true }
);
```

### Query Published Newsletters
```javascript
const published = await Newsletter.find({ status: 'published' })
  .sort({ createdAt: -1 })
  .limit(10);
```

---

## Error Handling

### Common Errors

**E11000 Duplicate Key Error**
```
Error: E11000 duplicate key error collection: gdgocgu.newsletters index: slug_1
```
- Cause: Duplicate slug
- Solution: Use unique slug

**Validation Error**
```
Error: Newsletter validation failed: slug: Slug must be lowercase with hyphens only
```
- Cause: Invalid slug format
- Solution: Use only lowercase letters, numbers, and hyphens

**Connection Error**
```
MongooseError: Cannot connect to MongoDB Atlas
```
- Cause: Wrong credentials, IP not whitelisted, or network issue
- Solution: Check `.env` variables, IP whitelist settings

---

## Performance Considerations

### Indexes
- Slug index ensures fast lookups by URL
- Status index optimizes filtering published newsletters
- CreatedAt index enables efficient date-based sorting

### Query Optimization
```javascript
// Good: Uses status index
Newsletter.find({ status: 'published' })

// Good: Uses slug index
Newsletter.findOne({ slug: 'my-newsletter' })

// Less efficient: No index
Newsletter.find({ title: 'GDG Meeting' })
```

### Data Limits
- No enforced storage limits (MongoDB Atlas limits apply)
- Recommended: Archive old newsletters after 1 year

---

## Backup & Recovery

### MongoDB Atlas Backups
- Automatic snapshots every 6 hours
- Manual backups available in Atlas dashboard
- Point-in-time recovery for 7 days

### Data Export
```bash
# Export users collection
mongoexport --uri "mongodb+srv://..." --collection users --out users.json

# Export newsletters collection
mongoexport --uri "mongodb+srv://..." --collection newsletters --out newsletters.json
```

---

## Security

### Password Security
- User passwords: Hashed with bcryptjs (salt rounds: 10)
- Admin password: Stored only in `.env` file (never in DB)
- JWT tokens: 7-day expiration

### Database Permissions
- Admin users can create/edit/delete newsletters
- Readers can only view published newsletters
- Role-based access control enforced at API level

### Environment Variables
- Never commit `.env` file to git
- `.env.example` shows required variables
- Sensitive data: MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD

---

## Troubleshooting

**Q: Connection times out**
- A: Check MongoDB Atlas IP whitelist, verify credentials in `.env`

**Q: Can't insert documents**
- A: Check validation rules, ensure required fields are provided

**Q: Queries are slow**
- A: Check indexes, consider adding indexes for frequently filtered fields

**Q: Admin login not working**
- A: Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match your login credentials
