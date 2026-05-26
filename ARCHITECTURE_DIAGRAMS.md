# Recruitment Portal - Visual Architecture & Data Flow Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RECRUITMENT PORTAL SYSTEM                       │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐                      ┌──────────────────────────┐
│    ADMIN DASHBOARD       │                      │   CANDIDATE DASHBOARD    │
│                          │                      │                          │
│ • Job Creation (6 steps) │◄────────────────────►│ • Browse Jobs            │
│   - Basic Info           │                      │ • Apply (Start App)      │
│   - Eligibility          │                      │ • Fill 9-Step Form       │
│   - Form Builder ⭐      │                      │ • Submit & Pay           │
│   - Documents            │                      │ • Track Status           │
│   - Payment Config       │                      │                          │
│   - Review & Publish     │                      │                          │
│                          │                      │                          │
│ • Job Management         │                      │ • View Applications      │
│ • Applications Review    │                      │ • Upload Documents       │
│ • Eligibility Screening  │                      │ • View Results           │
│ • Document Verification  │                      │                          │
└──────────────────────────┘                      └──────────────────────────┘
         │                                                 │
         │               ┌─────────────────┐              │
         └──────────────►│   BACKEND API   │◄─────────────┘
                         │  (REST/Socket)  │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │                           │
            ┌───────▼────────┐         ┌───────▼────────┐
            │ MongoDB Database│         │  File Storage  │
            │                 │         │  (Cloudinary)  │
            │ • Jobs          │         │                │
            │ • Applications  │         │ • Documents    │
            │ • Users         │         │ • Certificates │
            │ • Projects      │         │ • Photographs  │
            └────────────────┘         └────────────────┘
```

---

## 2. Admin Job Creation Flow with Data

```
Step 1: JobBasicInfo
┌──────────────────────────────────────┐
│ • Job Title: "Software Engineer"     │
│ • Post Code: "SE-2025-001"           │
│ • Department: "IT"                   │
│ • Category: "Technical"              │
│ • Total Posts: 50                    │
│ • Posts array: [                     │
│   {postCode, title, designation,     │
│    department, vacancies}            │
│ ]                                    │
│ • Salary: {min: 50000, max: 100000} │
│ • Application Deadline: 2026-06-30   │
│ • Application Fee: {                 │
│   general: 500, obc: 250,            │
│   scSt: 0, pwd: 0                    │
│ }                                    │
└──────────────────────────────────────┘
                  ▼
         [Save to sessionStorage]
                  ▼
Step 2: JobEligibility
┌──────────────────────────────────────┐
│ • Age Limit: {min: 21, max: 30}      │
│ • Age Relaxation: {sc: 5, st: 5}     │
│ • Education: {                       │
│   essential: [                       │
│     {degree: "B.Tech", ...}          │
│   ]                                  │
│ }                                    │
│ • Experience: {required: true,       │
│   years: 2}                          │
│ • Physical Standards: {...}          │
│ • Medical Standards: {...}           │
└──────────────────────────────────────┘
                  ▼
         [Save to sessionStorage]
                  ▼
Step 3: JobFormBuilder ⭐
┌──────────────────────────────────────┐
│ formSections: [                      │
│   {                                  │
│     title: "Personal Information",   │
│     required: true,                  │
│     fields: [                        │
│       {                              │
│         id: 1001,                    │
│         type: "text",                │
│         label: "Full Name",          │
│         required: true,              │
│         placeholder: "...",          │
│         validation: {                │
│           min: 3,                    │
│           max: 100                   │
│         }                            │
│       },                             │
│       {                              │
│         id: 1002,                    │
│         type: "email",               │
│         label: "Email",              │
│         required: true,              │
│         validation: {                │
│           pattern: "^[^@]+@[^@]+$"   │
│         }                            │
│       },                             │
│       {                              │
│         id: 1003,                    │
│         type: "select",              │
│         label: "Experience Level",   │
│         required: false,             │
│         options: [                   │
│           "0-1 years",               │
│           "1-3 years",               │
│           "3+ years"                 │
│         ]                            │
│       }                              │
│     ]                                │
│   }                                  │
│ ]                                    │
└──────────────────────────────────────┘
                  ▼
         [Save to sessionStorage]
                  ▼
