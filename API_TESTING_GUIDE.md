# 🧪 API Testing Guide - Quick Reference

## 🚀 Quick Start

### **1. Start All Services**

```bash
# Terminal 1: Start Docker services
docker-compose up -d

# Terminal 2: Start backend
cd backend
npm run dev
```

### **2. Access Swagger UI**

Open: **http://localhost:5000/api/docs**

---

## 📝 **Test Scenarios**

### **Scenario 1: Complete Candidate Flow**

#### **Step 1: Register Candidate**

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "candidate@test.com",
  "password": "Test@123",
  "fullName": "Test Candidate",
  "registeredMobile": "9876543210"
}
```

**Expected Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful. OTP sent to your email.",
  "data": {
    "email": "candidate@test.com",
    "otpSent": true
  }
}
```

**WebSocket Event:** `admin:live:count` (to admins)

---

#### **Step 2: Verify OTP**

**Note:** Check backend console logs for OTP (in development mode)

```bash
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "candidate@test.com",
  "otp": "123456"
}
```

**Expected Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### **Step 3: Login**

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "candidate@test.com",
  "password": "Test@123"
}
```

**Save the `accessToken` for subsequent requests!**

---

#### **Step 4: Get Public Jobs**

```bash
GET http://localhost:5000/api/jobs?page=1&limit=10
```

**Expected Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Jobs fetched successfully",
  "data": [
    {
      "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
      "title": "Junior Engineer",
      "department": "Public Works Department",
      "postCode": "PWD-2024-001",
      "totalPosts": 50,
      "applicationDeadline": "2024-06-30T23:59:59Z",
      "status": "active"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### **Step 5: Create Application**

```bash
POST http://localhost:5000/api/candidate/applications
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "jobId": "64f8a9b2c3d4e5f6a7b8c9d0"
}
```

**Expected Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Application created successfully",
  "data": {
    "application": {
      "_id": "64f8a9b2c3d4e5f6a7b8c9d1",
      "applicationId": "APP-2024-001234",
      "jobId": "64f8a9b2c3d4e5f6a7b8c9d0",
      "candidateId": "64f8a9b2c3d4e5f6a7b8c9d2",
      "status": "draft",
      "currentStep": 1
    }
  }
}
```

**WebSocket Event:** `admin:application:new` (to admins)

---

#### **Step 6: Fill Personal Details (Step 1)**

```bash
PUT http://localhost:5000/api/candidate/applications/64f8a9b2c3d4e5f6a7b8c9d1/personal-details
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "fullName": "Test Candidate",
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "fatherName": "Father Name",
  "motherName": "Mother Name",
  "category": "General",
  "religion": "Hindu",
  "maritalStatus": "Single"
}
```

---

#### **Step 7: Submit Application**

```bash
POST http://localhost:5000/api/candidate/applications/64f8a9b2c3d4e5f6a7b8c9d1/submit
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**WebSocket Event:** `application:submitted` (to candidate + admins)

---

### **Scenario 2: Admin Flow**

#### **Step 1: Admin Login**

**Note:** You need to create an admin user first (see seed script or manual creation)

```bash
POST http://localhost:5000/api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@recruitment.gov.in",
  "password": "admin123"
}
```

---

#### **Step 2: Create Employee**

```bash
POST http://localhost:5000/api/admin/employees
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "contactNumber": "9876543210",
  "department": "HR Department",
  "roleDesignation": "HR Manager",
  "employeeId": "EMP001",
  "dateOfJoining": "2024-01-01",
  "officialEmail": "john.doe@recruitment.gov.in",
  "password": "Employee@123",
  "systemRole": "ROLE_ID_HERE"
}
```

**WebSocket Event:** `admin:live:count` (to all admins)

---

#### **Step 3: Create Role**

```bash
POST http://localhost:5000/api/admin/roles
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "roleName": "HR Manager",
  "roleDescription": "Manages employee recruitment and onboarding",
  "permissions": {
    "jobs": {
      "create": true,
      "view": true,
      "edit": true,
      "delete": false,
      "download": true
    },
    "applications": {
      "create": false,
      "view": true,
      "edit": true,
      "delete": false,
      "download": true
    },
    "analytics": {
      "create": false,
      "view": true,
      "edit": false,
      "delete": false,
      "download": true
    },
    "employees": {
      "create": true,
      "view": true,
      "edit": true,
      "delete": false,
      "download": false
    },
    "paymentSettings": {
      "create": false,
      "view": true,
      "edit": false,
      "delete": false,
      "download": false
    },
    "support": {
      "create": false,
      "view": true,
      "edit": true,
      "delete": false,
      "download": false
    },
    "projects": {
      "create": true,
      "view": true,
      "edit": true,
      "delete": false,
      "download": true
    },
    "results": {
      "create": false,
      "view": true,
      "edit": false,
      "delete": false,
      "download": true
    }
  }
}
```

**WebSocket Event:** `admin:live:count` (to all admins)

---

#### **Step 4: Create Project**

```bash
POST http://localhost:5000/api/admin/projects
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Bihar Public Service Commission 2024",
  "department": "Public Service Commission",
  "state": "Bihar",
  "description": "Annual recruitment drive for various government positions",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "Active"
}
```

**WebSocket Event:** `admin:live:count` (to all admins)

---

#### **Step 5: Create Job**

```bash
POST http://localhost:5000/api/admin/jobs
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Junior Engineer",
  "postCode": "PWD-2024-001",
  "department": "Public Works Department",
  "category": "Engineering",
  "projectId": "PROJECT_ID_HERE",
  "totalPosts": 50,
  "reservedPosts": {
    "sc": 7,
    "st": 3,
    "obc": 13,
    "ews": 5,
    "pwd": 2
  },
  "salaryRange": {
    "min": 35000,
    "max": 50000
  },
  "jobType": "Permanent",
  "workLocation": "Patna, Bihar",
  "description": "Recruitment for Junior Engineer positions",
  "applicationFee": {
    "general": 500,
    "scSt": 250,
    "pwd": 0
  },
  "applicationDeadline": "2024-06-30T23:59:59Z",
  "ageLimit": {
    "min": 21,
    "max": 35,
    "relaxation": {
      "sc": 5,
      "st": 5,
      "obc": 3,
      "pwd": 10
    }
  },
  "status": "draft"
}
```

---

#### **Step 6: Publish Job**

```bash
PUT http://localhost:5000/api/admin/jobs/JOB_ID_HERE/publish
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**WebSocket Event:** `job:published` (broadcast to everyone)

