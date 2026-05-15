# 🚀 Quick Start Guide

## Start the Project in 5 Minutes

### Step 1: Start Docker Services (30 seconds)

```bash
docker-compose up -d
```

This starts MongoDB, Redis, and RabbitMQ.

### Step 2: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### Step 3: Start Backend (10 seconds)

```bash
cd backend
npm run dev
```

You should see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Server running on port 5000
  🌍 Environment: development
  📖 Swagger UI: http://localhost:5000/api/docs
  📄 Swagger JSON: http://localhost:5000/api/docs.json
  🔌 WebSocket: ws://localhost:5000
  ❤️  Health: http://localhost:5000/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: Start Frontend (10 seconds)

```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/health

---

## 🧪 Test the API

### 1. Check Health

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "timestamp": "2024-..."
}
```

### 2. View API Documentation

Open in browser: http://localhost:5000/api/docs

### 3. Test WebSocket Connection

Open browser console on http://localhost:5173 and run:

```javascript
const socket = io("http://localhost:5000");
socket.on("connect", () => console.log("Connected!"));
```

---

## 🎯 Quick API Tests

### Register a Candidate

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "registeredMobile": "9876543210"
  }'
```

### Get Public Jobs

```bash
curl http://localhost:5000/api/jobs
```

### Get Job Statistics

```bash
curl http://localhost:5000/api/jobs/stats
```

---

## 🔍 Verify Services

### Check Docker Containers

```bash
docker ps
```

You should see 3 containers running:

- `recruitment_mongodb`
- `recruitment_redis`
- `recruitment_rabbitmq`

### Check MongoDB

```bash
docker exec -it recruitment_mongodb mongosh -u admin -p password123
```

### Check Redis

```bash
docker exec -it recruitment_redis redis-cli ping
```

Expected: `PONG`

### Check RabbitMQ Management UI

Open: http://localhost:15672

- Username: `admin`
- Password: `password123`

---

## 🐛 Common Issues

### Port 5000 Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Docker Services Not Starting

```bash
# Stop all containers
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### MongoDB Connection Error

```bash
# Check MongoDB logs
docker logs recruitment_mongodb

# Restart MongoDB
docker restart recruitment_mongodb
```

---

## 📱 WebSocket Real-Time Testing

### Test Real-Time Updates

1. Open two browser windows:
   - Window 1: Admin Dashboard (http://localhost:5173/admin/dashboard)
   - Window 2: Candidate Portal (http://localhost:5173/candidate/dashboard)

2. In Window 2, create an application

3. Watch Window 1 for instant updates!

---

## 🎨 Frontend Pages Available

### Public Pages

- `/` - Homepage with job search
- `/jobs` - Job listings
- `/jobs/:id` - Job details

### Auth Pages

- `/auth/login` - Unified login
- `/auth/candidate-login` - Candidate login
- `/auth/admin-login` - Admin login
- `/auth/register` - Registration

### Admin Pages (28 pages)

- `/admin/dashboard` - Real-time dashboard
- `/admin/projects` - Project management
- `/admin/jobs` - Job management
- `/admin/applications` - Application review
- `/admin/employees` - Employee management
- `/admin/roles` - Role management
- `/admin/support` - Support tickets
- `/admin/analytics` - Analytics
- And more...

### Candidate Pages

- `/candidate/dashboard` - Candidate dashboard
- `/candidate/applications` - My applications
- `/candidate/profile` - Profile management

### Application Flow (9 Steps)

- `/application/personal-details` - Step 1
- `/application/education` - Step 2
- `/application/additional-info` - Step 3
- `/application/address` - Step 4
- `/application/documents` - Step 5
- `/application/review` - Step 6
- `/application/post-selection` - Step 7
- `/application/payment` - Step 8
- `/application/success` - Step 9

---

## 🎯 Next: Create Your First Admin User

Since there's no admin in the database yet, you'll need to create one manually or via a seed script.

### Option 1: Create via MongoDB Shell

```bash
docker exec -it recruitment_mongodb mongosh -u admin -p password123

use recruitment_portal

db.employees.insertOne({
  fullName: "Super Admin",
  email: "admin@recruitment.gov.in",
  officialEmail: "admin@recruitment.gov.in",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu", // password: admin123
  employeeId: "EMP001",
  department: "Administration",
  roleDesignation: "Super Admin",
  contactNumber: "9999999999",
  dateOfJoining: new Date(),
  status: "Active",
  createdBy: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option 2: Use the API (Coming Soon)

A seed script will be provided to create initial admin users.

---

## ✅ You're All Set!

Your recruitment portal is now running with:

- ✅ Backend API on port 5000
- ✅ Frontend on port 5173
- ✅ MongoDB, Redis, RabbitMQ running
- ✅ WebSocket real-time updates enabled
- ✅ Swagger API documentation available

**Start building! 🎉**