Step 4: JobDocuments
┌──────────────────────────────────────┐
│ documentRequirements: [              │
│   {                                  │
│     name: "Resume",                  │
│     required: true,                  │
│     formats: ["PDF", "DOC"],         │
│     maxSizeKB: 5120                  │
│   }                                  │
│ ]                                    │
└──────────────────────────────────────┘
                  ▼
         [Save to sessionStorage]
                  ▼
Step 5: JobPayment
┌──────────────────────────────────────┐
│ applicationFee: {                    │
│   general: 500,                      │
│   obc: 250,                          │
│   scSt: 0,                           │
│   ews: 300,                          │
│   pwd: 0                             │
│ }                                    │
│ paymentConfig: {                     │
│   paymentMethods: ["razorpay"],      │
│   refundPolicy: "...",               │
│   paymentDeadlineHours: 24           │
│ }                                    │
└──────────────────────────────────────┘
                  ▼
         [Save to sessionStorage]
                  ▼
Step 6: JobReview & Publish
┌──────────────────────────────────────┐
│ REVIEW ALL DATA                      │
│ "Save as Draft" or "Publish"         │
│                                      │
│ 1. POST /admin/jobs {                │
│      projectId, title, postCode,     │
│      department                      │
│    }                                 │
│    → Returns jobId                   │
│                                      │
│ 2. PUT /admin/jobs/{jobId} {         │
│      All remaining data including    │
│      formSections ⭐                 │
│    }                                 │
│                                      │
│ 3. PUT /admin/jobs/{jobId}/publish   │
│    (if publishing)                   │
└──────────────────────────────────────┘
                  ▼
         [Clear sessionStorage]
                  ▼
        JOB SAVED IN DATABASE
      ✅ formSections stored ✅
```

---

## 3. Data Model Relationship: Job ↔ Application

```
┌────────────────────────┐
│     Job Document       │
│  (in DB after create)  │
└────────────────────────┘
│
├─ _id: ObjectId
├─ title: "Software Engineer"
├─ postCode: "SE-2025-001"
├─ department: "IT"
├─ applicationDeadline: Date
├─ ageLimit: {...}
├─ education: {...}
├─ experience: {...}
│
├─ 🟢 formSections: [    ← Admin created these
│     {
│       title: "Personal Information",
│       required: true,
│       fields: [
│         {type: "text", label: "Full Name", ...},
│         {type: "email", label: "Email", ...},
│         {type: "select", label: "Experience", options: [...]}
│       ]
│     }
│   ]
│
├─ documentRequirements: [{...}]
├─ paymentConfig: {...}
└─ status: "active"

                 │
                 │ Candidate applies
                 ▼

┌────────────────────────┐
│ Application Document   │
│  (created in DB)       │
└────────────────────────┘
│
├─ _id: ObjectId
├─ applicationId: "APP-2025-00001"
├─ candidateId: ObjectId (ref: User)
├─ jobId: ObjectId (ref: Job) ←─┐
│                                 │
│  HARDCODED FIXED FIELDS:       │ Points back to Job
│                                │
├─ personalDetails: {           ├─ PROBLEM: Not using
│   fullName: "John Doe",        │  formSections from Job!
│   email: "john@...",           │
│   dateOfBirth: Date,           │
│   gender: "Male",              │
│   category: "General",         │
│   isDomicileOfBihar: true      │
│ }                              │
│                                │
├─ education: {                 ├─ Uses hardcoded
│   tenth: {...},               │  structure instead
│   twelfth: {...},             │
│   graduation: {...}           │
│ }                             │
│                               │
├─ additionalInfo: {...}       ├─ Completely
├─ address: {...}              │  ignores job's
├─ documents: [...]            │  formSections
│                               │
├─ 🔴 formResponses: {}        ← Empty! Never populated
│  (Map<String, Mixed>)         
│                               │
├─ status: "draft"             │
├─ currentStep: 1              │
├─ paymentStatus: "pending"    │
└─ timestamps: true            │
                                │
                    SHOULD BE: formResponses = {
                                 "full_name": "John Doe",
                                 "email": "john@...",
                                 "experience_level": "3+ years"
                               }
