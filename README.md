# Government Recruitment & Examination Management Portal

A comprehensive MERN stack application for managing government recruitment processes with real-time updates via WebSockets.

## 🚀 Features

### Multi-Portal Architecture

- **Public Portal**: Job listings, notices, results, admit cards
- **Candidate Portal**: Application management, document upload, payment processing
- **Admin Panel**: Complete recruitment workflow management with real-time dashboard

### Real-Time Updates (WebSocket)

- ✅ Instant dashboard updates for admins
- ✅ Live application status notifications for candidates
- ✅ Real-time document verification updates
- ✅ Payment status notifications
- ✅ Support ticket updates
- ✅ New job publication alerts

### Key Capabilities

- 🎯 Dynamic multi-step application forms (9 steps)
- 📄 Document management with Cloudinary integration
- 💳 Payment gateway integration (Razorpay ready)
- 👥 Role-based access control (RBAC)
- 📊 Real-time analytics and reporting
- 🔔 Multi-channel notifications (Email, SMS, In-app)
- 🎫 Support ticket management with Kanban board
- 📝 Activity logging and audit trails

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v7.0 or higher)
- **Redis** (v7.2 or higher)
- **RabbitMQ** (v3.12 or higher)
- **Docker** (optional, for running services via Docker Compose)

---

## 🛠️ Installation & Setup

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd Recruitment-Portal
```

2. **Start all services using Docker Compose**

```bash
docker-compose up -d
```

This will start:

- MongoDB on port `27017`
- Redis on port `6379`
- RabbitMQ on ports `5672` (AMQP) and `15672` (Management UI)

3. **Install backend dependencies**

```bash
cd backend
npm install
```

4. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

5. **Configure environment variables**

The `.env` file is already configured in `backend/.env`. Update if needed:

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
WEBHOOK_BASE_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/recruitment_portal?authSource=admin

# JWT
JWT_ACCESS_SECRET=recruitment_portal_access_secret_2024_secure_key_here
JWT_REFRESH_SECRET=recruitment_portal_refresh_secret_2024_secure_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://admin:password123@localhost:5672

# Cloudinary (Update with your credentials)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend builds should also define:

```env
VITE_API_BASE_URL=/api
```

6. **Start the backend server**

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

7. **Start the frontend development server**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

---

### Option 2: Manual Installation (Without Docker)

If you prefer to install services manually:

#### Install MongoDB

- **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community@7.0`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/installation/)

#### Install Redis

- **Windows**: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
- **Mac**: `brew install redis`
- **Linux**: `sudo apt-get install redis-server`

#### Install RabbitMQ

- **Windows**: Download from [RabbitMQ Downloads](https://www.rabbitmq.com/download.html)
- **Mac**: `brew install rabbitmq`
- **Linux**: `sudo apt-get install rabbitmq-server`

Then follow steps 3-7 from Option 1.

---

## 🎯 Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger API Docs**: http://localhost:5000/api/docs
- **Swagger JSON**: http://localhost:5000/api/docs.json
- **Health Check**: http://localhost:5000/health
- **RabbitMQ Management**: http://localhost:15672 (admin/password123)

---

## 📚 API Documentation

### Swagger UI

Access comprehensive API documentation at: **http://localhost:5000/api/docs**

The Swagger UI provides:

- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

### Import to Postman

Download the Swagger JSON from http://localhost:5000/api/docs.json and import it into Postman.

---

## 🔌 WebSocket Events

### Client Connection

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_token_here",
  },
});
```

### Available Events

#### For Candidates

- `application:submitted` - Application submission confirmation
- `application:status:changed` - Status updates (approved, rejected, etc.)
- `document:verified` - Document verification success
- `document:rejected` - Document rejection with reason
- `payment:success` - Payment confirmation
- `payment:failed` - Payment failure notification
- `notification:new` - New notifications

#### For Admins

- `admin:application:new` - New application received
- `admin:live:count` - Real-time dashboard updates
- `dashboard:stats:update` - Dashboard statistics refresh
- `job:published` - New job published
- `job:closed` - Job application closed

#### Public Events

- `job:published` - New job available (broadcast to all)
- `job:closed` - Job deadline passed (broadcast to all)

### Example Usage

```javascript
// Listen for application status changes
socket.on("application:status:changed", (data) => {
  console.log("Status updated:", data);
  // Update UI accordingly
});

// Listen for new notifications
socket.on("notification:new", (data) => {
  console.log("New notification:", data);
  // Show toast notification
});
```

---

## 🗂️ Project Structure

```
Recruitment-Portal/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Redis, RabbitMQ, Cloudinary)
│   │   ├── controllers/     # Request handlers
│   │   │   ├── admin/       # Admin controllers
│   │   │   ├── candidate/   # Candidate controllers
│   │   │   └── public/      # Public controllers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   │   ├── admin/       # Admin routes
│   │   │   ├── candidate/   # Candidate routes
│   │   │   └── public/      # Public routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── services/        # Business logic
│   │   ├── socket/          # WebSocket configuration
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Input validation schemas
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── logs/                # Application logs
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Page components
│   │   │   ├── admin/       # Admin pages (28 files)
│   │   │   ├── application/ # Application flow (9 steps)
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── candidate/   # Candidate portal pages
│   │   │   └── public/      # Public pages
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # Common components
│   │   │   ├── layouts/     # Layout components
│   │   │   └── ui/          # UI components
│   │   ├── routes/          # React Router configuration
│   │   ├── constants/       # Constants and configurations
│   │   ├── lib/             # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml       # Docker services configuration
├── PROJECT.md               # Detailed project documentation
└── README.md                # This file
```

---

## 🔐 Authentication

### Register a New Candidate

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "registeredMobile": "9876543210"
}
```