---

#### **Step 7: Get Applications**

```bash
GET http://localhost:5000/api/admin/applications?status=submitted&page=1&limit=10
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

#### **Step 8: Update Application Status**

```bash
PUT http://localhost:5000/api/admin/applications/APPLICATION_ID_HERE/status
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "approved",
  "remarks": "All documents verified. Application approved."
}
```

**WebSocket Event:** `application:status:changed` (to candidate)

---

#### **Step 9: Verify Document**

```bash
PUT http://localhost:5000/api/admin/applications/APPLICATION_ID_HERE/documents/DOCUMENT_ID_HERE/verify
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "remarks": "Document verified successfully"
}
```

**WebSocket Event:** `document:verified` (to candidate)

---

#### **Step 10: Get Analytics**

```bash
GET http://localhost:5000/api/admin/analytics/overview
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Overview fetched",
  "data": {
    "overview": {
      "totalJobs": 45,
      "totalApplications": 1250,
      "totalCandidates": 890,
      "totalProjects": 12,
      "totalRevenue": 625000,
      "totalPaidApplications": 1100
    },
    "applicationsByStatus": [
      { "_id": "submitted", "count": 550 },
      { "_id": "under_review", "count": 300 },
      { "_id": "approved", "count": 200 }
    ]
  }
}
```

---

#### **Step 11: Get Activity Logs**

```bash
GET http://localhost:5000/api/admin/activity-logs?page=1&limit=20
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

#### **Step 12: Export Activity Logs**

```bash
GET http://localhost:5000/api/admin/activity-logs/export?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Response:** CSV file download

---

### **Scenario 3: Support Ticket Flow**

#### **Step 1: Candidate Creates Ticket**

```bash
POST http://localhost:5000/api/candidate/support/tickets
Authorization: Bearer CANDIDATE_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Payment not reflecting",
  "description": "I made the payment 2 hours ago but it's still showing as pending",
  "category": "Payment",
  "priority": "High"
}
```

**WebSocket Event:** `support:ticket:created` (to all admins)

---

#### **Step 2: Admin Views Tickets**

```bash
GET http://localhost:5000/api/admin/support/tickets?status=Open&priority=High
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

#### **Step 3: Admin Replies to Ticket**

```bash
POST http://localhost:5000/api/admin/support/tickets/TICKET_ID_HERE/reply
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "message": "We have checked your payment. It will be reflected within 24 hours."
}
```

**WebSocket Event:** `support:ticket:reply` (to candidate)

---

#### **Step 4: Admin Updates Ticket Status**

```bash
PUT http://localhost:5000/api/admin/support/tickets/TICKET_ID_HERE
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "Resolved",
  "priority": "Medium"
}
```

**WebSocket Event:** `support:ticket:resolved` (to candidate)

---

#### **Step 5: Get Support Stats**

```bash
GET http://localhost:5000/api/admin/support/stats
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

## 🔍 **Testing with Swagger UI**

### **Step-by-Step:**

1. **Open Swagger:** http://localhost:5000/api/docs

2. **Authorize:**
   - Click "Authorize" button (top right)
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize"

3. **Test Endpoints:**
   - Expand any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - View response

4. **Copy Token:**
   - After login, copy `accessToken` from response
   - Use it for authorization

---

## 🧪 **Testing WebSocket Events**

### **Browser Console Test:**

```javascript
// Open browser console on http://localhost:5173
const socket = io("http://localhost:5000", {
  auth: { token: "YOUR_ACCESS_TOKEN_HERE" },
});

// Connection events
socket.on("connect", () => console.log("✅ Connected"));
socket.on("disconnect", () => console.log("❌ Disconnected"));

