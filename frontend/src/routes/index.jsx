import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600">Loading...</span>
    </div>
  </div>
)

// Import Home directly for better performance
import Home from '../app/public/Home'

// Lazy load all other components
const Login = lazy(() => import('../app/auth/Login'))
const CandidateLogin = lazy(() => import('../app/auth/CandidateLogin'))
const AdminLogin = lazy(() => import('../app/auth/AdminLogin'))
const Register = lazy(() => import('../app/auth/Register'))
const ForgotPassword = lazy(() => import('../app/auth/ForgotPassword'))
const VerifyOTP = lazy(() => import('../app/auth/VerifyOTP'))

// Application Flow Pages
const PersonalDetails = lazy(() => import('../app/application/PersonalDetails'))
const Education = lazy(() => import('../app/application/Education'))
const AdditionalInfo = lazy(() => import('../app/application/AdditionalInfo'))
const Address = lazy(() => import('../app/application/Address'))
const ApplicationDocuments = lazy(() => import('../app/application/Documents'))
const Review = lazy(() => import('../app/application/Review'))
const PostSelection = lazy(() => import('../app/application/PostSelection'))
const Payment = lazy(() => import('../app/application/Payment'))
const Success = lazy(() => import('../app/application/Success'))

// Public Pages
const About = lazy(() => import('../app/public/About'))
const Jobs = lazy(() => import('../app/public/Jobs'))
const JobDetails = lazy(() => import('../app/public/JobDetails'))
const Results = lazy(() => import('../app/public/Results'))
const Notices = lazy(() => import('../app/public/Notices'))
const AdmitCards = lazy(() => import('../app/public/AdmitCards'))
const Downloads = lazy(() => import('../app/public/Downloads'))
const FAQ = lazy(() => import('../app/public/FAQ'))
const Contact = lazy(() => import('../app/public/Contact'))

// Admin Pages
const AdminDashboard = lazy(() => import('../app/admin/Dashboard'))
const PaymentSettings = lazy(() => import('../app/admin/PaymentSettings'))
const RazorpayConfig = lazy(() => import('../app/admin/RazorpayConfig'))
const AddPaymentGateway = lazy(() => import('../app/admin/AddPaymentGateway'))
const Projects = lazy(() => import('../app/admin/Projects'))
const CreateProject = lazy(() => import('../app/admin/CreateProject'))
const AdminJobs = lazy(() => import('../app/admin/Jobs'))
const AdminApplications = lazy(() => import('../app/admin/Applications'))
const Analytics = lazy(() => import('../app/admin/Analytics'))
const AdminSupport = lazy(() => import('../app/admin/Support'))
const Employees = lazy(() => import('../app/admin/Employees'))
const Roles = lazy(() => import('../app/admin/Roles'))

// Candidate Pages (Dashboard only - no sidebar)
const CandidateDashboard = lazy(() => import('../app/candidate/Dashboard'))
const Profile = lazy(() => import('../app/candidate/Profile'))
const CandidateJobs = lazy(() => import('../app/candidate/Jobs'))
const CandidateApplications = lazy(() => import('../app/candidate/Applications'))
const CandidateDocuments = lazy(() => import('../app/candidate/Documents'))
const Payments = lazy(() => import('../app/candidate/Payments'))
const AdmitCard = lazy(() => import('../app/candidate/AdmitCard'))
const CandidateResults = lazy(() => import('../app/candidate/Results'))
const CandidateSupport = lazy(() => import('../app/candidate/Support'))
const Notifications = lazy(() => import('../app/candidate/Notifications'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/candidate-login" element={<CandidateLogin />} />
        <Route path="/auth/admin-login" element={<AdminLogin />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        
        {/* Application Flow Routes (after OTP verification) */}
        <Route path="/application/personal-details" element={<PersonalDetails />} />
        <Route path="/application/education" element={<Education />} />
        <Route path="/application/additional-info" element={<AdditionalInfo />} />
        <Route path="/application/address" element={<Address />} />
        <Route path="/application/documents" element={<ApplicationDocuments />} />
        <Route path="/application/review" element={<Review />} />
        <Route path="/application/post-selection" element={<PostSelection />} />
        <Route path="/application/payment" element={<Payment />} />
        <Route path="/application/success" element={<Success />} />
        
        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/admit-cards" element={<AdmitCards />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/payment-settings" element={<PaymentSettings />} />
        <Route path="/admin/payment-settings/razorpay" element={<RazorpayConfig />} />
        <Route path="/admin/payment-settings/add-gateway" element={<AddPaymentGateway />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/projects/create" element={<CreateProject />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/roles" element={<Roles />} />
        
        {/* Candidate Routes (Dashboard only - no application flow) */}
        <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<Profile />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
        <Route path="/candidate/documents" element={<CandidateDocuments />} />
        <Route path="/candidate/payments" element={<Payments />} />
        <Route path="/candidate/admit-card" element={<AdmitCard />} />
        <Route path="/candidate/results" element={<CandidateResults />} />
        <Route path="/candidate/support" element={<CandidateSupport />} />
        <Route path="/candidate/notifications" element={<Notifications />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes