# Database Testing Documentation

## Overview
The GDG Newsletter Platform uses automated testing with Node.js HTTP module to verify all 20 API endpoints and database operations. All tests run against the **production database** (`gdgocgu`).

---

## Test Architecture

### Testing Tool
- **Framework**: Pure Node.js `http` module (no external test framework)
- **Why**: Lightweight, no Jest/Mocha dependencies, direct HTTP testing
- **Test File**: `db_tests/test.js`

### Test Database
- **Environment**: Production database (gdgocgu)
- **Type**: Real database testing (not mocked)
- **Data**: Fresh data created per test run
- **Cleanup**: No automatic cleanup (tests create data, don't delete)

### Test Count
- **Total Tests**: 20
- **Categories**: 
  - Authentication (5 tests)
  - Public API (2 tests)
  - Admin Newsletter Operations (5 tests)
  - Access Control (3 tests)
  - Validation (5 tests)

---

## Running Tests

### Prerequisites
```bash
# 1. Node.js installed (v14+)
# 2. Backend server running
npm run dev

# 3. In another terminal, navigate to backend folder
cd backend
```

### Run All Tests
```bash
npm run test
```

**Output Example**:
```
════════════════════════════════════════
   GDG Newsletter API - Test Suite
════════════════════════════════════════

[Test 1] Admin Sign-In (Hardcoded)
✅ PASS - Admin login with correct credentials

[Test 2] Wrong Credentials
✅ PASS - Reject wrong credentials

... (18 more tests)

════════════════════════════════════════
   Test Summary
════════════════════════════════════════
✅ Passed: 20
❌ Failed: 0
Total Tests: 20

🎉 ALL TESTS PASSED! 🎉
Backend API is fully functional!
```

### Exit Codes
- `0` - All tests passed
- `1` - One or more tests failed

---

## Test Configuration

### Base URL
```javascript
const BASE_URL = 'http://localhost:5000';
```
Update if server runs on different port.

### Test Database
Tests create data with unique identifiers:
```javascript
const randomId = Math.random().toString(36).substring(2, 8);
const slug = `test-slug-${randomId}`;
```

This prevents duplicate key errors across test runs.

---

## Test Details

### Authentication Tests (Tests 1-5)

#### Test 1: Admin Sign-In
```
Input: 
  Email: gdgocgu@gmail.com
  Password: 1234@

Database: 
  No query (hardcoded credentials)

Expected:
  Status: 200
  Response: {success: true, token: "...", role: "admin"}

Validates:
  - Hardcoded admin login works
  - JWT token generated
  - Role is "admin"
```

#### Test 2: Wrong Credentials
```
Input:
  Email: wrong@example.com
  Password: wrongpass

Database:
  Queries Users collection (not found)

Expected:
  Status: 401
  Response: {success: false}

Validates:
  - Invalid credentials rejected
  - No token returned
```

#### Test 3: Reader Sign-Up
```
Input:
  Name: Test Reader
  Email: reader<timestamp>@test.com
  Password: pass123

Database:
  1. Checks Users collection for email (not found)
  2. Checks admin email (not blocked)
  3. Hashes password with bcrypt
  4. Inserts new document into Users collection
  5. Creates index on email (unique)

Expected:
  Status: 201
  Response: {success: true, token: "...", role: "reader"}

Validates:
  - Reader account created
  - Password hashed
  - JWT token generated
```

#### Test 4: Duplicate Email Prevention
```
Input:
  First signup: reader<timestamp>@test.com
  Second signup: same email

Database:
  1st request: Creates user in Users collection
  2nd request: Unique index on email prevents duplicate

Expected:
  2nd request status: 400
  Message: "Email already registered"

Validates:
  - Unique email constraint enforced
  - Database prevents duplicates
```

#### Test 5: Reader Sign-In
```
Input:
  Create reader, then sign in with credentials

Database:
  1. Create user in Users collection (password hashed)
  2. Sign in: Query Users collection by email
  3. Compare password with bcrypt.compare()

Expected:
  Status: 200
  Response: {success: true, token: "...", role: "reader"}

Validates:
  - Reader login works
  - Password comparison works
```

---

### Public API Tests (Tests 6-7)

#### Test 6: Get All Published Newsletters
```
Database:
  Query Newsletters collection with filter: {status: "published"}

Expected:
  Status: 200
  Response: {success: true, data: [...]}
  Data is array of newsletters

Validates:
  - Public endpoint works without auth
  - Returns only published newsletters
  - Uses status index
```

#### Test 7: Get Single Newsletter by Slug
```
Input:
  1. Create newsletter with unique slug
  2. GET /api/newsletters/{slug}

Database:
  Query Newsletters collection: {slug: slug, status: "published"}

Expected:
  Status: 200
  Response: {success: true, data: {...}}
  Newsletter has matching slug

Validates:
  - Slug lookup works
  - Uses slug index
  - Only published newsletters returned
```

---

### Admin Newsletter Operations (Tests 8-9, 12-13, 18)

#### Test 8: Duplicate Slug Prevention
```
Input:
  1. Create newsletter with slug: duplicate-slug-abc123
  2. Try to create another with same slug

Database:
  1st request: Inserts into Newsletters, creates unique slug index
  2nd request: Unique slug index rejects duplicate

Expected:
  2nd request: Status 400, message includes "already exists"

Validates:
  - Slug uniqueness enforced
  - Database prevents duplicates
  - E11000 error handled correctly
```

#### Test 9: Create Newsletter
```
Input:
  Title, slug, contentMarkdown, template, status

Database:
  Inserts new document into Newsletters collection
  Auto-creates indexes:
    - slug (unique)
    - status (regular)
    - createdAt (descending)
  Auto-adds timestamps: createdAt, updatedAt

Expected:
  Status: 201
  Response includes _id, all fields, timestamps

Validates:
  - Newsletter creation works
  - Validation rules applied
  - Indexes created
  - Timestamps auto-added
```

#### Test 12: Update Newsletter
```
Input:
  Existing newsletter ID
  New title, contentMarkdown

Database:
  findByIdAndUpdate() on Newsletters collection
  Validation runs
  updatedAt timestamp auto-updated

Expected:
  Status: 200
  Title changed, other fields unchanged

Validates:
  - Update works
  - Partial updates allowed
  - Timestamp updated
```

#### Test 13: Delete Newsletter
```
Input:
  Newsletter ID

Database:
  findByIdAndDelete() removes from Newsletters collection
  Indexes cleaned up

Expected:
  Status: 200
  Message: "Newsletter deleted successfully"

Validates:
  - Delete works
  - Document removed from database
```

#### Test 18: Publish Newsletter
```
Input:
  Create draft newsletter
  Update status to "published"

Database:
  1. Create: status="draft", publishedAt=null
  2. Update: status="published"
     - Checks if publishedAt already set
     - If not set, auto-sets to current timestamp
     - Uses findByIdAndUpdate logic

Expected:
  Status: 200
  publishedAt is set to current date
  status is "published"

Validates:
  - Publishing works
  - publishedAt auto-set on status change
  - Timestamp not overwritten if already set
```

---

### Access Control Tests (Tests 9, 14-15)

#### Test 9: Reader Cannot Create Newsletter
```
Input:
  Reader JWT token (not admin)
  Newsletter data

Database:
  Middleware checks token, extracts role
  Role is "reader" → Access denied

Expected:
  Status: 403
  Message: "Admin access required"

Validates:
  - Role-based access control works
  - Readers cannot create newsletters
```

#### Test 14: Reader Cannot Update Newsletter
```
Input:
  Admin creates newsletter
  Reader JWT token tries to update

Database:
  Middleware checks role → Forbidden

Expected:
  Status: 403
  Message includes "Admin"

Validates:
  - Update endpoint protected
  - Only admins can update
```

#### Test 15: Reader Cannot Delete Newsletter
```
Input:
  Admin creates newsletter
  Reader JWT token tries to delete

Database:
  Middleware checks role → Forbidden

Expected:
  Status: 403
  Message includes "Admin"

Validates:
  - Delete endpoint protected
  - Only admins can delete
```

---

### Validation Tests (Tests 16-17, 20)

#### Test 16: Invalid Template Type
```
Input:
  Newsletter with template: "invalid_template_type"

Database:
  Schema validation fails
  Template must be: "event-recap" | "workshop" | "announcement" | "default"

Expected:
  Status: 400
  Message: "Template must be one of: ..."

Validates:
  - Enum validation works
  - Invalid templates rejected
```

#### Test 17: Missing Required Fields
```
Input:
  Newsletter missing "slug" field

Database:
  Schema validation fails
  Slug is required

Expected:
  Status: 400
  Message: "Missing required fields"

Validates:
  - Required field validation works
  - Cannot create without slug
```

#### Test 20: Invalid Token Rejection
```
Input:
  Authorization header with malformed token
  "invalid.token.here"

Database:
  Middleware tries to verify token → Fails

Expected:
  Status: 401
  Message includes "token"

Validates:
  - Invalid tokens rejected
  - Token verification works
```

---

## Test Flow Diagram

```
Start Test Suite
      │
      ├─→ Test 1: Admin Sign-In
      │   └─→ Store adminToken
      │
      ├─→ Test 2: Wrong Credentials
      │
      ├─→ Test 3: Reader Sign-Up
      │   └─→ Store readerToken
      │
      ├─→ Test 4: Duplicate Email
      │
      ├─→ Test 5: Reader Sign-In
      │
      ├─→ Test 6: Get All Newsletters
      │
      ├─→ Test 7: Create Newsletter
      │   └─→ Use adminToken
      │
      ├─→ Test 8-20: Additional tests
      │   └─→ Use stored tokens
      │
      └─→ Print Summary
          ✅ X Passed
          ❌ Y Failed
```

---

## Database State During Tests

### Tokens
Tests generate fresh tokens:
```javascript
let adminToken = '';    // Set by Test 1
let readerToken = '';   // Set by Test 3
```

These tokens are reused in subsequent tests.

### Newsletter Data
Tests create ephemeral newsletters:
```javascript
slug: `test-slug-${randomId}`  // Unique per run
```

No cleanup between test runs → Database accumulates test data.

---

## Common Test Issues

### Issue: Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Solution**:
```bash
# Make sure server is running
npm run dev  # In separate terminal
```

### Issue: Invalid Token Error (Test 5+)
```
Error: Token verification error: invalid token
```

**Reason**: adminToken or readerToken not set

**Solution**: 
- Test 1 (Admin Sign-In) must pass first
- Test 3 (Reader Sign-Up) must pass before Test 5

### Issue: Duplicate Slug Error
```
E11000 duplicate key error collection: gdgocgu.newsletters index: slug_1
```

**Reason**: Same slug used in previous test run (Database not cleared)

**Solution**: 
- Tests use random slugs: `slug-${randomId}`
- If error persists, manually delete old newsletters from MongoDB Atlas

### Issue: publishedAt Not Set (Test 18)
```
publishedAt: null (expected timestamp)
```

**Reason**: Middleware not setting timestamp on update

**Solution**: 
- Ensure routes/newsletters.js has the fix in PUT endpoint
- Check that `findByIdAndUpdate` includes `publishedAt` logic

---

## Extending Tests

### Add New Test
```javascript
/**
 * Test 21: Your Test Name
 */
async function test21_YourTest() {
  console.log(
    `\n${colors.blue}[Test 21]${colors.reset} Your Test Name`
  );
  try {
    const response = await makeRequest('METHOD', '/endpoint', data, token);
    
    const passed = 
      response.status === 200 &&
      response.data.success === true;
    
    logTest(
      'Your test description',
      passed,
      'Expected value',
      `Actual: ${response.status}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}
