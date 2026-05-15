# Setup Guide for Team Members

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Docker Desktop** (for Redis & RabbitMQ)
3. **Git**

---

## Step 1: Install Docker Desktop

### Windows:

1. Download: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop
3. Start Docker Desktop (wait for it to fully start)
4. Verify: Open PowerShell and run:
   ```powershell
   docker --version
   ```
   Should show: `Docker version 24.x.x`

### Mac:

1. Download: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop
3. Start Docker Desktop from Applications
4. Verify:
   ```bash
   docker --version
   ```

---

## Step 2: Clone & Setup Project

```bash
# Clone repository
git clone <repository-url>
cd Recruitment-Portal

# Install backend dependencies
cd backend
npm run install:all

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 3: Environment Variables

### Backend `.env` File

Create `backend/.env` file (or copy from team):

```env
# ─── Server ───────────────────────────────────────────────
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# ─── Microservices Ports ──────────────────────────────────
API_GATEWAY_PORT=5000
IDENTITY_SERVICE_PORT=5001
RECRUITMENT_SERVICE_PORT=5002
COMMUNICATION_SERVICE_PORT=5003

# ─── MongoDB ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://piyushnagose204_db_user:Piyush123@cluster0.vdxs1vc.mongodb.net/recruitment_portal?retryWrites=true&w=majority

# ─── JWT ──────────────────────────────────────────────────
JWT_ACCESS_SECRET=recruitment_portal_access_secret_2024_secure_key_here
JWT_REFRESH_SECRET=recruitment_portal_refresh_secret_2024_secure_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── RabbitMQ ─────────────────────────────────────────────
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# ─── Cloudinary ───────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=dno4ebvqz
CLOUDINARY_API_KEY=156843981851386
CLOUDINARY_API_SECRET=mbKh4M7b7zFvtAN3ZY4I_HPhMTs

# ─── Email (SMTP) ─────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=srajalvishwakarma8@gmail.com
SMTP_PASS=umzf uieu mzrt xmct
EMAIL_FROM=srajalvishwakarma8@gmail.com

# ─── SMS ──────────────────────────────────────────────────
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=RECRUIT

# ─── Rate Limiting ────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# ─── Encryption ───────────────────────────────────────────
ENCRYPTION_KEY=recruitment_portal_encrypt_key_32
```

---

## Step 4: Start Redis & RabbitMQ (Docker)

### Option A: Check if Already Running

```powershell
# Check if Redis/RabbitMQ containers exist
docker ps -a
```

If you see `fieldwork-redis` and `fieldwork-rabbitmq` running:

- **You're done!** Skip to Step 5.

### Option B: Start New Containers

If no Redis/RabbitMQ containers exist:

```powershell
# Navigate to backend folder
cd backend

# Start Redis & RabbitMQ
docker run -d --name recruitment-redis -p 6379:6379 redis:7-alpine

docker run -d --name recruitment-rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management-alpine
```

### Verify Services Running

```powershell
# Check containers
docker ps

# Should show:
# recruitment-redis      running
# recruitment-rabbitmq   running
```

### Test Connections

**Test Redis:**

```powershell
docker exec recruitment-redis redis-cli ping
# Should return: PONG
```

**Test RabbitMQ:**

- Open browser: http://localhost:15672
- Login: `guest` / `guest`
- Should see RabbitMQ dashboard

---

## Step 5: Seed Database (First Time Only)

```bash
cd backend
node scripts/seed-admin.js
```

This creates:

- 5 default roles
- 1 Super Admin user
  - Email: `admin@recruitment.gov.in`
  - Password: `Admin@123456`

---

## Step 6: Start Application

### Start Backend (All Services)

```bash
cd backend
npm run dev
```

You should see:

```
✅ MongoDB connected
📦 Redis connected
🐰 RabbitMQ connected and queues asserted
☁️ Cloudinary configured
📧 Email service configured
🔐 Identity Service: http://localhost:5001
📋 Recruitment Service: http://localhost:5002
💬 Communication Service: http://localhost:5003
🌐 API Gateway: http://localhost:5000
```

### Start Frontend (Separate Terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on: http://localhost:5173

---

## Troubleshooting

### Issue: "Port already in use"

**Solution:**

```powershell
# Kill processes on ports
npm run kill-ports

