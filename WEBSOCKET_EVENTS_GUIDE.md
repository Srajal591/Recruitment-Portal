# 🔌 WebSocket Events - Complete Guide

## Connection Setup

### **Backend (Already Implemented)**

```javascript
// Socket.IO server initialized in each microservice
const { initSocket } = require("./packages/common/socket");
initSocket(httpServer);
```

### **Frontend Integration (To Implement)**

```javascript
// frontend/src/lib/socket.js
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("accessToken"),
  },
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Connection events
socket.on("connect", () => {
  console.log("✅ Connected to server");
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

export default socket;
```

---

## 📊 **All WebSocket Events**

### **1. Dashboard Events** (Admin Only)

#### `dashboard:stats:update`

**Triggered:** When dashboard statistics change
**Sent to:** All admins
**Data:**

```javascript
{
  totalJobs: 45,
  totalApplications: 1250,
  totalCandidates: 890,
  totalRevenue: 125000,
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("dashboard:stats:update", (data) => {
  // Update dashboard state
  setDashboardStats(data);
  toast.success("Dashboard updated");
});
```

---

#### `dashboard:funnel:update`

**Triggered:** When application funnel data changes
**Sent to:** All admins
**Data:**

```javascript
{
  started: 1000,
  personalDetailsCompleted: 850,
  educationCompleted: 720,
  documentsUploaded: 650,
  paymentCompleted: 580,
  submitted: 550,
  conversionRates: {
    overall: 55.0
  }
}
```

---

#### `admin:live:count`

**Triggered:** On any admin action (create/update/delete)
**Sent to:** All admins
**Data:**

```javascript
{
  type: "employee_created" | "role_updated" | "project_deleted" | "job_published",
  message: "New employee 'John Doe' added",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("admin:live:count", (data) => {
  // Show toast notification
  toast.info(data.message);

  // Refresh relevant data
  if (data.type === "employee_created") {
    refetchEmployees();
  }
});
```

---

### **2. Application Events**

#### `application:submitted`

**Triggered:** When candidate submits application
**Sent to:** Candidate + All admins
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  candidateName: "John Doe",
  jobTitle: "Junior Engineer",
  submittedAt: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage (Candidate):**

```javascript
socket.on("application:submitted", (data) => {
  toast.success("Application submitted successfully!");
  navigate("/application/success");
});
```

**Frontend Usage (Admin):**

```javascript
socket.on("admin:application:new", (data) => {
  toast.info(`New application from ${data.candidateName}`);
  refetchApplications();
  playNotificationSound();
});
```

---

#### `application:status:changed`

**Triggered:** When admin changes application status
**Sent to:** Specific candidate
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  oldStatus: "under_review",
  newStatus: "approved",
  message: "Your application has been approved",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage (Candidate):**

```javascript
socket.on("application:status:changed", (data) => {
  // Update application status in UI
  updateApplicationStatus(data.applicationId, data.newStatus);

  // Show notification
  if (data.newStatus === "approved") {
    toast.success(data.message);
  } else if (data.newStatus === "rejected") {
    toast.error(data.message);
  }

  // Refresh application list
  refetchApplications();
});
```

---

### **3. Document Events**

#### `document:verified`

**Triggered:** When admin verifies a document
**Sent to:** Specific candidate
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  documentType: "tenth_certificate",
  verifiedBy: "Admin Name",
  message: "Your 10th certificate has been verified",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("document:verified", (data) => {
  toast.success(data.message);

  // Update document status in UI
  updateDocumentStatus(data.documentType, "verified");

  // Refresh application details
  refetchApplication(data.applicationId);
});
```

---

#### `document:rejected`

**Triggered:** When admin rejects a document
**Sent to:** Specific candidate
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  documentType: "graduation_certificate",
  reason: "Document is not clear. Please upload a better quality image.",
  message: "Your graduation certificate was rejected",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("document:rejected", (data) => {
  toast.error(data.message);

  // Show rejection reason
  showModal({
    title: "Document Rejected",
    message: data.reason,
    action: "Re-upload Document",
  });

  // Update document status
  updateDocumentStatus(data.documentType, "rejected");
});
```

---

### **4. Payment Events**

#### `payment:success`