// Listen to all events
socket.onAny((event, data) => {
  console.log(`📨 Event: ${event}`, data);
});

// Specific events
socket.on("application:submitted", (data) => {
  console.log("Application submitted:", data);
});

socket.on("admin:live:count", (data) => {
  console.log("Admin update:", data);
});

socket.on("job:published", (data) => {
  console.log("New job:", data);
});
```

---

## 📊 **Common Test Cases**

### **1. Pagination Test**

```bash
# Page 1
GET http://localhost:5000/api/admin/employees?page=1&limit=10

# Page 2
GET http://localhost:5000/api/admin/employees?page=2&limit=10
```

### **2. Filtering Test**

```bash
# Filter by status
GET http://localhost:5000/api/admin/employees?status=Active

# Filter by department
GET http://localhost:5000/api/admin/employees?department=HR

# Multiple filters
GET http://localhost:5000/api/admin/employees?status=Active&department=HR&page=1&limit=10
```

### **3. Search Test**

```bash
# Search employees
GET http://localhost:5000/api/admin/employees?search=john

# Search applications
GET http://localhost:5000/api/admin/applications?search=APP-2024
```

### **4. Sorting Test**

```bash
# Sort by created date (descending)
GET http://localhost:5000/api/admin/employees?sortBy=createdAt&sortOrder=desc

# Sort by name (ascending)
GET http://localhost:5000/api/admin/employees?sortBy=fullName&sortOrder=asc
```

### **5. Date Range Test**

```bash
# Analytics with date range
GET http://localhost:5000/api/admin/analytics/overview?startDate=2024-01-01&endDate=2024-12-31

# Activity logs with date range
GET http://localhost:5000/api/admin/activity-logs?startDate=2024-05-01&endDate=2024-05-15
```

---

## ❌ **Error Testing**

### **1. Unauthorized Access**

```bash
# Without token
GET http://localhost:5000/api/admin/employees

# Expected: 401 Unauthorized
```

### **2. Invalid Token**

```bash
GET http://localhost:5000/api/admin/employees
Authorization: Bearer invalid_token_here

# Expected: 401 Unauthorized
```

### **3. Validation Error**

```bash
POST http://localhost:5000/api/admin/employees
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "fullName": "John"
  # Missing required fields
}

# Expected: 400 Bad Request with validation errors
```

### **4. Not Found**

```bash
GET http://localhost:5000/api/admin/employees/invalid_id_here
Authorization: Bearer ADMIN_TOKEN

# Expected: 404 Not Found
```

### **5. Duplicate Entry**

```bash
POST http://localhost:5000/api/admin/employees
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "employeeId": "EMP001",  # Already exists
  ...
}

# Expected: 409 Conflict
```

---

## 🎯 **Performance Testing**

### **1. Bulk Operations**

```bash
POST http://localhost:5000/api/admin/applications/bulk-action
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "applicationIds": ["id1", "id2", "id3", ...],  # Test with 100+ IDs
  "status": "approved"
}
```

### **2. Large Pagination**

```bash
# Test with large page numbers
GET http://localhost:5000/api/admin/applications?page=100&limit=50
```

### **3. Complex Filters**

```bash
# Multiple filters + search + sorting
GET http://localhost:5000/api/admin/applications?status=submitted&paymentStatus=paid&department=PWD&search=APP&sortBy=createdAt&sortOrder=desc&page=1&limit=20
```

---

## ✅ **Expected Behaviors**

### **1. Real-time Updates**

- Create employee → All admins see notification
- Submit application → Candidate + admins notified
- Publish job → Everyone sees new job
- Reply to ticket → Other party notified

### **2. Audit Logging**

- Every admin action logged
- Logs include: timestamp, employee, action, module, details, IP
- Exportable as CSV

### **3. Permission Checks**

- Employees can only access permitted modules
- Actions checked against role permissions
- Unauthorized access returns 403

### **4. Data Validation**

- All inputs validated
- Clear error messages
- Field-level validation errors

---

## 🚀 **Quick Test Script**

```bash
#!/bin/bash

# Set base URL
BASE_URL="http://localhost:5000/api"

# Test 1: Health check
echo "Testing health endpoint..."
curl -X GET "$BASE_URL/../health"

# Test 2: Register
echo "\nTesting registration..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "fullName": "Test User",
    "registeredMobile": "9876543210"
  }'

# Test 3: Get public jobs
echo "\nTesting public jobs..."
curl -X GET "$BASE_URL/jobs"

echo "\n\nAll tests completed!"
```

---

## 📝 **Summary**

**Total Testable Endpoints:** 70+

**Test Coverage:**

- ✅ Authentication (9 endpoints)
- ✅ Employee Management (6 endpoints)
- ✅ Role Management (6 endpoints)
- ✅ Activity Logs (3 endpoints)
- ✅ Projects (6 endpoints)
- ✅ Jobs (8 endpoints)
- ✅ Applications (7 endpoints)
- ✅ Analytics (6 endpoints)
- ✅ Support Tickets (9 endpoints)
- ✅ Public APIs (6 endpoints)

**WebSocket Events:** 15 events tested

**Ready for Frontend Integration!** 🎉