# Or manually
npx kill-port 5000 5001 5002 5003 6379 5672
```

### Issue: "Docker command not found"

**Solution:**

1. Make sure Docker Desktop is installed
2. Start Docker Desktop application
3. Wait for it to fully start (whale icon in system tray)
4. Restart terminal/PowerShell

### Issue: "Cannot connect to Redis"

**Solution:**

```powershell
# Check if Redis is running
docker ps | findstr redis

# If not running, start it
docker start recruitment-redis

# Or create new container
docker run -d --name recruitment-redis -p 6379:6379 redis:7-alpine
```

### Issue: "Cannot connect to RabbitMQ"

**Solution:**

```powershell
# Check if RabbitMQ is running
docker ps | findstr rabbitmq

# If not running, start it
docker start recruitment-rabbitmq

# Or create new container
docker run -d --name recruitment-rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management-alpine
```

### Issue: "MongoDB connection failed"

**Solution:**

- Check if `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist includes your IP
- Or use: `0.0.0.0/0` (allow all IPs) in MongoDB Atlas Network Access

### Issue: Backend starts but shows warnings

If you see:

```
⚠️  Redis not running. Caching disabled.
⚠️  RabbitMQ not running. Queue features disabled.
```

**Solution:**

- Application works without Redis/RabbitMQ
- But for full functionality, start them using Docker commands above

---

## Quick Commands Reference

```bash
# Install all dependencies
cd backend && npm run install:all

# Start Redis & RabbitMQ
docker start recruitment-redis recruitment-rabbitmq

# Stop Redis & RabbitMQ
docker stop recruitment-redis recruitment-rabbitmq

# View Docker containers
docker ps -a

# View container logs
docker logs recruitment-redis
docker logs recruitment-rabbitmq

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Seed database
cd backend && node scripts/seed-admin.js

# Kill ports
cd backend && npm run kill-ports
```

---

## API Endpoints

- **API Gateway**: http://localhost:5000
- **Identity Service**: http://localhost:5001
- **Recruitment Service**: http://localhost:5002
- **Communication Service**: http://localhost:5003

### Swagger Documentation

- http://localhost:5000/api/docs (Gateway)
- http://localhost:5001/api/docs (Identity)
- http://localhost:5002/api/docs (Recruitment)
- http://localhost:5003/api/docs (Communication)

### RabbitMQ Management

- http://localhost:15672
- Username: `guest`
- Password: `guest`

---

## Development Workflow

1. **Pull latest code:**

   ```bash
   git pull origin main
   ```

2. **Install new dependencies (if any):**

   ```bash
   cd backend && npm run install:all
   cd ../frontend && npm install
   ```

3. **Start Docker services:**

   ```bash
   docker start recruitment-redis recruitment-rabbitmq
   ```

4. **Start backend:**

   ```bash
   cd backend && npm run dev
   ```

5. **Start frontend (new terminal):**

   ```bash
   cd frontend && npm run dev
   ```

6. **Start coding!** 🚀

---

## Team Collaboration Tips

### For Backend Developers:

- Always run `npm run install:all` after pulling new code
- Check if new environment variables added to `.env.example`
- Run seed script if database schema changed
- Test all 4 services start successfully

### For Frontend Developers:

- Backend must be running on `http://localhost:5000`
- Use API Gateway endpoint (port 5000) for all API calls
- Check Swagger docs for API changes
- Redis/RabbitMQ optional for frontend development

### Before Pushing Code:

- Test locally with all services running
- Ensure no console errors
- Update `.env.example` if added new variables
- Don't commit `.env` file (it's in `.gitignore`)

---

## Need Help?

**Common Issues:**

1. Docker not starting → Restart Docker Desktop
2. Port conflicts → Run `npm run kill-ports`
3. MongoDB connection → Check `.env` MONGODB_URI
4. Redis/RabbitMQ → Restart containers: `docker restart recruitment-redis recruitment-rabbitmq`

**Contact:**

- Backend Lead: [Your Name]
- Frontend Lead: [Friend's Name]

---

## Summary

✅ Install Docker Desktop
✅ Clone repository
✅ Create `.env` file
✅ Start Redis & RabbitMQ (Docker)
✅ Install dependencies
✅ Seed database (first time)
✅ Start backend & frontend
✅ Start developing!

**Total setup time: ~10 minutes** ⏱️
