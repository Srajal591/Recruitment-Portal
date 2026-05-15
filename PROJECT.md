# Government Recruitment & Examination Management Portal

## 1. Project Overview

| Field | Details |
|---|---|
| **Project Name** | Government Recruitment & Examination Management Portal |
| **Project Type** | Enterprise-Level Government Recruitment System (MERN Stack) |
| **Stack** | MongoDB · Express.js · React.js · Node.js |
| **Architecture** | Modular Monorepo (Turborepo) with service separation |

### Main Objective

Build a scalable government recruitment portal where government departments can manage complete recruitment workflows — from job publishing to result declaration.

The system is designed for:
- High-traffic recruitment periods (lakhs of concurrent candidates)
- Secure document handling (Cloudinary)
- Dynamic, configurable application workflows
- Role-based administrative operations
- Future scalability without major refactoring

> This is **not** a simple CRUD application. It is a **workflow-based recruitment management system**.

---

## 2. Main System Structure

### A. Public Website
Public pages accessible without login.

**Purpose:**
- Show recruitment information and latest jobs
- Display notices, results, and admit cards
- Help candidates understand the recruitment process

### B. Candidate / User Portal
Portal where candidates can:
- Register, login, and verify via OTP
- Complete their profile
- Apply for jobs through multi-step dynamic forms
- Upload documents
- Make payments (UPI, Card, Net Banking)
- Download admit cards
- View results and merit lists
- Raise support tickets

### C. Admin Management System

Currently there is **only ONE MAIN ADMIN**.

This admin has complete access to the platform and can:
- Create jobs and recruitment projects
- Manage applications and verify candidates
- Manage payments and support tickets
- Create employees / sub-admins
- Assign roles and permissions

**Main Architecture:**
```
SUPER ADMIN (Main Admin)
        ↓ Creates & Manages
        ↓
  Employees / Sub Roles
```

---

## 3. Role System Architecture

### Important Clarification

Currently:
- Only **ONE MAIN ADMIN** exists
- All permissions belong to this admin
- Other users are **employee roles** created by the admin
- These are **NOT** independent admins — they are controlled roles

### Main Role Hierarchy

```
Main Admin
    │
    ├── Recruitment Admin
    ├── Verification Officer
    ├── Finance Officer
    ├── Support / Helpdesk
    └── Other Employees
```

---

## 4. Role Responsibilities

### 1. Main Admin — Highest Authority

The main admin controls the complete system.

**Responsibilities:**
- Create recruitment projects and jobs
- Configure eligibility and application forms
- Manage payments, applications, and employees
- Create roles and assign permissions
- Monitor analytics and audit logs
- Manage the support system

**Access Level:** Full system access

---

### 2. Recruitment Admin

Created by the main admin.

**Responsibilities:**
- Manage jobs and recruitment workflows
- Review applications
- Publish notices and results

**Access:** Recruitment-related modules only

---

### 3. Verification Officer

Created and managed by admin.

**Responsibilities:**
- Verify candidate documents
- Approve or reject applications
- Request document corrections

**Access:** Verification modules only

---

### 4. Finance Officer

Created and managed by admin.

**Responsibilities:**
- Verify payments
- Manage refunds
- Track transactions

**Access:** Payment-related modules only

---

### 5. Support / Helpdesk

Created and managed by admin.

**Responsibilities:**
- Resolve support tickets
- Manage candidate issues
- Escalate problems

**Access:** Support / helpdesk modules only

---

### 6. Candidate / User

Normal platform users.

**Responsibilities:**
- Register, login, and apply for jobs
- Upload documents and make payments
- Download admit cards and view results

**Access:** Candidate portal only

---

## 5. Main System Flow

### Recruitment Workflow

```
Main Admin Creates Recruitment Project
        ↓
Main Admin Creates Jobs & Vacancies
        ↓
Admin Configures Forms & Eligibility
        ↓
Jobs Published on Public Website
        ↓
Candidates Register / Login
        ↓
Candidate Fills Application Form
        ↓
Documents Uploaded
        ↓
Payment Completed
        ↓
Application Submitted
        ↓
Verification Officer Reviews Application
        ↓
Recruitment Admin Approves Workflow
        ↓
Admit Cards Generated
        ↓
Exam Conducted
        ↓
Results Published
```

---

## 6. Public Website Modules

These pages are public and accessible without login.