```

---

## 4. Candidate Application Flow (Current - Hardcoded)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CANDIDATE APPLICATION JOURNEY                        │
└─────────────────────────────────────────────────────────────────────────┘

[Browse Jobs]
     │
     ▼
[Click "Apply Now"] ──► POST /candidate/applications {jobId}
     │
     ├─ Job fetched from DB (includes formSections ⭐ but not used)
     ├─ Application created with hardcoded personalDetails
     └─ Redirect to Step 1
     │
     ▼
[STEP 1: Personal Details]
     │ Fields: fullName, fatherName, motherName, dateOfBirth, gender,
     │         category, maritalStatus, religion, identificationMark,
     │         registeredMobile, isDomicileOfBihar
     │
     ├─ PUT /candidate/applications/{id}/personal-details
     ├─ Data saved in Application.personalDetails ✅
     └─ Redirect to Step 2
     │
     ▼
[STEP 2: Education]
     │ Fields: 10th (board, school, year, percentage)
     │         12th (stream)
     │         Graduation (degree, university, percentage)
     │
     ├─ PUT /candidate/applications/{id}/education
     ├─ Data saved in Application.education ✅
     └─ Redirect to Step 3
     │
     ▼
[STEP 3: Additional Info]
     │ Fields: isGovtEmployee, departmentName, yearsOfService,
     │         isExServiceman, isPwD, disabilityPercentage,
     │         drivingLicense, computerCertificate
     │
     ├─ PUT /candidate/applications/{id}/additional-info
     ├─ Data saved in Application.additionalInfo ✅
     └─ Redirect to Step 4
     │
     ▼
[STEP 4: Address]
     │ Fields: permanent address, correspondence address
     │
     ├─ PUT /candidate/applications/{id}/address
     ├─ Data saved in Application.address ✅
     └─ Redirect to Step 5
     │
     ▼
[STEP 5: Documents]
     │ Upload: passport_photo, signature, 10th cert, 12th cert,
     │         graduation cert, category cert, aadhar, driving license,
     │         computer cert, domicile cert
     │
     ├─ POST /candidate/applications/{id}/documents/{type} (multipart)
     ├─ Data saved in Application.documents[] ✅
     └─ Redirect to Step 6
     │
     ▼
[STEP 6: Review]
     │ Shows all entered data (hardcoded fields only)
     │ Requires declaration checkbox
     │
     ├─ POST /candidate/applications/{id}/submit
     ├─ Status changed to "submitted"
     └─ Redirect to Step 7
     │
     ▼
[STEP 7: Post Selection]
     │ Select preferred posts from job
     │
     ├─ PUT /candidate/applications/{id}/post-selection
     ├─ Data saved in Application.appliedPosts[]
     └─ Redirect to Step 8
     │
     ▼
[STEP 8: Payment]
     │ Calculate fee based on category
     │
     ├─ POST /candidate/payments/initiate
     ├─ Razorpay payment gateway
     ├─ POST /candidate/payments/verify
     ├─ POST /candidate/applications/{id}/finalize (with transactionId)
     ├─ Status changed to "paid"
     └─ Redirect to Step 9
     │
     ▼
[STEP 9: Success]
     │ Application submitted successfully!


🔴 CRITICAL ISSUE: Job's formSections never used!
   Application.formResponses never populated!
```

---

## 5. The Gap - What Should Happen vs. What Actually Happens

