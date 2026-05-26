# Smart Eligibility Filter - Complete Implementation Guide

## Overview

The Smart Eligibility Filter is a production-ready end-to-end feature that allows:

- **Admins** to define eligibility criteria when creating jobs
- **Candidates** to filter jobs based on their qualifications, age, and category
- **Backend** to intelligently match candidates to eligible jobs

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home.jsx                    EligibleJobs.jsx              │
│  ├─ Smart Filter Form        ├─ Dynamic Filters            │
│  ├─ Qualification            ├─ Search                     │
│  ├─ Age                       ├─ Pagination                │
│  ├─ Category                  ├─ Job Cards                 │
│  └─ "Check Eligible Jobs"     └─ Apply Now Button          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Port 5000)                  │
│              Routes to Recruitment Service                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            RECRUITMENT SERVICE (Port 5002)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Public Job Controller                                      │
│  ├─ GET /api/jobs/search                                   │
│  │  ├─ Query: qualification, age, candidateCategory        │
│  │  ├─ Filters by education requirements                   │
│  │  ├─ Filters by age + relaxation                         │
│  │  └─ Returns eligible jobs with applicable fees          │
│  │                                                          │
│  └─ Eligibility Matching Algorithm                         │
│     ├─ Qualification Hierarchy (10th → 12th → Grad → PG)   │
│     ├─ Age Range Validation                                │
│     ├─ Category-based Relaxation                           │
│     └─ Fee Calculation per Category                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  MONGODB DATABASE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Job Collection                                             │
│  ├─ ageLimit: { min, max, relaxation: {sc, st, obc, pwd} } │
│  ├─ education: { essential: [], desirable: [] }             │
│  ├─ experience: { required, years, type }                   │
│  ├─ applicationFee: { general, obc, scSt, ews, pwd }        │
│  └─ status: "active" (only active jobs shown)              │
│                                                             │
│  User Collection                                            │
│  └─ category: "general" | "obc" | "sc" | "st" | "ews"      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Implementation

### 1. Admin: Create Job with Eligibility Criteria

**Location**: `/admin/jobs/create`

**Step 2: Eligibility Criteria**

1. **Age Limit**
   - Set minimum and maximum age
   - Define age relaxation for each category (SC, ST, OBC, PWD)
   - Example: Min 21, Max 40, SC relaxation +5 years

2. **Educational Qualifications**
   - Add Essential Qualifications (required)
   - Add Desirable Qualifications (optional)
   - For each: Degree, Specialization, University
   - Example: B.Tech in Computer Science from any recognized university

3. **Experience Requirements**
   - Toggle "Experience Required"
   - Specify years, type (Teaching/Research/Industry/Government/Any)
   - Add description

4. **Physical Standards** (if applicable)
   - Toggle "Physical Standards Required"
   - Set height, chest, weight for male/female

5. **Medical Standards** (if applicable)
   - Toggle "Medical Standards Required"
   - Specify vision, hearing, other requirements

6. **Other Requirements**
   - Add any additional requirements (driving license, computer proficiency, etc.)

**Data Saved to Database**:

```javascript
{
  ageLimit: {
    min: 21,
    max: 40,
    relaxation: { sc: 5, st: 5, obc: 3, pwd: 10 }
  },
  education: {
    essential: [
      { degree: "B.Tech", specialization: "Computer Science", university: "Any recognized" }
    ],
    desirable: []
  },
  experience: {
    required: true,
    years: 2,
    type: "Any Relevant",
    description: "2 years in IT sector"
  },
  applicationFee: {
    general: 500,
    obc: 250,
    scSt: 0,
    ews: 250,
    pwd: 0
  }
}
```

### 2. Candidate: Use Smart Eligibility Filter

**Location**: Home page → "Smart Eligibility Filter" card

**Steps**:

1. Select Qualification (10th, 12th, Graduation, Post Graduation)
2. Enter Age
3. Select Category (General, OBC, SC, ST, EWS, PWD)
4. Click "Check Eligible Jobs"

**Data Sent to Backend**:

```javascript
{
  qualification: "Graduation",
  age: 28,
  category: "general"
}
```

### 3. Frontend: EligibleJobs Page

**Location**: `/eligible-jobs`

**Features**:

