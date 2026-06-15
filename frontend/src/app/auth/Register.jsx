import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
import heroBg from "../../assets/herobg.jpg";
import CustomSelect from "../../components/ui/CustomSelect";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

const SIDE_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&q=80&fit=crop";

const FEATURES = [
  "Secure Application Tracking",
  "Real-Time Application Updates",
  "Document & Payment Management",
  "Government Recruitment Opportunities",
];

const STATS = [
  { value: "150+", label: "Active Recruitments" },
  { value: "500K+", label: "Apps Processed" },
  { value: "99.9%", label: "Secure Platform" },
];

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
    {children}
  </label>
);

const inputCls =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white placeholder-gray-400";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    registeredMobile: "",
    dateOfBirth: "",
    gender: "",
    state: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!formData.fullName.trim()) { setError("Full name is required"); return; }
    if (!formData.dateOfBirth)    { setError("Date of birth is required"); return; }
    if (!formData.gender)         { setError("Gender is required"); return; }
    setIsLoading(true);
    try {
      await authService.register(formData);
      toast.success("Registration successful. Please verify OTP.");
      navigate("/auth/verify-otp", {
        state: { email: formData.email, registeredMobile: formData.registeredMobile },
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pwd = formData.password;
  const checks = {
    length:    pwd.length >= 8,
    number:    /\d/.test(pwd),
    uppercase: /[A-Z]/.test(pwd),
    special:   /[^A-Za-z0-9]/.test(pwd),
  };

  return (
    /* Full-page bg — min-h-screen + pb so content never shows black below */
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay covers everything */}
      <div className="fixed inset-0 bg-black/55 pointer-events-none" />

      {/* Scrollable center content */}
      <div className="relative z-10 flex flex-col items-center justify-start py-10 px-4 min-h-screen">

        {/* ── Floating card ── */}
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex bg-white">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex lg:w-[42%] flex-col bg-[#fdf8f2] p-10 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm">RP</span>
              </div>
              <div>
                <p className="text-orange-600 font-black text-sm leading-tight">Recruitment Portal</p>
                <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Government of India</p>
              </div>
            </Link>

            <h2 className="text-[28px] font-black text-gray-900 leading-snug mb-3">
              Build Your Future.<br />Apply with<br />Confidence.
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Create your account to apply for recruitment opportunities, track
              application progress, manage documents, receive notifications, and
              access recruitment updates.
            </p>

            <ul className="space-y-2.5 mb-7">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="rounded-xl overflow-hidden mb-7 border border-gray-100">
              <img
                src={SIDE_IMAGE}
                alt="Candidate"
                className="w-full h-40 object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

            <div className="flex gap-6">
              {STATS.map((s) => (
                <div key={s.value}>
                  <p className="text-orange-500 font-black text-base leading-none">{s.value}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Orange top stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-400 shrink-0" />

            <div className="flex-1 px-8 py-8">
              {/* Mobile logo */}
              <Link to="/" className="flex items-center gap-2 mb-5 lg:hidden">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">RP</span>
                </div>
                <p className="font-bold text-gray-800 text-sm">Recruitment Portal</p>
              </Link>

              <h1 className="text-2xl font-black text-gray-900 mb-0.5">Create Your Account</h1>
              <p className="text-xs text-gray-400 mb-6">Start your application journey in minutes.</p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name */}
                <div>
                  <Label>Full Name <span className="text-red-500">*</span></Label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>Email Address <span className="text-red-500">*</span></Label>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputCls}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">OTP will be sent to this email</p>
                </div>

                {/* Mobile */}
                <div>
                  <Label>Registered Mobile <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 font-semibold shrink-0">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      placeholder="98765 43210"
                      value={formData.registeredMobile}
                      onChange={(e) => handleChange("registeredMobile", e.target.value)}
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">10-digit mobile number</p>
                </div>

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <input
                      type="date"
                      required
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                        .toISOString().split("T")[0]}
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <Label>Gender <span className="text-red-500">*</span></Label>
                    <CustomSelect
                      value={formData.gender}
                      onChange={(val) => handleChange("gender", val)}
                      options={[
                        { value: "", label: "Select Gender" },
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ]}
                      placeholder="Select Gender"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <Label>State <span className="text-red-500">*</span></Label>
                  <CustomSelect
                    value={formData.state}
                    onChange={(val) => handleChange("state", val)}
                    options={[{ value: "", label: "Select your state" }, ...STATES.map(s => ({ value: s, label: s }))]}
                    placeholder="Select your state"
                    error={false}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>Password <span className="text-red-500">*</span></Label>                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwd && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                      {[
                        { ok: checks.length,    label: "8+ characters" },
                        { ok: checks.uppercase, label: "One uppercase letter" },
                        { ok: checks.number,    label: "One number" },
                        { ok: checks.special,   label: "Special character" },
                      ].map(({ ok, label }) => (
                        <span key={label} className={`flex items-center gap-1 text-[10px] font-medium ${ok ? "text-emerald-600" : "text-gray-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-emerald-500" : "bg-gray-300"}`} />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-orange-500 hover:underline font-semibold">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-orange-500 hover:underline font-semibold">Privacy Policy</Link>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    <span className="text-xs text-gray-500">Receive recruitment updates via Email, SMS, and WhatsApp.</span>
                  </label>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account &amp; Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/auth/candidate-login" className="text-orange-500 font-semibold hover:text-orange-600">
                    Sign In
                  </Link>
                </p>

                <div className="rounded-lg bg-orange-50 border border-orange-100 px-4 py-3 flex items-start gap-2">
                  <span className="text-orange-400 shrink-0 mt-0.5">ℹ</span>
                  <p className="text-[11px] text-orange-700 leading-relaxed">
                    You can complete your profile and application details after creating your account.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Trust badges — OUTSIDE card, below it */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 pb-4">
          {[
            { icon: "🏛️", title: "Official Portal",     sub: "Government of India"  },
            { icon: "🔒", title: "256-bit Encryption", sub: "Bank-level security"   },
            { icon: "🛡️", title: "Privacy First",      sub: "Your data is protected" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-2 text-white/85">
              <span className="text-xl leading-none">{b.icon}</span>
              <div>
                <p className="text-xs font-bold leading-tight">{b.title}</p>
                <p className="text-[10px] opacity-70">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Register;
