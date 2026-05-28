# Government Recruitment Portal - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Authentication & Authorization](#authentication--authorization)
11. [Deployment](#deployment)

---

## 🎯 Project Overview

**Government Recruitment & Examination Management Portal** is an enterprise-level full-stack application designed to manage government job recruitment processes, candidate applications, payments, notifications, and administrative workflows.

### Key Features

- **Multi-role Authentication**: Admin, Employee (with custom roles), and Candidate
- **Job Management**: Create, publish, and manage government job postings
- **Application Processing**: Handle candidate applications with document verification
- **Payment Integration**: Secure payment processing for application fees
- **Real-time Notifications**: WebSocket-based instant updates
- **Support System**: Ticket-based support for candidates
- **Analytics Dashboard**: Comprehensive recruitment analytics
- **Role-based Access Control**: Granular permissions for different employee roles

---

## 🛠 Technology Stack

### Frontend

- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Routing**: React Router DOM 6.28.0
- **State Management**: Zustand 5.0.2
- **Data Fetching**: TanStack React Query 5.62.7
- **Form Handling**: React Hook Form 7.53.2 + Zod validation
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 11.15.0
- **UI Components**: Lucide React (icons), React Hot Toast
- **Tables**: TanStack React Table 8.20.5

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB 8.9.2 (Mongoose ODM)
- **Caching**: Redis (ioredis 5.4.1)
- **Message Queue**: RabbitMQ (amqplib 0.10.4)
- **Real-time**: Socket.IO 4.8.1
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Upload**: Cloudinary 2.5.1
- **Validation**: Zod 3.23.8
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Logging**: Winston 3.17.0
- **Security**: Helmet 8.0.0, express-rate-limit 7.4.1

### Architecture Pattern

- **Microservices Architecture**: 4 independent services
- **API Gateway Pattern**: Centralized routing
- **Event-Driven**: RabbitMQ for async communication
- **Caching Layer**: Redis for session and data caching

---

## 🏗 Architecture

### Microservices Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 5000)                 │
│              Routes requests to microservices                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐   ┌─────────────────┐
│   Identity   │    │   Recruitment    │   │ Communication   │
│   Service    │    │     Service      │   │   & Payment     │
│  (Port 5001) │    │   (Port 5002)    │   │  (Port 5003)    │
└──────────────┘    └──────────────────┘   └─────────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   MongoDB    │    │    Redis     │
            │              │    │   RabbitMQ   │
            └──────────────┘    └──────────────┘
```

### Service Responsibilities

#### 1. **API Gateway** (Port 5000)

- Routes all client requests to appropriate microservices
- CORS handling
- Request logging
- Health check aggregation

#### 2. **Identity Service** (Port 5001)

- User authentication (Admin, Employee, Candidate)
- Employee management
- Role & permission management
- Activity logging & audit trails
- JWT token generation & validation

#### 3. **Recruitment Service** (Port 5002)

- Job posting management
- Project/recruitment drive management
- Application processing & review
- Document verification
- Analytics & reporting
- Public job listings

#### 4. **Communication & Payment Service** (Port 5003)

- Real-time notifications
- Support ticket management
- Payment processing
- Payment gateway configuration
- Email/SMS notifications (via RabbitMQ)

---

## 📁 Project Structure

```
Recruitment-Portal/
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── app/                      # Page components
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── candidate/           # Candidate portal pages
│   │   │   ├── auth/                # Login/Register pages
│   │   │   └── public/              # Public pages
│   │   ├── components/
│   │   │   ├── common/              # Reusable components
│   │   │   ├── layouts/             # Layout components
│   │   │   └── ui/                  # UI components
│   │   ├── lib/                     # Utilities
│   │   ├── routes/                  # Route configuration
│   │   └── constants/               # Constants
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           # Backend Microservices
│   ├── apps/
│   │   ├── api-gateway/              # API Gateway Service
│   │   │   ├── server.js
│   │   │   ├── package.json
│   │   │   ├── Dockerfile
│   │   │   └── .env
│   │   │
│   │   ├── identity-service/         # Identity & Auth Service
│   │   │   ├── src/
│   │   │   │   ├── controllers/     # Auth, Employee, Role, ActivityLog
│   │   │   │   ├── routes/
│   │   │   │   ├── docs/            # Swagger config
│   │   │   │   └── shared/          # Self-contained shared code
│   │   │   │       ├── models/      # Mongoose models
│   │   │   │       ├── middlewares/ # Auth, validation, error handling
│   │   │   │       ├── services/    # Business logic
│   │   │   │       ├── utils/       # Helpers, logger
│   │   │   │       ├── config/      # DB, Redis, RabbitMQ config
│   │   │   │       ├── socket/      # WebSocket handlers
│   │   │   │       └── validations/ # Zod schemas
│   │   │   ├── server.js
│   │   │   ├── package.json
│   │   │   └── Dockerfile
│   │   │
│   │   ├── recruitment-service/      # Recruitment Management
│   │   │   ├── src/
│   │   │   │   ├── controllers/     # Job, Application, Project, Analytics
│   │   │   │   ├── routes/
│   │   │   │   ├── docs/
│   │   │   │   └── shared/          # Same structure as identity-service
│   │   │   ├── server.js
│   │   │   ├── package.json
│   │   │   └── Dockerfile
│   │   │
│   │   └── communication-payment-service/  # Communication & Payment
│   │       ├── src/
│   │       │   ├── controllers/     # Notification, Support, Payment
│   │       │   ├── routes/
│   │       │   ├── docs/
│   │       │   └── shared/          # Same structure
│   │       ├── server.js
│   │       ├── package.json
│   │       └── Dockerfile
│   │
│   ├── scripts/
│   │   └── seed-admin.js            # Database seeding script
│   ├── package.json                 # Root package for running all services
│   ├── .env                         # Environment variables
│   └── docker-compose.microservices.yml
│
└── PROJECT_DOCUMENTATION.md          # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: v6 or higher (or MongoDB Atlas account)
- **Redis**: v7 or higher
- **RabbitMQ**: v3.12 or higher (optional for full functionality)
- **Git**: Latest version

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd Recruitment-Portal
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies for all microservices
npm run install:all

# Or install individually
cd apps/api-gateway && npm install
cd ../identity-service && npm install
cd ../recruitment-service && npm install
cd ../communication-payment-service && npm install
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### 4. Environment Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration (see next section)
```

#### 5. Database Seeding

```bash
cd backend
node scripts/seed-admin.js
```

This creates:

- 5 default roles (Super Admin, Recruitment Admin, Verification Officer, Finance Officer, Support Agent)
- 1 Super Admin user (email: `admin@recruitment.gov.in`, password: `Admin@123456`)

---

## ⚙️ Environment Configuration

### Backend `.env` File

```env
# ─── Server ───────────────────────────────────────────────
NODE_ENV=development
CLIENT_URL=http://localhost:5173
WEBHOOK_BASE_URL=http://localhost:5173

# ─── Microservices Ports ──────────────────────────────────
API_GATEWAY_PORT=5000
IDENTITY_SERVICE_PORT=5001
RECRUITMENT_SERVICE_PORT=5002
COMMUNICATION_SERVICE_PORT=5003

# ─── MongoDB ──────────────────────────────────────────────
MONGODB_URI=mongodb://localhost:27017/recruitment_portal
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recruitment_portal

# ─── JWT ──────────────────────────────────────────────────
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── RabbitMQ ─────────────────────────────────────────────
RABBITMQ_URL=amqp://localhost:5672

# ─── Cloudinary ───────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Email (SMTP) ─────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@recruitment.gov.in

# ─── SMS ──────────────────────────────────────────────────
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=RECRUIT

# ─── Admin Credentials ────────────────────────────────────
ADMIN_EMAIL=admin@recruitment.gov.in
ADMIN_PASSWORD=Admin@123456
```

### Frontend `.env` File

```env
VITE_API_BASE_URL=/api
```

### Production Notes

- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be set in production.
- Set `VITE_API_BASE_URL` to the gateway URL when the frontend is deployed separately.
- Set `WEBHOOK_BASE_URL` to the public callback origin for payment providers.

---

## 🏃 Running the Application

### Development Mode

#### Start All Backend Services (Recommended)

```bash
cd backend
npm run dev
```

This starts all 4 microservices concurrently:

- API Gateway: http://localhost:5000
- Identity Service: http://localhost:5001
- Recruitment Service: http://localhost:5002
- Communication Service: http://localhost:5003

#### Start Individual Services

```bash
cd backend
npm run gateway      # API Gateway only
npm run identity     # Identity Service only
npm run recruitment  # Recruitment Service only
npm run communication # Communication Service only
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: http://localhost:5173

### Production Mode (Docker)

```bash
cd backend
docker-compose -f docker-compose.microservices.yml up -d
```

This starts:

- All 4 microservices
- MongoDB
- Redis
- RabbitMQ

---

## 📚 API Documentation

### Swagger Documentation

Each service has its own Swagger documentation:

- **API Gateway**: http://localhost:5000/api/docs
- **Identity Service**: http://localhost:5001/api/docs
- **Recruitment Service**: http://localhost:5002/api/docs
- **Communication Service**: http://localhost:5003/api/docs

### Authentication

All protected endpoints require JWT Bearer token:

```http
Authorization: Bearer <access_token>
```

### Key API Endpoints

#### Authentication

```
POST /api/auth/admin/login          # Admin login
POST /api/auth/candidate/login      # Candidate login
POST /api/auth/candidate/register   # Candidate registration
POST /api/auth/refresh-token        # Refresh access token
POST /api/auth/logout               # Logout
```

#### Jobs (Public)

```
GET  /api/jobs                      # List all active jobs
GET  /api/jobs/:id                  # Get job details
```

#### Admin - Jobs

```
POST   /api/admin/jobs              # Create job
GET    /api/admin/jobs              # List all jobs
GET    /api/admin/jobs/:id          # Get job details
PUT    /api/admin/jobs/:id          # Update job
DELETE /api/admin/jobs/:id          # Delete job
PATCH  /api/admin/jobs/:id/publish  # Publish job
```

#### Admin - Applications

```
GET   /api/admin/applications       # List applications
GET   /api/admin/applications/:id   # Get application details
PATCH /api/admin/applications/:id/verify    # Verify documents
PATCH /api/admin/applications/:id/status    # Update status
```

#### Candidate - Applications

```
POST  /api/candidate/applications   # Submit application
GET   /api/candidate/applications   # My applications
GET   /api/candidate/applications/:id # Application details
```

#### Admin - Employees

```
POST   /api/admin/employees         # Create employee
GET    /api/admin/employees         # List employees
GET    /api/admin/employees/:id     # Get employee
PUT    /api/admin/employees/:id     # Update employee
DELETE /api/admin/employees/:id     # Delete employee
```

#### Admin - Roles

```
POST   /api/admin/roles             # Create role
GET    /api/admin/roles             # List roles
GET    /api/admin/roles/:id         # Get role
PUT    /api/admin/roles/:id         # Update role
DELETE /api/admin/roles/:id         # Delete role
```

---

## 🗄 Database Schema

### Key Collections

#### Users (Candidates)

```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: Object,
  profilePicture: String,
  isVerified: Boolean,
  status: String (Active/Inactive/Suspended)
}
```

#### Employees (Admin/Staff)

```javascript
{
  fullName: String,
  officialEmail: String (unique),
  password: String (hashed),
  employeeId: String (unique),
  department: String,
  roleDesignation: String,
  systemRole: ObjectId (ref: Role),
  contactNumber: String,
  dateOfJoining: Date,
  status: String (Active/Inactive/Suspended)
}
```

#### Roles

```javascript
{
  roleName: String (unique),
  roleDescription: String,
  isSystemRole: Boolean,
  permissions: {
    jobs: { create, view, edit, delete, download },
    applications: { create, view, edit, delete, download },
    analytics: { create, view, edit, delete, download },
    employees: { create, view, edit, delete, download },
    paymentSettings: { create, view, edit, delete, download },
    support: { create, view, edit, delete, download },
    projects: { create, view, edit, delete, download },
    results: { create, view, edit, delete, download }
  }
}
```

#### Jobs

```javascript
{
  jobTitle: String,
  jobCode: String (unique),
  department: String,
  numberOfPosts: Number,
  qualifications: Array,
  ageLimit: { min, max },
  applicationFee: { general, obc, scst },
  salaryRange: { min, max },
  jobDescription: String,
  responsibilities: Array,
  selectionProcess: Array,
  importantDates: {
    applicationStart, applicationEnd,
    examDate, resultDate
  },
  status: String (Draft/Published/Closed),
  project: ObjectId (ref: Project)
}
```

#### Applications

```javascript
{
  job: ObjectId (ref: Job),
  candidate: ObjectId (ref: User),
  applicationNumber: String (unique),
  personalDetails: Object,
  educationDetails: Array,
  documents: {
    photo, signature, idProof,
    educationCertificates, experienceCertificates
  },
  paymentDetails: {
    amount, transactionId, status, gateway
  },
  status: String (Draft/Submitted/UnderReview/Verified/Rejected),
  verificationNotes: String,
  submittedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: User submits credentials
2. **Validation**: Server validates credentials
3. **Token Generation**: Server generates JWT access token (15min) and refresh token (7 days)
4. **Response**: Tokens sent to client
5. **Storage**: Client stores tokens (localStorage/cookies)
6. **Requests**: Client includes access token in Authorization header
7. **Verification**: Server verifies token on each request
8. **Refresh**: When access token expires, use refresh token to get new access token

### Role-Based Access Control (RBAC)

#### Default Roles

1. **Super Admin**: Full system access
2. **Recruitment Admin**: Manage jobs and applications
3. **Verification Officer**: Verify candidate documents
4. **Finance Officer**: Manage payments and refunds
5. **Support Agent**: Handle support tickets

#### Permission Structure

Each role has granular permissions for 8 modules:

- Jobs
- Applications
- Analytics
- Employees
- Payment Settings
- Support
- Projects
- Results

Each module has 5 permission types:

- Create
- View
- Edit
- Delete
- Download

### Middleware Chain

```
Request → authenticate → authorize → rateLimiter → validate → controller
```

---

## 🚢 Deployment

### Docker Deployment

#### Build Images

```bash
cd backend
docker-compose -f docker-compose.microservices.yml build
```

#### Start Services

```bash
docker-compose -f docker-compose.microservices.yml up -d
```

#### Stop Services

```bash
docker-compose -f docker-compose.microservices.yml down
```

### Individual Service Deployment

Each service can be deployed independently:

```bash
cd backend/apps/identity-service
docker build -t identity-service .
docker run -p 5001:5001 --env-file .env identity-service
```

### Environment-Specific Deployment

#### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure MongoDB Atlas with IP whitelist
- [ ] Set up Redis cluster
- [ ] Configure RabbitMQ cluster
- [ ] Set up Cloudinary account
- [ ] Configure SMTP for emails
- [ ] Set up SMS gateway
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure logging aggregation
- [ ] Set up backup strategy

---

## 📊 Key Features Explained

### 1. Real-time Updates (WebSocket)

- Instant notifications for candidates
- Live application status updates
- Real-time dashboard updates for admins
- Support ticket updates

### 2. File Upload & Management

- Cloudinary integration for image/document storage
- Automatic image optimization
- Secure file access with signed URLs
- Support for multiple file formats

### 3. Payment Processing

- Multiple payment gateway support
- Secure payment handling
- Automatic receipt generation
- Refund management

### 4. Analytics Dashboard

- Application funnel analysis
- Job performance metrics
- Payment analytics
- Demographic insights
- Export to CSV/PDF

### 5. Support System

- Ticket-based support
- Priority levels
- Assignment to support agents
- Status tracking
- File attachments

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# Or check service status
sudo systemctl status mongod
```

#### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

#### Port Already in Use

```bash
# Kill processes on ports
npm run kill-ports

# Or manually
npx kill-port 5000 5001 5002 5003
```

#### Seed Script Fails

```bash
# Ensure MongoDB is running and accessible
# Check MONGODB_URI in .env
# Run seed script with verbose logging
node scripts/seed-admin.js
```

---

## 📞 Support & Contact

For issues, questions, or contributions:

- Create an issue in the repository
- Contact: support@recruitment.gov.in

---

## 📄 License

This project is proprietary software developed for government recruitment management.

---

**Last Updated**: May 2026
**Version**: 1.0.0

---

## 🔄 User Flows & Workflows

### 1. Candidate Flow (Job Application Process)

#### A. Registration & Login

```
1. Visit Portal → Click "Register as Candidate"
2. Fill Registration Form:
   - Full Name, Email, Phone, Password
   - Date of Birth, Gender
   - Address Details
3. Submit → Receive Verification Email
4. Verify Email → Account Activated
5. Login with Email & Password
```

#### B. Job Search & Application

```
1. Login to Candidate Dashboard
2. Browse Available Jobs:
   - Filter by: Department, Qualification, Location
   - Search by: Job Title, Job Code
3. View Job Details:
   - Job Description, Qualifications
   - Salary Range, Number of Posts
   - Important Dates, Selection Process
4. Click "Apply Now"
```

#### C. Application Submission

```
1. Fill Application Form (Multi-step):

   Step 1: Personal Details
   - Name, Father's Name, Mother's Name
   - Date of Birth, Gender, Category (General/OBC/SC/ST)
   - Contact Details, Address

   Step 2: Educational Qualifications
   - Add Education Records (10th, 12th, Graduation, etc.)
   - Board/University, Year, Percentage/CGPA

   Step 3: Document Upload
   - Photo (passport size)
   - Signature
   - ID Proof (Aadhar/PAN)
   - Educational Certificates
   - Category Certificate (if applicable)

   Step 4: Review & Declaration
   - Review all entered information
   - Accept terms & conditions
   - Submit Application

2. Application Saved as "Draft"
3. Proceed to Payment
```

#### D. Payment Process

```
1. View Application Fee:
   - General: ₹500
   - OBC: ₹300
   - SC/ST: ₹100 (or Free)

2. Select Payment Gateway:
   - Credit/Debit Card
   - Net Banking
   - UPI
   - Wallet

3. Complete Payment
4. Payment Success → Application Status: "Submitted"
5. Download Application Receipt & Payment Receipt
```

#### E. Track Application

```
1. Go to "My Applications"
2. View Application Status:
   - Submitted → Under Review → Verified → Admit Card Available
   - Or: Rejected (with reason)
3. Receive Real-time Notifications:
   - Application received
   - Document verification status
   - Admit card available
   - Result published
4. Download Admit Card (when available)
5. Check Results
```

#### F. Support & Queries

```
1. Go to "Support" section
2. Create Support Ticket:
   - Select Category (Payment, Application, Technical)
   - Describe Issue
   - Attach Screenshots (if needed)
3. Submit Ticket
4. Track Ticket Status
5. Receive Response from Support Agent
6. Close Ticket when resolved
```

---

### 2. Admin Flow (Super Admin)

#### A. Login & Dashboard

```
1. Visit Admin Portal
2. Login with Admin Credentials:
   - Email: admin@recruitment.gov.in
   - Password: Admin@123456
3. View Dashboard:
   - Total Jobs, Applications, Candidates
   - Recent Activities
   - Payment Statistics
   - System Health
```

#### B. Employee Management

```
1. Go to "Employees" section
2. View All Employees (with roles)

Create New Employee:
3. Click "Add Employee"
4. Fill Employee Details:
   - Full Name, Email, Phone
   - Employee ID, Department
   - Role Designation
   - Assign System Role (Recruitment Admin, Verification Officer, etc.)
   - Date of Joining
5. Submit → Employee Created
6. Employee receives login credentials via email

Manage Employees:
7. Edit Employee Details
8. Change Employee Role
9. Activate/Deactivate Employee
10. View Employee Activity Logs
```

#### C. Role & Permission Management

```
1. Go to "Roles & Permissions"
2. View All Roles

Create Custom Role:
3. Click "Create Role"
4. Enter Role Name & Description
5. Set Permissions for each module:
   - Jobs: ✓ Create, ✓ View, ✓ Edit, ✗ Delete, ✓ Download
   - Applications: ✓ View, ✓ Edit, ✗ Delete
   - Analytics: ✓ View, ✗ Edit
   - Employees: ✗ Create, ✓ View, ✗ Edit, ✗ Delete
   - Payment Settings: ✗ All
   - Support: ✓ View, ✓ Edit
   - Projects: ✓ View
   - Results: ✓ View, ✓ Download
6. Save Role

Assign Role:
7. Go to Employee → Edit
8. Select Role from Dropdown
9. Save → Permissions Applied
```

#### D. Recruitment Project Management

```
1. Go to "Projects"
2. Click "Create Project"
3. Fill Project Details:
   - Project Name (e.g., "Police Recruitment 2026")
   - Description
   - Start Date, End Date
   - Department
   - Total Positions
4. Submit → Project Created
5. Add Jobs to Project
```

#### E. Job Management

```
Create Job:
1. Go to "Jobs" → "Create Job"
2. Fill Job Details:
   - Job Title, Job Code
   - Department, Category
   - Number of Posts
   - Qualifications Required
   - Age Limit (Min-Max)
   - Salary Range
   - Job Description
   - Responsibilities
   - Selection Process
3. Set Application Fee:
   - General Category: ₹500
   - OBC: ₹300
   - SC/ST: ₹100
4. Set Important Dates:
   - Application Start Date
   - Application End Date
   - Exam Date
   - Result Date
5. Save as Draft

Publish Job:
6. Review Job Details
7. Click "Publish"
8. Job becomes visible to candidates
9. Notifications sent to registered candidates

Manage Jobs:
10. Edit Job Details (before applications start)
11. Extend Application Deadline
12. Close Job (stop accepting applications)
13. View Job Statistics (applications, payments)
```

#### F. Application Review & Management

```
1. Go to "Applications"
2. Filter Applications:
   - By Job
   - By Status (Submitted, Under Review, Verified, Rejected)
   - By Date Range
   - By Category

Review Application:
3. Click on Application
4. View Complete Application:
   - Personal Details
   - Educational Qualifications
   - Uploaded Documents
   - Payment Status
5. Verify Documents:
   - Check Photo, Signature
   - Verify ID Proof
   - Verify Educational Certificates
   - Verify Category Certificate
6. Actions:
   - Approve → Status: "Verified"
   - Reject → Add Rejection Reason
   - Request Clarification → Send message to candidate
7. Add Verification Notes
8. Submit Decision

Bulk Actions:
9. Select Multiple Applications
10. Bulk Approve/Reject
11. Export to Excel/CSV
```

#### G. Analytics & Reports

```
1. Go to "Analytics"
2. View Dashboards:

   Application Funnel:
   - Total Applications
   - Submitted vs Draft
   - Verified vs Rejected
   - Payment Success Rate

   Job Performance:
   - Top Jobs by Applications
   - Department-wise Distribution
   - Category-wise Distribution

   Payment Analytics:
   - Total Revenue
   - Payment Gateway Performance
   - Refund Statistics

   Demographics:
   - Age Distribution
   - Gender Distribution
   - State-wise Distribution
   - Qualification-wise Distribution

3. Generate Reports:
   - Select Report Type
   - Choose Date Range
   - Apply Filters
   - Export as PDF/Excel
```

#### H. Payment Management

```
1. Go to "Payments"
2. View All Transactions:
   - Successful, Failed, Pending
   - Filter by Date, Gateway, Amount

Payment Gateway Configuration:
3. Go to "Payment Gateways"
4. Add/Edit Gateway:
   - Gateway Name (Razorpay, PayU, etc.)
   - API Credentials
   - Enable/Disable
   - Set as Default
5. Test Gateway Connection

Refund Management:
6. Go to Application → Payment Details
7. Click "Initiate Refund"
8. Enter Refund Reason
9. Process Refund
10. Candidate receives refund notification
```

#### I. Support Ticket Management

```
1. Go to "Support Tickets"
2. View All Tickets:
   - Open, In Progress, Resolved, Closed
   - Filter by Priority, Category

Handle Ticket:
3. Click on Ticket
4. View Ticket Details:
   - Candidate Information
   - Issue Description
   - Attachments
5. Assign to Support Agent (if not self)
6. Add Response/Solution
7. Change Status:
   - Open → In Progress → Resolved
8. Close Ticket
9. Candidate receives notification
```

#### J. Activity Logs & Audit

```
1. Go to "Activity Logs"
2. View All System Activities:
   - User Logins
   - Application Submissions
   - Document Verifications
   - Payment Transactions
   - Role Changes
   - Employee Actions

3. Filter Logs:
   - By User/Employee
   - By Action Type
   - By Date Range
   - By Module

4. Export Logs for Audit
```

---

### 3. Recruitment Admin Flow

#### Permissions

- ✅ Full access to Jobs & Applications
- ✅ Full access to Projects
- ✅ View Analytics
- ✅ View Employees
- ✅ Manage Support Tickets
- ❌ Cannot manage Employees
- ❌ Cannot manage Payment Settings

#### Workflow

```
1. Login to Admin Portal
2. Dashboard Overview:
   - Jobs under management
   - Pending applications
   - Recent activities

3. Create & Manage Jobs:
   - Create new job postings
   - Edit job details
   - Publish/Close jobs
   - View job statistics

4. Review Applications:
   - View all applications for assigned jobs
   - Verify documents
   - Approve/Reject applications
   - Add verification notes

5. Manage Projects:
   - Create recruitment projects
   - Add jobs to projects
   - Track project progress

6. Handle Support:
   - View support tickets related to jobs
   - Respond to candidate queries
   - Resolve issues

7. View Reports:
   - Application statistics
   - Job performance reports
   - Export data
```

---

### 4. Verification Officer Flow

#### Permissions

- ✅ View Jobs
- ✅ View & Edit Applications (Document Verification)
- ✅ View Analytics
- ❌ Cannot create/delete Jobs
- ❌ Cannot manage Employees
- ❌ Cannot manage Payments

#### Workflow

```
1. Login to Portal
2. Dashboard:
   - Applications pending verification
   - Today's verification count
   - Rejection statistics

3. Application Verification Process:

   Step 1: Open Application Queue
   - View applications assigned for verification
   - Filter by job, date, priority

   Step 2: Review Application
   - Check personal details accuracy
   - Verify photo quality (passport size, clear)
   - Verify signature

   Step 3: Document Verification
   - ID Proof (Aadhar/PAN):
     ✓ Check name matches
     ✓ Check date of birth matches
     ✓ Check document is clear and valid

   - Educational Certificates:
     ✓ Verify 10th marksheet
     ✓ Verify 12th marksheet
     ✓ Verify graduation degree
     ✓ Check marks/percentage meets job requirement
     ✓ Verify board/university authenticity

   - Category Certificate (if applicable):
     ✓ Check certificate validity
     ✓ Verify issuing authority
     ✓ Check expiry date

   Step 4: Decision
   - If all documents valid:
     → Mark as "Verified"
     → Add verification notes

   - If documents invalid/unclear:
     → Mark as "Rejected"
     → Specify rejection reason
     → List which documents are problematic

   - If need clarification:
     → Mark as "Clarification Required"
     → Send message to candidate
     → Request specific documents/information

4. Bulk Verification:
   - Select multiple applications
   - Verify in batch (if all meet criteria)

5. Reports:
   - Daily verification count
   - Rejection reasons analysis
   - Performance metrics
```

---

### 5. Finance Officer Flow

#### Permissions

- ✅ View Jobs & Applications
- ✅ Full access to Payment Settings
- ✅ View & Edit Analytics
- ❌ Cannot create/edit Jobs
- ❌ Cannot manage Employees

#### Workflow

```
1. Login to Portal
2. Dashboard:
   - Total revenue today/month
   - Pending payments
   - Failed transactions
   - Refund requests

3. Payment Monitoring:

   View Transactions:
   - All payment transactions
   - Filter by status, date, gateway
   - Search by transaction ID, application number

   Transaction Details:
   - Candidate information
   - Application details
   - Payment amount
   - Gateway used
   - Transaction ID
   - Payment timestamp
   - Status (Success/Failed/Pending)

4. Failed Payment Resolution:
   - View failed transactions
   - Check failure reason
   - Contact payment gateway support
   - Manually verify if payment deducted
   - Update payment status if needed
   - Notify candidate

5. Refund Management:

   Process Refund:
   - View refund requests
   - Verify refund eligibility
   - Check original payment details
   - Initiate refund through gateway
   - Update refund status
   - Generate refund receipt
   - Notify candidate

   Refund Scenarios:
   - Job cancelled by department
   - Duplicate payment
   - Technical error
   - Candidate withdrawal (if allowed)

6. Payment Gateway Management:

   Configure Gateways:
   - Add new payment gateway
   - Update API credentials
   - Set transaction limits
   - Enable/disable gateways
   - Set default gateway
   - Test gateway connection

   Monitor Gateway Performance:
   - Success rate by gateway
   - Average transaction time
   - Failure analysis
   - Cost comparison

7. Financial Reports:

   Generate Reports:
   - Daily collection report
   - Monthly revenue report
   - Gateway-wise collection
   - Category-wise collection (General/OBC/SC/ST)
   - Refund report
   - Outstanding payments

   Export Reports:
   - Excel format for accounting
   - PDF for management
   - CSV for analysis

8. Reconciliation:
   - Match gateway settlements with records
   - Identify discrepancies
   - Generate reconciliation report
   - Submit to accounts department
```

---

### 6. Support Agent Flow

#### Permissions

- ✅ View Jobs & Applications (read-only)
- ✅ Full access to Support Tickets
- ❌ Cannot modify Jobs or Applications
- ❌ Cannot manage Employees or Payments

#### Workflow

```
1. Login to Portal
2. Dashboard:
   - Open tickets count
   - Tickets assigned to me
   - Average resolution time
   - Pending tickets

3. Ticket Management:

   View Tickets:
   - All support tickets
   - Filter by:
     → Status (Open, In Progress, Resolved, Closed)
     → Priority (Low, Medium, High, Urgent)
     → Category (Payment, Application, Technical, General)
     → Date range

   Ticket Assignment:
   - Auto-assigned tickets appear in "My Tickets"
   - Can pick unassigned tickets
   - Can reassign to other agents

4. Handle Support Ticket:

   Step 1: Open Ticket
   - View ticket details
   - Read candidate's issue
   - Check attachments/screenshots
   - View candidate's application history

   Step 2: Investigate
   - Check application status
   - Verify payment status
   - Review documents if needed
   - Check system logs
   - Identify root cause

   Step 3: Respond
   - Add response message
   - Provide solution/guidance
   - Request additional information if needed
   - Attach helpful documents/guides
   - Set ticket status to "In Progress"

   Step 4: Resolve
   - Implement solution (if within authority)
   - Escalate to relevant department if needed
   - Follow up with candidate
   - Mark as "Resolved" when fixed
   - Add resolution notes

   Step 5: Close
   - Confirm with candidate
   - Close ticket
   - Add feedback/learnings

5. Common Support Scenarios:

   Payment Issues:
   - "Payment deducted but application not submitted"
     → Check transaction ID
     → Verify with finance team
     → Update payment status
     → Notify candidate

   - "Payment failed but money deducted"
     → Verify bank statement
     → Check gateway logs
     → Initiate refund if confirmed

   Application Issues:
   - "Cannot upload documents"
     → Check file size/format
     → Guide on proper format
     → Test upload functionality

   - "Application rejected - need clarification"
     → Check rejection reason
     → Explain verification criteria
     → Guide on reapplication (if allowed)

   Login Issues:
   - "Forgot password"
     → Send password reset link
     → Verify email/phone

   - "Account locked"
     → Verify identity
     → Unlock account
     → Reset password

   Technical Issues:
   - "Website not loading"
     → Check system status
     → Clear cache/cookies
     → Try different browser

   - "Error while submitting form"
     → Check error logs
     → Identify bug
     → Report to tech team
     → Provide workaround

6. Knowledge Base Management:
   - Create FAQ articles
   - Update help documentation
   - Add troubleshooting guides
   - Share common solutions

7. Reports:
   - Tickets handled today/week/month
   - Average resolution time
   - Customer satisfaction rating
   - Common issues analysis
```

---

## 🔄 Complete Application Lifecycle

### End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    JOB POSTING PHASE                         │
└─────────────────────────────────────────────────────────────┘
1. Admin creates Recruitment Project
2. Recruitment Admin creates Job under Project
3. Admin reviews and publishes Job
4. Job appears on public portal
5. Notifications sent to registered candidates

┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION PHASE                           │
└─────────────────────────────────────────────────────────────┘
6. Candidate browses jobs
7. Candidate fills application form
8. Candidate uploads documents
9. Application saved as "Draft"
10. Candidate proceeds to payment

┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT PHASE                             │
└─────────────────────────────────────────────────────────────┘
11. Candidate selects payment gateway
12. Payment processed
13. If success:
    → Application status: "Submitted"
    → Receipt generated
    → Notification sent
14. If failed:
    → Application remains "Draft"
    → Candidate can retry payment
    → Support ticket can be raised

┌─────────────────────────────────────────────────────────────┐
│                  VERIFICATION PHASE                          │
└─────────────────────────────────────────────────────────────┘
15. Application enters verification queue
16. Verification Officer assigned
17. Officer verifies:
    - Personal details
    - Documents (photo, signature, ID, certificates)
    - Eligibility criteria
18. Decision:
    - Approved → Status: "Verified"
    - Rejected → Status: "Rejected" (with reason)
    - Clarification → Status: "Clarification Required"
19. Candidate receives notification

┌─────────────────────────────────────────────────────────────┐
│                    EXAM PHASE                                │
└─────────────────────────────────────────────────────────────┘
20. Admin generates admit cards for verified candidates
21. Candidates download admit cards
22. Exam conducted (offline/online)
23. Admin uploads exam results

┌─────────────────────────────────────────────────────────────┐
│                    RESULT PHASE                              │
└─────────────────────────────────────────────────────────────┘
24. Admin publishes results
25. Candidates check results on portal
26. Selected candidates receive offer letters
27. Rejected candidates can view scores/feedback

┌─────────────────────────────────────────────────────────────┐
│                  SUPPORT THROUGHOUT                          │
└─────────────────────────────────────────────────────────────┘
At any stage:
- Candidate can raise support ticket
- Support Agent responds
- Issue resolved
- Ticket closed
```

---

## 🎯 Role-Based Dashboard Views

### Candidate Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome, [Candidate Name]                    🔔 Notifications│
├─────────────────────────────────────────────────────────────┤
│  Quick Stats:                                                │
│  📝 Applications: 3    ✅ Verified: 1    ⏳ Pending: 2      │
│  💰 Payments: ₹1,200   📄 Admit Cards: 1                    │
├─────────────────────────────────────────────────────────────┤
│  Active Jobs (12)                          [View All Jobs]   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Police Constable - 500 Posts                         │   │
│  │ Apply by: 31 Dec 2026          [Apply Now]           │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  My Applications                      [View All Applications]│
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Police Constable - APP123456                         │   │
│  │ Status: Verified ✅            [View Details]        │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Recent Notifications                                        │
│  • Your application APP123456 has been verified             │
│  • Admit card available for download                        │
│  • New job posted: Forest Guard                             │
└─────────────────────────────────────────────────────────────┘
```

### Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                          👤 Super Admin     │
├─────────────────────────────────────────────────────────────┤
│  Overview:                                                   │
│  📋 Jobs: 25      👥 Candidates: 15,234    💰 Revenue: ₹76L │
│  📝 Applications: 45,678    ✅ Verified: 32,456             │
├─────────────────────────────────────────────────────────────┤
│  Quick Actions:                                              │
│  [Create Job] [Add Employee] [View Reports] [Support]       │
├─────────────────────────────────────────────────────────────┤
│  Recent Activities:                                          │
│  • 234 new applications today                               │
│  • 156 applications verified                                │
│  • ₹1.2L collected today                                    │
│  • 12 support tickets resolved                              │
├─────────────────────────────────────────────────────────────┤
│  Application Funnel:                                         │
│  Draft: 1,234 → Submitted: 45,678 → Verified: 32,456       │
├─────────────────────────────────────────────────────────────┤
│  Top Jobs by Applications:                                   │
│  1. Police Constable - 12,345 applications                  │
│  2. Forest Guard - 8,234 applications                       │
│  3. Clerk - 6,789 applications                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Documentation Complete!** 🎉