| Page | Purpose |
|---|---|
| Homepage | Recruitment announcements, hero section, eligibility filter |
| Latest Jobs | Browse all active job postings |
| Notices | Official recruitment notices |
| Results | Published exam results |
| Admit Cards | Download admit cards (public access) |
| Downloads | Official documents and notifications |
| FAQs | Candidate guidance |
| Contact Page | Helpline and contact information |
| About Page | Portal and organization information |

---

## 7. Candidate Portal Modules

### Authentication
- Register (with mobile OTP verification)
- Login
- OTP verification
- Forgot password / Reset password

### Profile Management
- Personal details (name, DOB, gender, category, religion, etc.)
- Education details (10th, 12th, graduation, post-graduation)
- Experience details
- Address details (permanent + correspondence)
- Category information (General / OBC / SC / ST / EWS)

### Application System
- Multi-step dynamic forms (configured by admin)
- Autosave drafts at each step
- Preview application before submission
- Post selection (apply for multiple posts in one application)
- Final submission with declaration

### Document Management
- Upload documents (photo, signature, certificates, ID proof, etc.)
- Re-upload on rejection request
- Verification status tracking

### Payment System
- UPI (PhonePe, Google Pay, Paytm, BHIM)
- Debit / Credit cards (Visa, Mastercard, RuPay)
- Net banking (all major banks)
- Payment history and receipts

### Examination Features
- Admit card download
- Exam center details
- Result checking
- Merit lists

### Support System
- Raise support tickets
- View ticket replies
- Track ticket status

### Notifications
- Email alerts
- SMS alerts
- In-app notifications

---

## 8. Admin Panel Modules

### Dashboard
- Total applications, jobs, revenue analytics
- Active recruitments overview
- Application conversion funnel
- Critical alerts

### Recruitment Management
- Create and manage projects
- Create jobs (6-step wizard: Basic Info → Eligibility → Form Builder → Documents → Payment → Review)
- Vacancy management (total posts + SC/ST/OBC/EWS/PWD reservations)
- Eligibility management (age limits, education, experience, physical/medical standards)

### Dynamic Form Builder
- Create form sections
- Add dynamic fields (text, textarea, email, phone, number, date, dropdown, radio, checkbox, file upload)
- Configure conditional logic
- Configure validation rules
- Forms are **never hardcoded** — fully configurable per job

### Candidate Management
- Review applications with filters (status, job, department)
- Approve / reject applications
- Bulk operations
- Application scoring

### Document Verification
- Verify uploaded documents
- Reject with reason
- Request re-upload

### Payment Management
- Payment tracking and reconciliation
- Refund management
- Gateway configuration (Razorpay, Cashfree, BillDesk, CCAvenue)
- Settlement monitoring

### Support Management
- Ticket dashboard (list + Kanban view)
- Assignment workflows
- Priority management (Critical / High / Medium / Low)
- Ticket analytics

### Employee & Role Management
- Add employees with personal + employment details
- Assign system roles (Admin / Reviewer / Support)
- Create custom roles with permission matrix
- Permission matrix: 5 modules x 5 actions (Create / View / Edit / Delete / Download)
- RBAC is **database-driven**, not hardcoded

### Analytics & Reports
- Application conversion funnel (Started → Filled → Uploaded → Paid → Submitted)
- Top jobs by applicants
- Payment success rates
- Support snapshot
- Exportable reports (CSV)

### Audit Logs
Track all:
- Employee activities
- Admin actions
- Sensitive data changes
- Payment updates

---

## 9. Complete Data Models

### Candidate / User
```
fullName, dateOfBirth, gender, category (General/OBC/SC/ST/EWS),
fatherName, motherName, maritalStatus, religion, identificationMark,
registeredMobile, isDomicileOfBihar, email, password (hashed)
```

### Education
```
10th:        board, school, rollNumber, year, percentage
12th:        board, stream (Science/Commerce/Arts), school, rollNumber, year, percentage
Graduation:  degree, university, year, percentage
hasPostGraduation: boolean
```

### Additional Info
```
isGovtEmployee, departmentName, yearsOfService,
isExServiceman, isPwD, disabilityType, disabilityPercentage,
drivingLicense, computerCertificate, subjectCombination
```

### Address
```
permanent:       addressLine1, addressLine2, state, district, policeStation, pincode
correspondence:  same fields + sameAsPermanent flag
```

