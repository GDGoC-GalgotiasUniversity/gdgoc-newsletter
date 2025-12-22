/**
 * API Testing Suite
 * Tests all endpoints on production database (gdgocgu)
 * 
 * Run: node db_tests/test.js
 */

const http = require('http');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
let testsPassed = 0;
let testsFailed = 0;
let adminToken = '';
let readerToken = '';
let newsletterId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Make HTTP request
 */
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Log test result
 */
function logTest(testName, passed, expected, actual) {
  if (passed) {
    console.log(
      `${colors.green}✅ PASS${colors.reset} - ${testName}`
    );
    testsPassed++;
  } else {
    console.log(
      `${colors.red}❌ FAIL${colors.reset} - ${testName}`
    );
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual: ${actual}`);
    testsFailed++;
  }
}

/**
 * Test 1: Admin Sign-In
 */
async function test1_AdminSignIn() {
  console.log(
    `\n${colors.blue}[Test 1]${colors.reset} Admin Sign-In (Hardcoded)`
  );
  try {
    const response = await makeRequest('POST', '/auth/signin', {
      email: 'gdgocgu@gmail.com',
      password: '1234@',
    });

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      response.data.role === 'admin' &&
      response.data.token;

    if (passed) {
      adminToken = response.data.token;
    }

    logTest(
      'Admin login with correct credentials',
      passed,
      'role: admin, token received',
      `role: ${response.data.role}, token: ${response.data.token ? 'received' : 'missing'}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 2: Wrong Credentials
 */
async function test2_WrongCredentials() {
  console.log(
    `\n${colors.blue}[Test 2]${colors.reset} Wrong Credentials`
  );
  try {
    const response = await makeRequest('POST', '/auth/signin', {
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    const passed =
      response.status === 401 &&
      response.data.success === false;

    logTest(
      'Reject wrong credentials',
      passed,
      'success: false, status: 401',
      `success: ${response.data.success}, status: ${response.status}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 3: Reader Sign-Up
 */
async function test3_ReaderSignUp() {
  console.log(
    `\n${colors.blue}[Test 3]${colors.reset} Reader Sign-Up`
  );
  try {
    const response = await makeRequest('POST', '/auth/signup', {
      name: 'Test Reader',
      email: `reader${Date.now()}@test.com`,
      password: 'pass123',
    });

    const passed =
      response.status === 201 &&
      response.data.success === true &&
      response.data.role === 'reader' &&
      response.data.token;

    if (passed) {
      readerToken = response.data.token;
    }

    logTest(
      'Reader signup with valid data',
      passed,
      'status: 201, role: reader, token received',
      `status: ${response.status}, role: ${response.data.role}, token: ${response.data.token ? 'received' : 'missing'}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 4: Duplicate Email
 */
async function test4_DuplicateEmail() {
  console.log(
    `\n${colors.blue}[Test 4]${colors.reset} Duplicate Email Prevention`
  );
  try {
    const email = `reader${Date.now()}@test.com`;
    
    // First signup
    await makeRequest('POST', '/auth/signup', {
      name: 'First User',
      email: email,
      password: 'pass123',
    });

    // Second signup with same email
    const response = await makeRequest('POST', '/auth/signup', {
      name: 'Second User',
      email: email,
      password: 'pass456',
    });

    const passed =
      response.status === 400 &&
      response.data.success === false &&
      response.data.message.includes('registered');

    logTest(
      'Reject duplicate email',
      passed,
      'status: 400, message includes "registered"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 5: Reader Sign-In
 */
async function test5_ReaderSignIn() {
  console.log(
    `\n${colors.blue}[Test 5]${colors.reset} Reader Sign-In`
  );
  try {
    const email = `reader${Date.now()}@test.com`;
    
    // Create reader first
    await makeRequest('POST', '/auth/signup', {
      name: 'Test Reader',
      email: email,
      password: 'pass123',
    });

    // Login as reader
    const response = await makeRequest('POST', '/auth/signin', {
      email: email,
      password: 'pass123',
    });

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      response.data.role === 'reader' &&
      response.data.token;

    logTest(
      'Reader login with correct credentials',
      passed,
      'role: reader, token received',
      `role: ${response.data.role}, token: ${response.data.token ? 'received' : 'missing'}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 6: Get All Newsletters
 */
async function test6_GetAllNewsletters() {
  console.log(
    `\n${colors.blue}[Test 6]${colors.reset} Get All Published Newsletters`
  );
  try {
    const response = await makeRequest('GET', '/api/newsletters');

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      Array.isArray(response.data.data);

    logTest(
      'Get all newsletters (public endpoint)',
      passed,
      'status: 200, data is array',
      `status: ${response.status}, data type: ${typeof response.data.data}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 7: Create Newsletter
 */
async function test7_CreateNewsletter() {
  console.log(
    `\n${colors.blue}[Test 7]${colors.reset} Create Newsletter (Admin Only)`
  );
  try {
    const slug = `test-newsletter-${Date.now()}`;
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Test Newsletter',
        slug: slug,
        excerpt: 'This is a test',
        contentMarkdown: '## Test\n\nContent here.',
        template: 'announcement',
        status: 'published',
      },
      adminToken
    );

    const passed =
      response.status === 201 &&
      response.data.success === true &&
      response.data.data._id;

    if (passed) {
      newsletterId = response.data.data._id;
    }

    logTest(
      'Create newsletter with admin token',
      passed,
      'status: 201, newsletter created with ID',
      `status: ${response.status}, ID: ${response.data.data?._id || 'missing'}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 8: Duplicate Slug Prevention
 */
async function test8_DuplicateSlug() {
  console.log(
    `\n${colors.blue}[Test 8]${colors.reset} Duplicate Slug Prevention`
  );
  try {
    const randomId = Math.random().toString(36).substring(2, 8);
    const slug = `duplicate-slug-${randomId}`;

    // Create first newsletter
    await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'First Newsletter',
        slug: slug,
        contentMarkdown: '## Content 1\n\nThis is the first newsletter content with more than 10 characters.',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    // Try to create second with same slug
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Second Newsletter',
        slug: slug,
        contentMarkdown: '## Content 2\n\nThis is the second newsletter content with more than 10 characters.',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    const passed =
      response.status === 400 &&
      response.data.success === false &&
      (response.data.message.includes('already exists') || response.data.message.includes('duplicate'));

    logTest(
      'Reject duplicate slug',
      passed,
      'status: 400, message includes "already exists" or "duplicate"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 9: Reader Cannot Create Newsletter
 */
async function test9_ReaderCannotCreate() {
  console.log(
    `\n${colors.blue}[Test 9]${colors.reset} Reader Cannot Create Newsletter`
  );
  try {
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Hacker Newsletter',
        slug: `hacker-${Date.now()}`,
        contentMarkdown: '## Hack',
        template: 'announcement',
        status: 'published',
      },
      readerToken
    );

    const passed =
      response.status === 403 &&
      response.data.success === false &&
      response.data.message.includes('Admin');

    logTest(
      'Reject newsletter creation by reader',
      passed,
      'status: 403, message includes "Admin"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 10: No Token = Access Denied
 */
async function test10_NoToken() {
  console.log(
    `\n${colors.blue}[Test 10]${colors.reset} No Token = Access Denied`
  );
  try {
    const response = await makeRequest('POST', '/admin/newsletters', {
      title: 'No Token',
      slug: `no-token-${Date.now()}`,
      contentMarkdown: '## Content',
      template: 'announcement',
    });

    const passed =
      response.status === 401 &&
      response.data.success === false &&
      response.data.message.includes('token');

    logTest(
      'Reject request without token',
      passed,
      'status: 401, message includes "token"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 11: Get Single Newsletter by Slug
 */
async function test11_GetNewsletterBySlug() {
  console.log(
    `\n${colors.blue}[Test 11]${colors.reset} Get Single Newsletter by Slug`
  );
  try {
    const slug = `single-newsletter-${Date.now()}`;
    
    // Create a newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Single Newsletter Test',
        slug: slug,
        excerpt: 'Single test',
        contentMarkdown: '## Single\n\nContent here.',
        template: 'announcement',
        status: 'published',
      },
      adminToken
    );

    // Get the newsletter by slug
    const response = await makeRequest('GET', `/api/newsletters/${slug}`);

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      response.data.data.slug === slug &&
      response.data.data.title === 'Single Newsletter Test';

    logTest(
      'Get newsletter by slug (public)',
      passed,
      'status: 200, slug and title match',
      `status: ${response.status}, slug: ${response.data.data?.slug}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 12: Update Newsletter
 */
async function test12_UpdateNewsletter() {
  console.log(
    `\n${colors.blue}[Test 12]${colors.reset} Update Newsletter (Admin)`
  );
  try {
    const slug = `update-newsletter-${Date.now()}`;
    
    // Create a newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Original Title',
        slug: slug,
        contentMarkdown: '## Original',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    const id = createResponse.data.data._id;

    // Update the newsletter
    const response = await makeRequest(
      'PUT',
      `/admin/newsletters/${id}`,
      {
        title: 'Updated Title',
        contentMarkdown: '## Updated Content',
      },
      adminToken
    );

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      response.data.data.title === 'Updated Title';

    logTest(
      'Update newsletter with admin token',
      passed,
      'status: 200, title updated',
      `status: ${response.status}, title: ${response.data.data?.title}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 13: Delete Newsletter
 */
async function test13_DeleteNewsletter() {
  console.log(
    `\n${colors.blue}[Test 13]${colors.reset} Delete Newsletter (Admin)`
  );
  try {
    const slug = `delete-newsletter-${Date.now()}`;
    
    // Create a newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'To Be Deleted',
        slug: slug,
        contentMarkdown: '## Delete me',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    const id = createResponse.data.data._id;

    // Delete the newsletter
    const response = await makeRequest(
      'DELETE',
      `/admin/newsletters/${id}`,
      null,
      adminToken
    );

    const passed =
      response.status === 200 &&
      response.data.success === true;

    logTest(
      'Delete newsletter with admin token',
      passed,
      'status: 200, newsletter deleted',
      `status: ${response.status}, success: ${response.data.success}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 14: Reader Cannot Update Newsletter
 */
async function test14_ReaderCannotUpdate() {
  console.log(
    `\n${colors.blue}[Test 14]${colors.reset} Reader Cannot Update Newsletter`
  );
  try {
    const randomId = Math.random().toString(36).substring(2, 8);
    const slug = `update-attempt-${randomId}`;
    
    // Admin creates a newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Admin Newsletter',
        slug: slug,
        contentMarkdown: '## Admin Content\n\nThis is admin content with more than 10 characters required.',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    if (!createResponse.data.data || !createResponse.data.data._id) {
      console.log(`   Debug - Create Response:`, JSON.stringify(createResponse));
      logTest(
        'Reader cannot update newsletter',
        false,
        'Newsletter creation succeeded',
        `Newsletter creation failed: ${createResponse.data.message || 'Unknown error'}`
      );
      return;
    }

    const id = createResponse.data.data._id;

    // Reader tries to update
    const response = await makeRequest(
      'PUT',
      `/admin/newsletters/${id}`,
      {
        title: 'Hacked Title',
      },
      readerToken
    );

    const passed =
      response.status === 403 &&
      response.data.success === false &&
      response.data.message.includes('Admin');

    logTest(
      'Reject newsletter update by reader',
      passed,
      'status: 403, message includes "Admin"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 15: Reader Cannot Delete Newsletter
 */
async function test15_ReaderCannotDelete() {
  console.log(
    `\n${colors.blue}[Test 15]${colors.reset} Reader Cannot Delete Newsletter`
  );
  try {
    const randomId = Math.random().toString(36).substring(2, 8);
    const slug = `delete-attempt-${randomId}`;
    
    // Admin creates a newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Admin Newsletter',
        slug: slug,
        contentMarkdown: '## Admin Content\n\nThis is admin content with more than 10 characters required.',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    if (!createResponse.data.data || !createResponse.data.data._id) {
      console.log(`   Debug - Create Response:`, JSON.stringify(createResponse));
      logTest(
        'Reader cannot delete newsletter',
        false,
        'Newsletter creation succeeded',
        `Newsletter creation failed: ${createResponse.data.message || 'Unknown error'}`
      );
      return;
    }

    const id = createResponse.data.data._id;

    // Reader tries to delete
    const response = await makeRequest(
      'DELETE',
      `/admin/newsletters/${id}`,
      null,
      readerToken
    );

    const passed =
      response.status === 403 &&
      response.data.success === false &&
      response.data.message.includes('Admin');

    logTest(
      'Reject newsletter deletion by reader',
      passed,
      'status: 403, message includes "Admin"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 16: Invalid Template Type
 */
async function test16_InvalidTemplate() {
  console.log(
    `\n${colors.blue}[Test 16]${colors.reset} Invalid Template Type`
  );
  try {
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Invalid Template',
        slug: `invalid-template-${Date.now()}`,
        contentMarkdown: '## Content',
        template: 'invalid_template_type',
        status: 'published',
      },
      adminToken
    );

    const passed =
      response.status === 400 &&
      response.data.success === false;

    logTest(
      'Reject invalid template type',
      passed,
      'status: 400, validation error',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 17: Missing Required Fields
 */
async function test17_MissingFields() {
  console.log(
    `\n${colors.blue}[Test 17]${colors.reset} Missing Required Fields`
  );
  try {
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'No Slug',
        // missing slug field
        contentMarkdown: '## Content',
        template: 'announcement',
      },
      adminToken
    );

    const passed =
      response.status === 400 &&
      response.data.success === false;

    logTest(
      'Reject missing required fields',
      passed,
      'status: 400, validation error',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 18: Change Newsletter Status to Published
 */
async function test18_PublishNewsletter() {
  console.log(
    `\n${colors.blue}[Test 18]${colors.reset} Publish Newsletter (Draft to Published)`
  );
  try {
    const randomId = Math.random().toString(36).substring(2, 8);
    const slug = `publish-test-${randomId}`;
    
    // Create draft newsletter
    const createResponse = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Draft Newsletter',
        slug: slug,
        contentMarkdown: '## Draft Content\n\nThis is draft content with more than 10 characters required.',
        template: 'announcement',
        status: 'draft',
      },
      adminToken
    );

    if (!createResponse.data.data || !createResponse.data.data._id) {
      console.log(`   Debug - Create Response:`, JSON.stringify(createResponse));
      logTest(
        'Publish newsletter',
        false,
        'Newsletter creation succeeded',
        `Newsletter creation failed: ${createResponse.data.message || 'Unknown error'}`
      );
      return;
    }

    const id = createResponse.data.data._id;

    // Update to published
    const response = await makeRequest(
      'PUT',
      `/admin/newsletters/${id}`,
      {
        status: 'published',
      },
      adminToken
    );

    const passed =
      response.status === 200 &&
      response.data.success === true &&
      response.data.data.status === 'published' &&
      response.data.data.publishedAt;

    logTest(
      'Publish newsletter and set publishedAt',
      passed,
      'status: 200, status: published, publishedAt set',
      `status: ${response.status}, newsletter status: ${response.data.data?.status}, publishedAt: ${response.data.data?.publishedAt ? 'set' : 'not set'}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 19: Create Newsletter with All Fields
 */
async function test19_FullNewsletter() {
  console.log(
    `\n${colors.blue}[Test 19]${colors.reset} Create Newsletter with All Fields`
  );
  try {
    const slug = `full-newsletter-${Date.now()}`;
    
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Complete Newsletter',
        slug: slug,
        excerpt: 'This is a complete newsletter with all fields',
        contentMarkdown: '# Full Content\n\n## Section 1\n\nContent here.\n\n## Section 2\n\nMore content.',
        template: 'announcement',
        status: 'published',
      },
      adminToken
    );

    const passed =
      response.status === 201 &&
      response.data.success === true &&
      response.data.data.title === 'Complete Newsletter' &&
      response.data.data.excerpt === 'This is a complete newsletter with all fields' &&
      response.data.data.template === 'announcement' &&
      response.data.data.status === 'published';

    logTest(
      'Create newsletter with all fields',
      passed,
      'status: 201, all fields saved correctly',
      `status: ${response.status}, title: ${response.data.data?.title}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Test 20: Verify Token Expiration (Simulate)
 */
async function test20_InvalidToken() {
  console.log(
    `\n${colors.blue}[Test 20]${colors.reset} Invalid Token Rejection`
  );
  try {
    const response = await makeRequest(
      'POST',
      '/admin/newsletters',
      {
        title: 'Invalid Token Test',
        slug: `invalid-token-${Date.now()}`,
        contentMarkdown: '## Content',
        template: 'announcement',
      },
      'invalid.token.here'
    );

    const passed =
      response.status === 401 &&
      response.data.success === false &&
      response.data.message.includes('token');

    logTest(
      'Reject invalid/malformed token',
      passed,
      'status: 401, message includes "token"',
      `status: ${response.status}, message: ${response.data.message}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    testsFailed++;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(
    `\n${colors.cyan}════════════════════════════════════════${colors.reset}`
  );
  console.log(
    `${colors.cyan}   GDG Newsletter API - Test Suite${colors.reset}`
  );
  console.log(
    `${colors.cyan}════════════════════════════════════════${colors.reset}`
  );

  try {
    await test1_AdminSignIn();
    await test2_WrongCredentials();
    await test3_ReaderSignUp();
    await test4_DuplicateEmail();
    await test5_ReaderSignIn();
    await test6_GetAllNewsletters();
    await test7_CreateNewsletter();
    await test8_DuplicateSlug();
    await test9_ReaderCannotCreate();
    await test10_NoToken();
    await test11_GetNewsletterBySlug();
    await test12_UpdateNewsletter();
    await test13_DeleteNewsletter();
    await test14_ReaderCannotUpdate();
    await test15_ReaderCannotDelete();
    await test16_InvalidTemplate();
    await test17_MissingFields();
    await test18_PublishNewsletter();
    await test19_FullNewsletter();
    await test20_InvalidToken();

    // Final summary
    console.log(
      `\n${colors.cyan}════════════════════════════════════════${colors.reset}`
    );
    console.log(`${colors.cyan}   Test Summary${colors.reset}`);
    console.log(
      `${colors.cyan}════════════════════════════════════════${colors.reset}`
    );
    console.log(
      `${colors.green}✅ Passed: ${testsPassed}${colors.reset}`
    );
    console.log(
      `${colors.red}❌ Failed: ${testsFailed}${colors.reset}`
    );
    console.log(`Total Tests: ${testsPassed + testsFailed}`);

    if (testsFailed === 0 && testsPassed > 0) {
      console.log(
        `\n${colors.green}🎉 ALL TESTS PASSED! 🎉${colors.reset}`
      );
      console.log(
        `${colors.green}Backend API is fully functional!${colors.reset}\n`
      );
      process.exit(0);
    } else {
      console.log(
        `\n${colors.red}⚠️  Some tests failed. Please review the errors above.${colors.reset}\n`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}Fatal Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