**Triggered:** When payment is successful
**Sent to:** Specific candidate
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  transactionId: "TXN-2024-567890",
  amount: 500,
  paymentMethod: "UPI",
  message: "Payment successful",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("payment:success", (data) => {
  toast.success("Payment successful!");

  // Update payment status
  updatePaymentStatus(data.applicationId, "paid");

  // Navigate to success page
  navigate("/application/success");

  // Show receipt
  showReceipt(data.transactionId);
});
```

---

#### `payment:failed`

**Triggered:** When payment fails
**Sent to:** Specific candidate
**Data:**

```javascript
{
  applicationId: "APP-2024-001234",
  transactionId: "TXN-2024-567890",
  reason: "Insufficient balance",
  message: "Payment failed",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("payment:failed", (data) => {
  toast.error(`Payment failed: ${data.reason}`);

  // Show retry option
  showModal({
    title: "Payment Failed",
    message: data.reason,
    action: "Retry Payment",
  });
});
```

---

### **5. Job Events** (Broadcast to All)

#### `job:published`

**Triggered:** When admin publishes a new job
**Sent to:** Everyone (broadcast)
**Data:**

```javascript
{
  jobId: "64f8a9b2c3d4e5f6a7b8c9d0",
  title: "Junior Engineer",
  department: "Public Works Department",
  postCode: "PWD-2024-001",
  applicationDeadline: "2024-06-30T23:59:59Z",
  message: "New job published: Junior Engineer"
}
```

**Frontend Usage (Public):**

```javascript
socket.on("job:published", (data) => {
  // Show notification
  toast.info(`New job: ${data.title}`);

  // Add to job list without refresh
  addJobToList(data);

  // Show badge on jobs page
  showNewJobBadge();
});
```

---

#### `job:closed`

**Triggered:** When job deadline passes or admin closes job
**Sent to:** Everyone (broadcast)
**Data:**

```javascript
{
  jobId: "64f8a9b2c3d4e5f6a7b8c9d0",
  title: "Junior Engineer",
  message: "Job application closed: Junior Engineer"
}
```

**Frontend Usage:**

```javascript
socket.on("job:closed", (data) => {
  // Update job status in UI
  updateJobStatus(data.jobId, "closed");

  // Remove from active jobs list
  removeFromActiveJobs(data.jobId);

  // Show notification
  toast.warning(data.message);
});
```

---

### **6. Support Ticket Events**

#### `support:ticket:created`

**Triggered:** When candidate creates a support ticket
**Sent to:** All admins
**Data:**

```javascript
{
  ticketId: "TKT-2024-001234",
  title: "Payment not reflecting",
  priority: "High",
  category: "Payment",
  candidateName: "John Doe",
  candidateEmail: "john@example.com"
}
```

**Frontend Usage (Admin):**

```javascript
socket.on("support:ticket:created", (data) => {
  toast.info(`New ${data.priority} priority ticket: ${data.title}`);

  // Add to ticket list
  addTicketToList(data);

  // Play sound for high/critical priority
  if (data.priority === "High" || data.priority === "Critical") {
    playUrgentSound();
  }

  // Update ticket count badge
  incrementTicketCount();
});
```

---

#### `support:ticket:reply`

**Triggered:** When admin or candidate replies to ticket
**Sent to:** Candidate (if admin replied) or Admins (if candidate replied)
**Data:**

```javascript
{
  ticketId: "TKT-2024-001234",
  message: "We have processed your refund request",
  from: "Admin Name" | "Candidate Name",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage (Candidate):**

```javascript
socket.on("support:ticket:reply", (data) => {
  toast.info(`New reply from ${data.from}`);

  // Add reply to ticket thread
  addReplyToTicket(data.ticketId, data);

  // Show notification badge
  showUnreadReplyBadge(data.ticketId);

  // Scroll to new reply if ticket is open
  if (currentTicketId === data.ticketId) {
    scrollToLatestReply();
  }
});
```

---

#### `support:ticket:resolved`

**Triggered:** When admin marks ticket as resolved
**Sent to:** Specific candidate
**Data:**

```javascript
{
  ticketId: "TKT-2024-001234",
  message: "Your support ticket has been resolved",
  resolvedBy: "Admin Name",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("support:ticket:resolved", (data) => {
  toast.success(data.message);

  // Update ticket status
  updateTicketStatus(data.ticketId, "Resolved");

  // Show feedback form
  showFeedbackModal(data.ticketId);
});
```

---

### **7. Notification Events**

#### `notification:new`

**Triggered:** On any important event
**Sent to:** Specific user
**Data:**

```javascript
{
  id: "notif-123",
  type: "info" | "success" | "warning" | "error",
  title: "Application Update",
  message: "Your application has been approved",
  link: "/candidate/applications/APP-2024-001234",
  timestamp: "2024-05-15T10:30:00Z"
}
```

**Frontend Usage:**

```javascript
socket.on("notification:new", (data) => {
  // Add to notification list
  addNotification(data);

  // Show toast
  toast[data.type](data.message);

  // Update notification badge
  incrementNotificationCount();

  // Play sound
  playNotificationSound();
});
```

---

## 🎯 **Frontend Implementation Guide**

### **1. Create WebSocket Hook**

```javascript
// frontend/src/hooks/useWebSocket.js
import { useEffect } from "react";
import socket from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const useWebSocket = () => {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect
    socket.connect();

    // Common events for all users
    socket.on("notification:new", (data) => {
      toast[data.type](data.message);
    });

    // Candidate-specific events
    if (user?.role === "candidate") {
      socket.on("application:status:changed", (data) => {
        toast.info(data.message);
        // Trigger refetch
      });

      socket.on("document:verified", (data) => {
        toast.success(data.message);
      });

      socket.on("document:rejected", (data) => {
        toast.error(data.message);
      });

      socket.on("payment:success", (data) => {
        toast.success("Payment successful!");
      });

      socket.on("support:ticket:reply", (data) => {
        toast.info(`New reply from ${data.from}`);
      });
    }

    // Admin-specific events
    if (user?.role === "admin" || user?.role === "employee") {
      socket.on("admin:live:count", (data) => {
        toast.info(data.message);
      });

      socket.on("admin:application:new", (data) => {
        toast.info(`New application from ${data.candidateName}`);
      });

      socket.on("support:ticket:created", (data) => {
        toast.info(`New ticket: ${data.title}`);
      });
    }

    // Public events (everyone)
    socket.on("job:published", (data) => {
      toast.info(`New job: ${data.title}`);
    });

    // Cleanup
    return () => {
      socket.off("notification:new");
      socket.off("application:status:changed");
      socket.off("document:verified");
      socket.off("document:rejected");
      socket.off("payment:success");
      socket.off("admin:live:count");
      socket.off("admin:application:new");
      socket.off("support:ticket:created");
      socket.off("support:ticket:reply");
      socket.off("job:published");
    };
  }, [isAuthenticated, user]);

  return socket;
};
```

---

### **2. Use in Components**

```javascript
// In any component
import { useWebSocket } from "../hooks/useWebSocket";

function Dashboard() {
  const socket = useWebSocket();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Listen for dashboard updates
    socket.on("dashboard:stats:update", (data) => {
      setStats(data);
    });

    return () => {
      socket.off("dashboard:stats:update");
    };
  }, [socket]);

  return <div>Dashboard with real-time stats</div>;
}
```

---

### **3. Manual Emit (if needed)**

```javascript
// Emit custom events (if backend supports)
socket.emit("custom:event", { data: "value" });

// Listen for response
socket.on("custom:response", (data) => {
  console.log(data);
});
```

---

## 🎨 **UI/UX Recommendations**

### **1. Toast Notifications**

```javascript
// Use react-hot-toast (already in package.json)
import toast from "react-hot-toast";

socket.on("application:status:changed", (data) => {
  if (data.newStatus === "approved") {
    toast.success(data.message, {
      duration: 5000,
      icon: "✅",
    });
  }
});
```

### **2. Notification Badge**

```javascript
const [unreadCount, setUnreadCount] = useState(0);

socket.on("notification:new", () => {
  setUnreadCount((prev) => prev + 1);
});

// In UI
<Bell className="w-5 h-5" />;
{
  unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {unreadCount}
    </span>
  );
}
```

### **3. Sound Notifications**

```javascript
const playSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.play();
};

socket.on("support:ticket:created", (data) => {
  if (data.priority === "Critical") {
    playSound();
  }
});
```

### **4. Auto-Refresh Data**

```javascript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

socket.on("admin:application:new", () => {
  // Invalidate and refetch
  queryClient.invalidateQueries(["applications"]);
});
```

---

## ✅ **Testing WebSocket**

### **Browser Console Test:**

```javascript
// Open browser console on http://localhost:5173
const socket = io("http://localhost:5000", {
  auth: { token: "your_jwt_token_here" },
});

socket.on("connect", () => console.log("✅ Connected"));
socket.on("disconnect", () => console.log("❌ Disconnected"));

// Listen to all events
socket.onAny((event, data) => {
  console.log(`📨 Event: ${event}`, data);
});
```

---

## 🎯 **Summary**

**Total Events:** 15 WebSocket events
**Coverage:** 100% of backend operations
**Real-time:** Every page can update without refresh

**Event Categories:**

- ✅ Dashboard (2 events)
- ✅ Applications (2 events)
- ✅ Documents (2 events)
- ✅ Payments (2 events)
- ✅ Jobs (2 events)
- ✅ Support (3 events)
- ✅ Notifications (1 event)
- ✅ Admin (1 event)

**Ready for Frontend Integration!** 🚀