```
IDEAL FLOW (Not Implemented)
═════════════════════════════════════════════════════════════════

Admin creates job with custom form sections:
Job.formSections = [
  {
    title: "Work Experience",
    fields: [
      {type: "number", label: "Years of Experience", min: 0, max: 50},
      {type: "textarea", label: "Brief Description", required: true}
    ]
  }
]
                    ▼
Candidate applies → Application created
                    ▼
Candidate sees STEP: "Work Experience"
    ├─ Input: Years of Experience (number field, 0-50)
    ├─ Input: Brief Description (textarea)
                    ▼
Data saved to: Application.formResponses = {
    "years_of_experience": 5,
    "brief_description": "Worked at..."
}
                    ▼
Admin reviews application with custom fields visible


ACTUAL FLOW (Current Implementation)
═════════════════════════════════════════════════════════════════

Admin creates job with custom form sections:
Job.formSections = [...]  ← Saved but ignored
                    ▼
Candidate applies → Application created
                    ▼
Candidate sees FIXED STEPS:
    1. Personal Details (hardcoded fields)
    2. Education (hardcoded fields)
    3. Additional Info (hardcoded fields)
    4. Address (hardcoded fields)
    5. Documents (hardcoded document types)
    6. Review (shows only hardcoded fields)
    7. Post Selection
    8. Payment
    9. Success
                    ▼
Data saved to: Application.personalDetails, education, additionalInfo, address
Application.formResponses = {} ← EMPTY, never used
                    ▼
Admin reviews application, sees only hardcoded fields
Custom form sections designed by admin = INVISIBLE to candidates
```

---

## 6. Component Dependency Graph

```
ADMIN SIDE
══════════

JobCreate.jsx
    │
    └─► JobBasicInfo.jsx ──────────┐
            │                      │
            └── sessionStorage      ├─ All accumulate in
                job_draft          │  sessionStorage.job_draft
                                   │
JobEligibility.jsx ────────────────┤
    │
    └── sessionStorage              │
        job_draft                    │
                                   │
JobFormBuilder.jsx ⭐ ─────────────┤
    │                              │
    └── sessionStorage              │
        job_draft                    │
        (saves formSections)        │
                                   │
JobDocuments.jsx ──────────────────┤
    │
    └── sessionStorage              │
        job_draft                    │
                                   │
JobPayment.jsx ────────────────────┤
    │
    └── sessionStorage              │
        job_draft                    │
                                   │
JobReview.jsx ─────────────────────┘
    │
    ├─ adminService.createJob()
    ├─ adminService.updateJob()
    └─ adminService.publishJob()
        │
        ▼
    Backend API: POST /admin/jobs, PUT /admin/jobs/{id}, PUT /admin/jobs/{id}/publish
        │
        ▼
    MongoDB: Job document saved with formSections ✅


CANDIDATE SIDE
══════════════

Jobs.jsx
    │
    └─► Click "Apply Now"
            │
            └─ candidateService.createApplication(jobId)
                    │
                    ▼
                Backend: POST /candidate/applications {jobId}
                    │
                    ├─ Fetch Job from DB (formSections ← available but ignored)
                    ├─ Create Application with hardcoded personalDetails
                    └─ Return application
                            │
                            ▼
                Frontend: Redirect to PersonalDetails.jsx
                    │
                    ├─ Application state restored from backend
                    ├─ sessionStorage.app_draft = {applicationId, jobId}
                    ├─ candidateService.savePersonalDetails()
                    ├─ candidateService.saveEducation()
                    ├─ candidateService.saveAdditionalInfo()
                    ├─ candidateService.saveAddress()
                    ├─ candidateService.uploadDocument()
                    ├─ candidateService.savePostSelection()
                    ├─ candidateService.submitApplication()
                    └─ candidateService.finalizeApplication()
                            │
                            ▼
                        Backend: All save to hardcoded fields
                        Application.formResponses ← NEVER TOUCHED ❌
```

---

## 7. Database State After Job Creation

