# Database Layer (`db/`)

This folder contains all MongoDB/Mongoose database configurations, schemas, and models for the GDG Newsletter Platform.

## 📁 Folder Structure

```
db/
├── connection.js          # MongoDB connection setup
├── models/
│   ├── User.js           # User schema & model
│   ├── Newsletter.js     # Newsletter schema & model
│   └── index.js          # Models export index
├── config.js             # Database configuration & rules
└── README.md             # This file
```

## 🗂️ Collections

### Users Collection

Stores admin and reader user accounts.

**Schema:**
```javascript
{
  _id,                    // MongoDB auto-generated
  name,                   // User's full name (required)
  email,                  // Unique email (required)
  passwordHash,           // Bcrypt-hashed (required, never plain text)
  role,                   // "admin" or "reader" (default: "reader")
  createdAt,              // Auto-generated timestamp
  updatedAt               // Auto-generated timestamp
}
```

**Rules:**
- Email must be unique across all users
- Email must be valid format
- Password is automatically hashed using bcrypt
- Role is strictly limited to "admin" or "reader"
- Password hash is never returned in API responses by default

---

### Newsletters Collection

Stores all newsletters with Markdown content.

**Schema:**
```javascript
{
  _id,                    // MongoDB auto-generated
  title,                  // Newsletter title (required)
  slug,                   // URL-friendly identifier (required, unique)
  excerpt,                // Short summary (optional)
  contentMarkdown,        // Markdown formatted content (required)
  template,               // Template type (required)
  status,                 // "draft" or "published" (default: "draft")
  publishedAt,            // Timestamp when published
  createdAt,              // Auto-generated timestamp
  updatedAt               // Auto-generated timestamp
}
```

**Rules:**
- Slug must be unique (enforced at DB level)
- Slug must be lowercase with hyphens only (no spaces or special characters)
- Slug does not change after publishing (stability requirement)
- Each newsletter must have its own URL route
- Content is stored as Markdown, not HTML
- Template must be one of: `event-recap`, `workshop`, `announcement`, or `default`
- `publishedAt` is automatically set when status changes to "published"
- No deep nesting, no temporary fields, no frontend state stored

---

## 🚀 Usage

### Connect to Database

```javascript
const connectDB = require('./db/connection');

// In your main app file (e.g., server.js)
connectDB();
```

### Import Models

```javascript
const { User, Newsletter } = require('./db/models');

// Or import individually
const User = require('./db/models/User');
const Newsletter = require('./db/models/Newsletter');
```

### Create a User

```javascript
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'plaintextpassword123', // Will be hashed automatically
  role: 'admin'
});
```

### Compare Password

```javascript
const user = await User.findById(userId).select('+passwordHash');
const isValid = await user.comparePassword('plaintextpassword123');
```

### Create a Newsletter

```javascript
const newNewsletter = await Newsletter.create({
  title: 'Cloud Study Jams Query Session',
  slug: 'cloud-study-jams-query-session',
  excerpt: 'Learn about Cloud SQL and querying basics',
  contentMarkdown: '## Session Highlights\n\n...',
  template: 'workshop',
  status: 'draft'
});
```

### Publish a Newsletter

```javascript
const newsletter = await Newsletter.findById(newsletterId);
newsletter.status = 'published';
await newsletter.save(); // publishedAt is set automatically
```

### Find Published Newsletters

```javascript
const published = await Newsletter.find({ status: 'published' })
  .sort({ createdAt: -1 });
```

---

## 📋 Database Rules (NON-NEGOTIABLE)

✅ **MUST HAVE:**
- Every collection must have a Mongoose schema
- Slugs must be unique (enforced at database level with unique index)
- All required fields must be enforced by schema validation
- Input validation on all fields
- Role-based access control (admin vs reader)

❌ **NOT ALLOWED:**
- No deep nesting of documents
- No random or temporary fields
- No storing frontend state in database
- No plain text passwords
- No modification of immutable fields (like slug) after creation

---

## 🔐 Security Notes

- Passwords are hashed using bcrypt with salt rounds = 10
- Password hash is never returned in queries by default (select: false)
- Email uniqueness is enforced at database level
- Mongoose strict mode is enabled to prevent unexpected fields

---

## 📦 Dependencies

Required packages (add to `package.json`):
```json
{
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3"
}
```

---

## 🔗 Related Files

- Frontend routing: See `frontend/` for route configuration
- API endpoints: See `backend/` for Express server setup
- Environment variables: Set `MONGODB_URI` in `.env`

---

## 📝 Notes

- MongoDB is used with **strict structure** via Mongoose schemas
- MongoDB ≠ no structure - we enforce structure rigorously
- All timestamps are auto-managed by Mongoose
- Indexes are created for performance optimization