```

### Register Test
Add to `runAllTests()`:
```javascript
await test21_YourTest();
```

---

## Test Metrics

### Performance
- Total execution time: ~5-10 seconds (depends on network)
- Slowest tests: Newsletter creation (database insert)
- Fastest tests: Wrong credentials (no DB query)

### Coverage
- Authentication: 5/5 scenarios
- Authorization: 3/3 scenarios
- Database validation: 5/5 scenarios
- CRUD operations: 4/4 scenarios
- Public API: 2/2 scenarios

### Success Rate
- Target: 100% (20/20 tests)
- Current: 20/20 ✅

---

## Production vs Testing

### Production Database (`gdgocgu`)
- Real data
- Tests modify this database
- Data persists after tests

### Testing Database (`gdgocgu_test`)
- Separate database available
- Can be used for test isolation
- Currently tests use production DB

### Switch to Test Database
Edit `db_tests/test.js`:
```javascript
const BASE_URL = process.env.TEST_MODE === 'true' 
  ? 'http://localhost:5000?db=test'
  : 'http://localhost:5000';
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Backend

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Start server
        run: cd backend && npm run dev &
        
      - name: Wait for server
        run: sleep 5
      
      - name: Run tests
        run: cd backend && npm run test
```

---

## Debugging Tests

### Enable Verbose Output
Modify `test.js`:
```javascript
console.log('Request:', method, path, data);
console.log('Response:', response.status, response.data);
```

### Test Single Endpoint
Comment out other tests and run specific test:
```javascript
// await test1_AdminSignIn();
await test7_CreateNewsletter(); // Only run this
// await test8_DuplicateSlug();
```

### Check Database State
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://gdgocgu:..." --apiVersion 1

# View users
db.users.find()

# View newsletters
db.newsletters.find()

# View indexes
db.newsletters.getIndexes()
```

---

## Cleanup Old Test Data

### Delete All Test Newsletters
```bash
mongosh "mongodb+srv://gdgocgu:..." --apiVersion 1

db.newsletters.deleteMany({
  slug: {$regex: "test-|duplicate-|update-attempt|delete-attempt|publish-test"}
})
```

### Delete All Test Users
```bash
db.users.deleteMany({
  email: {$regex: "@test.com"}
})
```

---

## Test Maintenance

### When to Update Tests
- New endpoints added
- Validation rules changed
- Error messages updated
- Database schema modified

### Test Update Checklist
- [ ] Update endpoint URL
- [ ] Update request body
- [ ] Update expected response
- [ ] Update status code
- [ ] Update error handling
- [ ] Run tests to verify
- [ ] Document changes in this file

---

## Resources

- Test File: `db_tests/test.js`
- Endpoints: `endpoints.md`
- Database: `db.md`
- Server: `server.js`
- Routes: `routes/`