```
Job Collection
══════════════

{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  projectId: ObjectId("507f1f77bcf86cd799439012"),
  title: "Software Engineer",
  postCode: "SE-2025-001",
  department: "IT",
  category: "Technical",
  jobType: "Permanent",
  workLocation: "Bangalore",
  description: "...",
  totalPosts: 50,
  posts: [{...}, {...}],
  reservedPosts: {sc: 10, st: 5, obc: 8, ews: 3, pwd: 2},
  salaryRange: {min: 500000, max: 1000000},
  applicationFee: {general: 500, obc: 250, scSt: 0, ews: 300, pwd: 0},
  applicationDeadline: Date("2026-06-30"),
  examDate: Date("2026-08-15"),
  ageLimit: {min: 21, max: 30, relaxation: {sc: 5, st: 5}},
  education: {
    essential: [{degree: "B.Tech", specialization: "CS"}],
    desirable: [{degree: "M.Tech"}]
  },
  experience: {required: true, years: 2, type: "IT Industry"},
  physicalStandards: {required: false},
  medicalStandards: {required: false},
  otherRequirements: ["..."],
  
  ✅ formSections: [          ← STORED BUT UNUSED
      {
        _id: ObjectId(...),
        title: "Personal Information",
        required: true,
        fields: [
          {
            _id: ObjectId(...),
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter full name",
            validation: {min: 3, max: 100}
          },
          {
            _id: ObjectId(...),
            type: "email",
            label: "Email Address",
            required: true,
            validation: {pattern: "..."}
          },
          {
            _id: ObjectId(...),
            type: "select",
            label: "Experience Level",
            required: false,
            options: ["0-1 years", "1-3 years", "3+ years"]
          }
        ]
      },
      {
        _id: ObjectId(...),
        title: "Work Experience",
        required: true,
        fields: [{...}]
      }
    ],

  documentRequirements: [{name: "Resume", required: true, formats: ["PDF"]}],
  paymentConfig: {
    applicationFee: 500,
    paymentMethods: ["razorpay"],
    paymentDeadlineHours: 24
  },
  status: "active",
  createdBy: ObjectId("507f1f77bcf86cd799439013"),
  publishedAt: Date("2026-04-30"),
  createdAt: Date("2026-04-28"),
  updatedAt: Date("2026-04-30"),
  __v: 0
}


Application Collection
══════════════════════

{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  applicationId: "APP-2025-00001",
  candidateId: ObjectId("507f1f77bcf86cd799439021"),
  jobId: ObjectId("507f1f77bcf86cd799439011"),  ← Links to Job above

  personalDetails: {
    fullName: "John Doe",
    fatherName: "Jane Doe",
    motherName: "Mary Doe",
    dateOfBirth: Date("1995-05-15"),
    gender: "Male",
    category: "General",
    maritalStatus: "Single",
    religion: "Hindu",
    registeredMobile: "9876543210",
    isDomicileOfBihar: true
  },

  education: {
    tenth: {board: "CBSE", school: "ABC School", percentage: 85},
    twelfth: {board: "CBSE", school: "ABC School", percentage: 88, stream: "Science"},
    graduation: {degree: "B.Tech", university: "IIT Delhi", percentage: 8.5}
  },

  additionalInfo: {
    isGovtEmployee: false,
    isExServiceman: false,
    isPwD: false,
    drivingLicense: "DL123456",
    computerCertificate: "Yes"
  },

  address: {
    permanent: {
      addressLine1: "123 Main St",
      state: "Bihar",
      district: "Patna",
      pincode: "800001"
    },
    correspondence: {...}
  },

  documents: [
    {
      _id: ObjectId(...),
      type: "passport_photo",
      cloudinaryUrl: "https://res.cloudinary.com/...",
      status: "uploaded",
      uploadedAt: Date(...)
    }
  ],

  appliedPosts: [
    {jobId: ObjectId(...), postCode: "SE-2025-001", preference: 1}
  ],

  🔴 formResponses: {},  ← EMPTY! Should contain:
                          {
                            "full_name": "John Doe",
                            "email_address": "john@example.com",
                            "experience_level": "3+ years",
                            "years_of_experience": 5,
                            "brief_description": "Worked as..."
                          }
                          But it's never populated!

  status: "submitted",
  documentStatus: "complete",
  paymentStatus: "paid",
  totalFee: 500,
  transactionId: "txn_123456",
  currentStep: 9,
  submittedAt: Date("2026-05-10"),
  createdAt: Date("2026-05-01"),
  updatedAt: Date("2026-05-10"),
  __v: 0
}
```