- Receives filter data from Home page via React Router state
- Displays dynamic filter panel with:
  - Search box (job title, code)
  - Qualification dropdown
  - Age input
  - Category dropdown
  - Department dropdown
  - Reset filters button
- Shows paginated job cards with:
  - Job title, post code, department
  - Location, vacancies, salary range
  - Application fee (calculated for candidate's category)
  - Days left to apply
  - "View Details" and "Apply Now" buttons
- Handles loading, error, and empty states
- Responsive design (mobile-friendly)

### 4. Backend: Eligibility Matching Algorithm

**Endpoint**: `GET /api/jobs/search`

**Query Parameters**:

```
q                  - Free text search (job title, code, dept)
qualification      - "10th" | "12th" | "Graduation" | "Post Graduation"
age                - Candidate's age (number)
candidateCategory  - "general" | "obc" | "sc" | "st" | "ews" | "pwd"
department         - Department name (partial match)
page               - Page number (default 1)
limit              - Results per page (default 20)
```

**Matching Logic**:

1. **Qualification Matching**
   - Build hierarchy: 10th ≤ 12th ≤ Graduation ≤ Post Graduation
   - Candidate with "Graduation" can apply to jobs requiring 10th, 12th, or Graduation
   - Candidate with "12th" cannot apply to jobs requiring Graduation
   - Jobs with no education requirement are always eligible

2. **Age Matching**
   - Check: `ageLimit.min ≤ candidateAge ≤ (ageLimit.max + relaxation)`
   - Relaxation applied based on candidate's category
   - Example: Job max age 40, SC relaxation 5 → SC candidate age 45 is eligible
   - Jobs with no age limit are always eligible

3. **Fee Calculation**
   - Determine applicable fee based on candidate's category
   - Priority: category-specific fee → general fee → 0
   - Example: OBC candidate → use `applicationFee.obc` if exists, else `applicationFee.general`

4. **Filtering**
   - Only show jobs with `status: "active"`
   - Only show jobs with `applicationDeadline >= today`
   - Apply all matching criteria above
   - Sort by application deadline (ascending)

**Response**:

```javascript
{
  success: true,
  message: "Jobs found",
  data: {
    jobs: [
      {
        _id: "...",
        title: "Software Engineer",
        postCode: "SE-2025-001",
        department: "IT",
        category: "Technical",
        totalPosts: 50,
        workLocation: "Delhi",
        applicationDeadline: "2026-06-30",
        applicationFee: { general: 500, obc: 250, ... },
        ageLimit: { min: 21, max: 40, relaxation: {...} },
        education: { essential: [...], desirable: [...] },
        salaryRange: { min: 50000, max: 100000 },
        applicableFee: 500,  // Fee for this candidate's category
        daysLeft: 35
      },
      ...
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 45,
      itemsPerPage: 12
    }
  }
}
```

## Testing the Feature

### Test Case 1: Basic Eligibility Filter

1. Go to Home page
2. Fill Smart Eligibility Filter:
   - Qualification: "Graduation"
   - Age: 28
   - Category: "General"
3. Click "Check Eligible Jobs"
4. Verify: Only jobs with education requirement ≤ Graduation are shown
5. Verify: Only jobs with age range 21-40 (or with relaxation) are shown

### Test Case 2: Age Relaxation

1. Create a job with:
   - Age limit: 21-35
   - SC relaxation: 5 years
2. Filter as SC candidate, age 38
3. Verify: Job appears (35 + 5 = 40 ≥ 38)

### Test Case 3: Fee Calculation

1. Create a job with fees:
   - General: ₹500
   - OBC: ₹250
   - SC/ST: ₹0
2. Filter as OBC candidate
3. Verify: Job card shows "Fee: ₹250"
4. Filter as SC candidate
5. Verify: Job card shows "Fee: ₹0"

### Test Case 4: Pagination

1. Create 25+ jobs
2. Filter with criteria matching all jobs
3. Verify: First page shows 12 jobs
4. Click "Next" → Verify: Second page shows remaining jobs
5. Click page number → Verify: Correct page loads

### Test Case 5: Search + Filter

1. Filter with qualification and age
2. Type in search box: "Engineer"
3. Verify: Only jobs matching both criteria are shown
4. Clear search
5. Verify: All eligible jobs reappear

### Test Case 6: Empty State

1. Filter with criteria matching no jobs
2. Verify: "No Jobs Found" message appears
3. Verify: "Clear Filters" button is shown
4. Click "Clear Filters"
5. Verify: All active jobs appear

## Production Checklist

- [x] Backend eligibility matching algorithm implemented
- [x] Frontend EligibleJobs page created with all features
- [x] Home page Smart Eligibility Filter passes data correctly
- [x] Admin JobEligibility page allows setting criteria
- [x] Database models support all eligibility fields
- [x] API endpoint returns correct data with pagination
- [x] Error handling for invalid inputs
- [x] Loading states for better UX
- [x] Responsive design for mobile/tablet/desktop
- [x] Fee calculation per category
- [x] Age relaxation logic
- [x] Qualification hierarchy matching
- [x] Search + filter combination
- [x] Pagination with page numbers
- [x] Reset filters functionality

## Common Issues & Solutions

### Issue: Jobs not appearing in eligible list

**Solution**:

1. Verify job status is "active"
2. Verify application deadline is in future
3. Check eligibility criteria in job details
4. Verify candidate's qualification matches

### Issue: Wrong fee showing

**Solution**:

1. Check candidate's category in User model
2. Verify applicationFee object in Job model
3. Check fee calculation logic in backend

### Issue: Age relaxation not working

**Solution**:

1. Verify relaxation values are set in job
2. Check candidate's category is correct
3. Verify age calculation (should be: max + relaxation ≥ candidateAge)

### Issue: Pagination not working

**Solution**:

1. Verify limit parameter is set (default 20)
2. Check page parameter is valid
3. Verify total count is correct

## API Endpoints Reference

### Public Endpoints

**Get Eligible Jobs**

```
GET /api/jobs/search
Query: qualification, age, candidateCategory, department, search, page, limit
Response: { jobs: [], pagination: {} }
```

**Get Job Details**

```
GET /api/jobs/:id
Response: { job: { ...eligibility criteria... } }
```

**Get Departments**

```
GET /api/jobs/departments
Response: { departments: ["IT", "HR", ...] }
```

**Get Categories**

```
GET /api/jobs/categories
Response: { categories: ["General", "Technical", ...] }
```

## Frontend Service Methods

**job.service.js**

```javascript
// Get eligible jobs with filters
jobService.getEligibleJobs({
  q: "Engineer",
  qualification: "Graduation",
  age: 28,
  candidateCategory: "general",
  department: "IT",
  page: 1,
  limit: 12,
});

// Get job details
jobService.getPublicJob(jobId);

// Get departments
jobService.getDepartments();

// Get categories
jobService.getCategories();
```

## Database Schema Reference

**Job Model - Eligibility Fields**

```javascript
{
  ageLimit: {
    min: Number,
    max: Number,
    relaxation: {
      sc: Number,
      st: Number,
      obc: Number,
      pwd: Number
    }
  },
  education: {
    essential: [{
      degree: String,
      specialization: String,
      university: String
    }],
    desirable: [{
      degree: String,
      specialization: String,
      university: String
    }]
  },
  experience: {
    required: Boolean,
    years: Number,
    type: String,
    description: String
  },
  applicationFee: {
    general: Number,
    obc: Number,
    scSt: Number,
    ews: Number,
    pwd: Number
  }
}
```

**User Model - Category Field**

```javascript
{
  category: {
    type: String,
    enum: ["general", "obc", "sc", "st", "ews"]
  }
}
```

## Performance Optimization

1. **Database Indexes**
   - Job model has indexes on: status, applicationDeadline, department
   - Queries use these indexes for fast filtering

2. **Pagination**
   - Default limit: 20 jobs per page
   - Prevents loading too many documents

3. **Caching**
   - Frontend caches departments list (30 min)
   - Frontend caches job search results (5 min)

4. **Query Optimization**
   - Only select necessary fields
   - Use aggregation for category-wise stats
   - Limit results with skip/limit

## Future Enhancements

1. **Advanced Filters**
   - Experience level filter
   - Salary range filter
   - Location-based filter

2. **Saved Searches**
   - Allow candidates to save filter criteria
   - Send notifications for new matching jobs

3. **Eligibility Score**
   - Show match percentage for each job
   - Highlight best matches

4. **Bulk Operations**
   - Export eligible jobs as PDF
   - Share job list with others

5. **Analytics**
   - Track which filters are most used
   - Analyze candidate eligibility patterns