### Documents (10 types)
```
passport_photo           (JPEG, max 100KB)
signature                (JPEG, max 100KB)
tenth_certificate        (PDF/JPG, max 500KB)
twelfth_certificate      (PDF/JPG, max 500KB)
graduation_certificate   (PDF/JPG, max 500KB)
category_certificate     (PDF/JPG, max 500KB)
aadhar_card              (PDF/JPG, max 500KB)
driving_license          (optional, PDF/JPG, max 500KB)
computer_certificate     (optional, PDF/JPG, max 500KB)
domicile_certificate     (optional, PDF/JPG, max 500KB)
```

### Job
```
title, postCode, department, category, totalPosts,
reservedPosts: { sc, st, obc, ews, pwd },
salaryRange: { min, max },
jobType (Permanent/Contract/Temporary),
workLocation, description,
applicationFee: { general, scSt, pwd },
applicationDeadline, examDate,
ageLimit: { min, max, relaxation: { sc, st, obc, pwd } },
education: { essential[], desirable[] },
experience: { required, years, type, description },
physicalStandards: { required, height, chest, weight },
medicalStandards: { required, vision, hearing },
formSections: [ { title, required, fields: [ { type, label, required, placeholder, options[] } ] } ],
documents: [ { name, required, formats[], maxSize, description } ],
payment: { applicationFee, examFee, processingFee, paymentMethods[], refundPolicy, paymentDeadline },
status: draft | active | closed | completed,
projectId
```

### Project
```
name, department, state, totalJobs, applicants, revenue,
status: Active | Completed | Upcoming,
duration, startDate, endDate
```

### Application
```
applicationId, candidateId, jobId, appliedPosts[],
status: draft | submitted | under_review | approved | rejected | shortlisted,
paymentStatus: pending | paid | failed,
documentStatus: incomplete | pending | complete,
score (percentage), appliedDate, transactionId, totalFee
```

### Employee (Admin Staff)
```
fullName, dateOfBirth, gender, contactNumber,
department, roleDesignation, employeeId, dateOfJoining,
officialEmail, password (hashed), systemRole,
status: Active | Inactive | On Leave
```

### Role (RBAC)
```
roleName, roleDescription,
permissions: {
  jobs:            { create, view, edit, delete, download },
  applications:    { create, view, edit, delete, download },
  analytics:       { create, view, edit, delete, download },
  employees:       { create, view, edit, delete, download },
  paymentSettings: { create, view, edit, delete, download }
}
```

### Support Ticket
```
ticketId, title, description, candidateId, email,
priority: Critical | High | Medium | Low,
status: Open | In Progress | Resolved,
assignee, category: Technical | Payment | General,
createdAt, updatedAt, replies[]
```

### Activity Log
```
timestamp, employeeId, action: CREATE | UPDATE | DELETE | VIEW | DOWNLOAD,
module: Jobs | Applications | Settings | Support | Applicants | Payments,
details, ipAddress
```

### Payment Gateway Config
```
name: Razorpay | Cashfree | BillDesk | CCAvenue,
status: ACTIVE | INACTIVE | LIMITED,
mode: Live | Test,
apiKey (encrypted), secretKey (encrypted),
lastUpdated, settlementDays
```

---

## 10. Key Business Rules

1. **Bihar domicile** — candidates must declare domicile status; affects eligibility for reserved posts
2. **Category-based fees** — General/OBC pay full fee, SC/ST pay reduced fee, PWD often exempt
3. **Reserved posts** — SC/ST/OBC/EWS/PWD quotas enforced per job
4. **Age relaxation** — applied per category per job configuration
5. **Multi-post application** — one application, multiple posts, cumulative fee
6. **Draft autosave** — each application step saves as draft automatically
7. **Document file size limits** — photo/signature 100KB, certificates 500KB
8. **Subject combination locked** — cannot change after final submission; printed on admit card
9. **Payment deadline** — 24 hours after post selection
10. **RBAC database-driven** — 5 modules x 5 actions permission matrix, never hardcoded
11. **Activity logging** — every admin/employee action must be logged with timestamp and IP
12. **Payment gateway failover** — multiple gateways configured with fallback support
13. **Dynamic forms** — admin configures all form fields; nothing is hardcoded in the application flow

---