---

## 8. Summary Table

| Aspect | Status | Details |
|--------|--------|---------|
| **Admin Form Builder** | ✅ Complete | Can create/edit/delete form sections and fields |
| **Form Sections Saved** | ✅ In DB | Properly stored in Job.formSections |
| **Form Field Types** | ✅ 10 types | text, textarea, email, tel, number, date, select, radio, checkbox, file |
| **Field Validation Schema** | ✅ Defined | min, max, pattern, message properties exist |
| **Candidate Sees Custom Form** | ❌ NO | Uses hardcoded 9-step form instead |
| **Form Responses Saved** | ❌ NO | Application.formResponses never populated |
| **API Endpoint for formResponses** | ❌ Missing | No `PUT /candidate/applications/{id}/form-responses` |
| **Dynamic Form Rendering** | ❌ Missing | No component to render formSections |
| **Form Validation from Job** | ❌ NO | Only hardcoded field validation exists |
| **Job-to-App Data Link** | ⚠️ Partial | Job fetched but formSections unused |
| **Admin-to-Candidate Link** | ❌ Broken | Data flows but formSections ignored |

---

## 9. What Works vs. What's Missing

### ✅ Current Working System

```javascript
// Admin Design Phase
Admin in JobFormBuilder.jsx
  → Creates section: "Work Experience"
  → Adds fields: [
      {type: "number", label: "Years", min: 0, max: 50},
      {type: "textarea", label: "Description"}
    ]
  → Saves via JobReview.jsx
  → Backend: adminService.updateJob({formSections: [...]})
  → Database: Job.formSections stored ✅

// Job-Candidate Link
Candidate opens job detail page
  → Job fetched with formSections available in JSON
  → But form rendering doesn't use it (hardcoded instead)
```

### ❌ Missing Implementation

```javascript
// What's NOT implemented:
1. Form Rendering Component
   - No dynamic renderer for formSections
   - No component that takes formSections and renders as HTML form

2. Form Response Saving
   - No API endpoint: PUT /candidate/applications/{id}/form-responses
   - No service method: candidateService.saveFormResponses()
   - No controller method in application.controller.js

3. Validation from Schema
   - formSections field validation (min, max, pattern) not used
   - Only hardcoded field validation exists

4. Data Persistence
   - Application.formResponses never populated
   - No mapping of field responses to formResponses Map

5. Review & Admin View
   - Admin can't see custom form responses in application review
   - Application review shows only hardcoded fields
```

---

## 10. Implementation Path

To fully implement dynamic forms:

```
Phase 1: Backend Preparation
  ├─ ✅ Job Model has formSections
  ├─ ✅ Application Model has formResponses field
  └─ ❌ Need: formResponses saving endpoint

Phase 2: Frontend Component Development
  ├─ Create: DynamicFormRenderer component
  ├─ Create: FormFieldRenderer subcomponent (per field type)
  ├─ Create: FormResponseStep component
  └─ Update: Application flow to include dynamic form

Phase 3: Service Integration
  ├─ Add: candidateService.saveFormResponses(id, responses)
  ├─ Add: API call to new endpoint
  └─ Add: Form validation before saving

Phase 4: Data Flow
  ├─ Fetch: Job.formSections when starting application
  ├─ Render: Dynamic form based on formSections
  ├─ Save: Field responses to Application.formResponses
  └─ Display: Form responses in admin review

Phase 5: Validation & Error Handling
  ├─ Client-side: Validate using formSections field.validation
  ├─ Server-side: Validate responses against formSections schema
  └─ Handle: File uploads for 'file' type fields
```