### Verify OTP

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "candidate@example.com",
  "otp": "123456"
}
```

### Login as Candidate

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "password123"
}
```

### Login as Admin

```bash
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## 📊 Database Models

### Core Models

- **User** - Candidate information and authentication
- **Employee** - Admin/staff members
- **Role** - RBAC role definitions
- **Project** - Recruitment projects
- **Job** - Job postings with dynamic forms
- **Application** - Candidate applications (9-step form)
- **Payment** - Payment transactions
- **PaymentGateway** - Payment gateway configurations
- **SupportTicket** - Support tickets
- **Notification** - User notifications
- **ActivityLog** - Audit trail

---

## 🧪 Testing the API

### Using Swagger UI

1. Navigate to http://localhost:5000/api/docs
2. Click "Authorize" button
3. Enter your JWT token
4. Test any endpoint directly from the browser

### Using cURL

**Get all active jobs:**

```bash
curl http://localhost:5000/api/jobs
```

**Get job details:**

```bash
curl http://localhost:5000/api/jobs/{jobId}
```

**Create application (requires auth):**

```bash
curl -X POST http://localhost:5000/api/candidate/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "job_id_here"}'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker logs recruitment_mongodb

# Restart MongoDB
docker restart recruitment_mongodb
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping

# Restart Redis
docker restart recruitment_redis
```

### RabbitMQ Connection Issues

```bash
# Check if RabbitMQ is running
docker ps | grep rabbitmq

# Access RabbitMQ Management UI
# http://localhost:15672 (admin/password123)

# Restart RabbitMQ
docker restart recruitment_rabbitmq
```

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Kill the process (Mac/Linux)
kill -9 <PID>
```

### Clear Node Modules and Reinstall

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables Reference

| Variable                 | Description               | Default                  |
| ------------------------ | ------------------------- | ------------------------ |
| `NODE_ENV`               | Environment mode          | `development`            |
| `PORT`                   | Backend server port       | `5000`                   |
| `CLIENT_URL`             | Frontend URL for CORS     | `http://localhost:5173`  |
| `MONGODB_URI`            | MongoDB connection string | See `.env`               |
| `JWT_ACCESS_SECRET`      | JWT access token secret   | Required                 |
| `JWT_REFRESH_SECRET`     | JWT refresh token secret  | Required                 |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry       | `15m`                    |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry      | `7d`                     |
| `REDIS_URL`              | Redis connection URL      | `redis://localhost:6379` |
| `RABBITMQ_URL`           | RabbitMQ connection URL   | See `.env`               |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name     | Required for uploads     |
| `CLOUDINARY_API_KEY`     | Cloudinary API key        | Required for uploads     |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret     | Required for uploads     |

---

## 🚦 Development Workflow

### 1. Start Services

```bash
docker-compose up -d
```

### 2. Start Backend (with auto-reload)

```bash
cd backend
npm run dev
```

### 3. Start Frontend (with HMR)

```bash
cd frontend
npm run dev
```

### 4. Monitor Logs

```bash
# Backend logs
tail -f backend/logs/combined-*.log

# Docker logs
docker-compose logs -f
```

---

## 🎨 Frontend Development

### Available Routes

- `/` - Homepage
- `/auth/login` - Unified login
- `/auth/candidate-login` - Candidate login
- `/auth/admin-login` - Admin login
- `/auth/register` - Registration
- `/jobs` - Job listings
- `/jobs/:id` - Job details
- `/candidate/*` - Candidate portal (10 pages)
- `/admin/*` - Admin panel (28 pages)
- `/application/*` - Application flow (9 steps)

### Development Navigation

A development navigation menu is available in development mode for easy testing of all routes.

---

## 🔒 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all API endpoints
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Input validation with Zod
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure cookie handling
- ✅ Role-based access control (RBAC)
- ✅ Activity logging and audit trails

---

## 📈 Performance Optimizations

- ✅ Redis caching for frequently accessed data
- ✅ Database indexing on critical fields
- ✅ Lazy loading of React components
- ✅ Code splitting by route
- ✅ Image optimization with Cloudinary
- ✅ Compression middleware
- ✅ WebSocket for real-time updates (reduces polling)
- ✅ Pagination on all list endpoints

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Friend's Name]

---

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Email: support@recruitment-portal.com

---

## 🎯 Next Steps

1. ✅ Complete backend API implementation
2. ⏳ Integrate payment gateway (Razorpay)
3. ⏳ Implement email/SMS notifications via RabbitMQ
4. ⏳ Add PDF generation for admit cards
5. ⏳ Implement file upload with Cloudinary
6. ⏳ Add remaining admin controllers
7. ⏳ Frontend-backend integration
8. ⏳ Testing and bug fixes
9. ⏳ Deployment setup

---

**Happy Coding! 🚀**