## 11. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework |
| JavaScript (ES6+) | Language (no TypeScript) |
| Tailwind CSS | Styling |
| React Hook Form | Form state management |
| Zod | Schema validation |
| TanStack Query | Server state / API caching |
| Zustand | Global client state |
| Axios | HTTP client |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP framework |
| MongoDB | Primary database |
| Mongoose | ODM |
| JWT (Access + Refresh) | Authentication |
| Redis | Caching + session store |
| RabbitMQ | Message queue (email, SMS, PDF, analytics) |
| Cloudinary | File storage |
| Multer | File upload middleware |
| bcrypt | Password hashing |
| Zod / Joi | Input validation |

---

## 12. Current Frontend Structure (Actual)

```
frontend/src/
│
├── app/
│   ├── admin/                        (28 files — all built)
│   │   ├── Dashboard.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobCreate.jsx
│   │   ├── JobBasicInfo.jsx
│   │   ├── JobEligibility.jsx
│   │   ├── JobFormBuilder.jsx
│   │   ├── JobDocuments.jsx
│   │   ├── JobPayment.jsx
│   │   ├── JobReview.jsx
│   │   ├── JobStepProgress.jsx
│   │   ├── Applications.jsx
│   │   ├── ApplicationDetails.jsx
│   │   ├── Projects.jsx
│   │   ├── CreateProject.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── Employees.jsx
│   │   ├── AddEmployee.jsx
│   │   ├── EmployeeActivityDetails.jsx
│   │   ├── Roles.jsx
│   │   ├── CreateRole.jsx
│   │   ├── Support.jsx
│   │   ├── SupportKanban.jsx
│   │   ├── SupportTicketDetails.jsx
│   │   ├── Analytics.jsx
│   │   ├── ActivityLogs.jsx
│   │   ├── PaymentSettings.jsx
│   │   ├── RazorpayConfig.jsx
│   │   └── AddPaymentGateway.jsx
│   │
│   ├── application/                  (9 files — complete flow built)
│   │   ├── PersonalDetails.jsx
│   │   ├── Education.jsx
│   │   ├── AdditionalInfo.jsx
│   │   ├── Address.jsx
│   │   ├── Documents.jsx
│   │   ├── Review.jsx
│   │   ├── PostSelection.jsx
│   │   ├── Payment.jsx
│   │   └── Success.jsx
│   │
│   ├── auth/                         (7 files)
│   │   ├── Login.jsx                 (built)
│   │   ├── CandidateLogin.jsx        (built)
│   │   ├── AdminLogin.jsx            (built)
│   │   ├── VerifyOTP.jsx             (built)
│   │   ├── Register.jsx              (coming soon placeholder)
│   │   ├── ForgotPassword.jsx        (coming soon placeholder)
│   │   └── ResetPassword.jsx         (coming soon placeholder)
│   │
│   ├── candidate/                    (10 files)
│   │   ├── Dashboard.jsx             (built)
│   │   ├── Profile.jsx               (coming soon placeholder)
│   │   ├── Jobs.jsx                  (coming soon placeholder)
│   │   ├── Applications.jsx          (coming soon placeholder)
│   │   ├── Documents.jsx             (coming soon placeholder)
│   │   ├── Payments.jsx              (coming soon placeholder)
│   │   ├── AdmitCard.jsx             (coming soon placeholder)
│   │   ├── Results.jsx               (coming soon placeholder)
│   │   ├── Support.jsx               (coming soon placeholder)
│   │   └── Notifications.jsx         (coming soon placeholder)
│   │
│   └── public/                       (10 files)
│       ├── Home.jsx                  (built)
│       ├── Jobs.jsx                  (coming soon placeholder)
│       ├── JobDetails.jsx            (coming soon placeholder)
│       ├── Results.jsx               (coming soon placeholder)
│       ├── Notices.jsx               (coming soon placeholder)
│       ├── AdmitCards.jsx            (coming soon placeholder)
│       ├── Downloads.jsx             (coming soon placeholder)
│       ├── FAQ.jsx                   (coming soon placeholder)
│       ├── Contact.jsx               (coming soon placeholder)
│       └── About.jsx                 (coming soon placeholder)
│
├── components/
│   ├── common/
│   │   ├── ComingSoon.jsx
│   │   └── DevNavigation.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── ApplicationLayout.jsx
│   │   └── PublicLayout.jsx
│   └── ui/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── Skeleton.jsx
│
├── routes/
│   └── index.jsx                     (56 routes configured)
│
├── constants/
│   └── index.js                      (routes, colors, status, categories, states, departments)
│
├── lib/
│   └── utils.js                      (cn, formatCurrency, formatNumber, formatDate, formatDateTime)
│
├── assets/
│   ├── herobg.jpg
│   ├── react.svg
│   └── vite.svg
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

---

## 13. Frontend Structure Improvements Needed

The current structure is missing several important folders that are needed before backend integration begins. Your friend should add these:

### Missing Folders to Create

```
src/
├── services/          (API layer — axios calls per module)
├── hooks/             (custom React hooks)
├── store/             (Zustand global state slices)
├── config/            (API base URL, app config)
└── utils/             (extra helpers beyond lib/utils.js)
```

### Recommended Service Layer

```
src/services/
├── api.js                    (axios instance with base URL + interceptors for JWT)
├── auth.service.js           (login, register, OTP, refresh token)
├── application.service.js    (create, update steps, submit)
├── job.service.js            (public job listing, job details)
├── admin.service.js          (all admin API calls)
└── payment.service.js        (initiate, verify, history)
```

### Recommended Store Structure

```
src/store/
├── authStore.js              (user, token, isLoggedIn, role)
├── applicationStore.js       (current draft application state across steps)
└── uiStore.js                (loading states, modals, toasts)
```

### Recommended Hooks

```
src/hooks/
├── useAuth.js                (login, logout, token refresh)
├── useApplication.js         (application step management)
├── useDebounce.js            (search input debounce)
└── useLocalStorage.js        (persist draft data)
```

### Recommended Config

```
src/config/
├── api.config.js             (VITE_API_BASE_URL, timeout, headers)
└── app.config.js             (app name, version, feature flags)
```

### Other Notes for Frontend
- `CandidateLayout` is missing — candidate pages currently have no shared layout/sidebar. A `CandidateLayout.jsx` should be added to `components/layouts/` with a top navbar and sidebar for the candidate portal.
- `constants/index.js` has some routes defined (e.g. `ADMIN_VACANCIES`, `ADMIN_CANDIDATES`, `ADMIN_DOCUMENTS`) that do not exist in `routes/index.jsx` — these should be cleaned up or the routes added.
- `PublicLayout.jsx` has a nav link to `/how-to-apply` which has no route or page — either add the page or remove the nav link.
- All `Coming Soon` placeholder pages should eventually be replaced with real implementations as backend APIs become available.
- `DevNavigation.jsx` is only rendered in development mode — keep it, it is useful.

---

## 14. Backend Folder Structure

```
backend/
│
├── apps/
│   ├── api-gateway/
│   ├── identity-service/
│   ├── recruitment-service/
│   └── communication-payment-service/
│
├── packages/
│   ├── common/
│   ├── auth/
│   ├── logger/
│   ├── validations/
│   └── utils/
│
├── .env
├── package.json
└── turbo.json
```

---

## 15. All API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-otp
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

### Candidate — Application Flow
```
POST   /api/applications                              (create / start application)
PUT    /api/applications/:id/personal-details
PUT    /api/applications/:id/education
PUT    /api/applications/:id/additional-info
PUT    /api/applications/:id/address
POST   /api/applications/:id/documents/:type          (file upload to Cloudinary)
PUT    /api/applications/:id/post-selection
POST   /api/applications/:id/payment
GET    /api/applications/:id
GET    /api/applications                              (candidate's own applications)
```

### Public — Jobs & Info
```
GET    /api/jobs                                      (list with filters)
GET    /api/jobs/:id
GET    /api/notices
GET    /api/results
GET    /api/admit-cards
```

### Admin — Projects
```
GET    /api/admin/projects
POST   /api/admin/projects
GET    /api/admin/projects/:id
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
```

### Admin — Jobs
```
GET    /api/admin/jobs
POST   /api/admin/jobs                                (create as draft)
GET    /api/admin/jobs/:id
PUT    /api/admin/jobs/:id
PUT    /api/admin/jobs/:id/publish
DELETE /api/admin/jobs/:id
```

### Admin — Applications
```
GET    /api/admin/applications                        (filters + pagination)
GET    /api/admin/applications/:id
PUT    /api/admin/applications/:id/status
POST   /api/admin/applications/bulk-action
```

### Admin — Documents
```
GET    /api/admin/applications/:id/documents
PUT    /api/admin/applications/:id/documents/:type/verify
PUT    /api/admin/applications/:id/documents/:type/reject
```

### Admin — Employees
```
GET    /api/admin/employees
POST   /api/admin/employees
GET    /api/admin/employees/:id
PUT    /api/admin/employees/:id
DELETE /api/admin/employees/:id
```

### Admin — Roles
```
GET    /api/admin/roles
POST   /api/admin/roles
GET    /api/admin/roles/:id
PUT    /api/admin/roles/:id
DELETE /api/admin/roles/:id
```

### Admin — Support
```
GET    /api/admin/support/tickets
POST   /api/admin/support/tickets
GET    /api/admin/support/tickets/:id
PUT    /api/admin/support/tickets/:id
POST   /api/admin/support/tickets/:id/reply
```

### Admin — Analytics
```
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/funnel
GET    /api/admin/analytics/top-jobs
GET    /api/admin/analytics/payments
```

### Admin — Activity Logs
```
GET    /api/admin/activity-logs                       (filters + pagination)
GET    /api/admin/activity-logs/export                (CSV export)
```

### Admin — Payment Settings
```
GET    /api/admin/payment-gateways
POST   /api/admin/payment-gateways
PUT    /api/admin/payment-gateways/:id
DELETE /api/admin/payment-gateways/:id
```

### Payments
```
POST   /api/payments/initiate
POST   /api/payments/verify                           (webhook / callback)
GET    /api/payments/:transactionId
GET    /api/payments/history                          (candidate payment history)
```

### Admit Cards & Results
```
GET    /api/candidate/admit-card/:applicationId
GET    /api/candidate/results
GET    /api/admin/admit-cards/generate/:jobId
POST   /api/admin/results/publish
```

---

## 16. Important Development Notes

### Dynamic Form Builder
Forms should **never be hardcoded**. Admin must be able to:
- Create sections
- Add fields (text, textarea, email, phone, number, date, dropdown, radio, checkbox, file)
- Configure validations and conditional logic

This makes the platform reusable for future recruitment projects without any code changes.

### RBAC System
Must be **database-driven**. Main admin creates employees, roles, and permissions. Do **not** hardcode permissions in code.

### File Upload
Documents stored in **Cloudinary**. Do **not** store files in MongoDB. Store only the Cloudinary URL reference in the database.

### Queue System
Use **RabbitMQ** for:
- Email notifications
- SMS notifications
- In-app notifications
- PDF generation (admit cards, receipts)
- Analytics processing

### Security Requirements
- JWT authentication (access token + refresh token)
- Rate limiting on all public endpoints
- Input validation on all routes (Zod/Joi)
- Secure file type and size validation before Cloudinary upload
- Audit logging for all sensitive operations
- Role guards on all admin routes
- Encrypted storage of payment gateway API credentials

---

## 17. Current Development Status

### Frontend (Friend's Work)
| Area | Status |
|---|---|
| Public — Home | Done |
| Auth — Login, VerifyOTP, AdminLogin, CandidateLogin | Done |
| Application Flow — all 9 steps | Done |
| Admin — Dashboard | Done |
| Admin — Jobs (full 6-step create wizard) | Done |
| Admin — Applications | Done |
| Admin — Projects | Done |
| Admin — Employees + Add Employee | Done |
| Admin — Roles + Create Role | Done |
| Admin — Support (list + kanban + ticket detail) | Done |
| Admin — Analytics | Done |
| Admin — Activity Logs | Done |
| Admin — Payment Settings + Razorpay Config | Done |
| Candidate — Dashboard | Done |
| Auth — Register, ForgotPassword, ResetPassword | Pending |
| Public — Jobs, Results, Notices, Admit Cards, etc. | Pending |
| Candidate — Profile, Applications, Documents, etc. | Pending |
| Frontend service/store/hooks layer | Pending (needed before API integration) |

### Backend (Your Work)
| Area | Status |
|---|---|
| All backend services | To be built |

---

## 18. Final Recommendation

Develop this as a **modular enterprise recruitment platform**, not a simple CRUD project.

Main focus areas:
- **Reusable architecture** — modules work independently
- **Configurable workflows** — admin drives all configuration
- **Dynamic forms** — no hardcoded application fields
- **Clean RBAC** — database-driven, not code-driven
- **Scalable modules** — each service scales independently
- **Secure document handling** — Cloudinary with signed URLs
- **Queue-based processing** — async operations via RabbitMQ
- **Feature isolation** — changes in one module do not break others