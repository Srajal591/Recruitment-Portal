import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Lock,
  User,
  GraduationCap,
  FileText,
  MapPin,
  Upload,
  Eye,
  CreditCard,
  ListChecks,
  CheckCheck,
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    name: "Personal Details",
    icon: User,
    path: "/application/personal-details",
  },
  {
    id: 2,
    name: "Educational Info",
    icon: GraduationCap,
    path: "/application/education",
  },
  {
    id: 3,
    name: "Additional Information",
    icon: FileText,
    path: "/application/additional-info",
  },
  {
    id: 4,
    name: "Address Details",
    icon: MapPin,
    path: "/application/address",
  },
  {
    id: 5,
    name: "Document Upload",
    icon: Upload,
    path: "/application/documents",
  },
  { id: 6, name: "Review", icon: Eye, path: "/application/review" },
  {
    id: 7,
    name: "Post Selection",
    icon: ListChecks,
    path: "/application/post-selection",
  },
  { id: 8, name: "Payment", icon: CreditCard, path: "/application/payment" },
  { id: 9, name: "Submit", icon: CheckCheck, path: "/application/success" },
];

const ApplicationLayout = ({ children, currentStep = 1, title, jobTitle }) => {
  const navigate = useNavigate();

  // A step is accessible only if it has been reached (currentStep >= step.id)
  // OR it's the current step. Future steps are locked.
  const canAccess = (stepId) => stepId <= currentStep;

  const handleStepClick = (step) => {
    if (!canAccess(step.id)) return; // locked — do nothing
    // Get applicationId from sessionStorage
    const draft = JSON.parse(sessionStorage.getItem("app_draft") || "{}");
    navigate(step.path, {
      state: { applicationId: draft.applicationId, jobId: draft.jobId },
    });
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Recruitment Portal</div>
              <div className="text-sm text-gray-600">GOVERNMENT OF INDIA</div>
            </div>
          </button>
          <div className="text-sm text-gray-600">
            Step{" "}
            <span className="font-semibold text-orange-600">{currentStep}</span>{" "}
            of 9
          </div>
        </div>
      </header>

      {/* Top progress bar — visual only, no navigation */}
      <div className="bg-white border-b border-orange-200 px-6 py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center min-w-max">
            {STEPS.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isLocked = step.id > currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                        isCompleted
                          ? "bg-orange-600 border-orange-600 text-white"
                          : isActive
                            ? "bg-orange-600 border-orange-600 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-xs font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="ml-2 hidden lg:block">
                      <div
                        className={`text-xs font-medium whitespace-nowrap ${
                          isLocked ? "text-gray-400" : "text-orange-600"
                        }`}
                      >
                        {step.name}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-2 flex-shrink-0 ${
                        isCompleted ? "bg-orange-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 p-5 flex-shrink-0 hidden lg:block">
          <div className="bg-gray-800 rounded-xl shadow-lg h-fit sticky top-6">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-white font-semibold text-sm">
                Application Steps
              </h2>
              <p className="text-gray-400 text-xs mt-1 truncate">
                {jobTitle || "Application Form"}
              </p>
            </div>

            <nav className="p-3 space-y-0.5">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLocked = step.id > currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(step)}
                    disabled={isLocked}
                    title={
                      isLocked ? "Complete previous steps first" : step.name
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isCompleted
                          ? "text-green-400 hover:bg-gray-700 cursor-pointer"
                          : "text-gray-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">
                      {step.name}
                    </span>
                    {isCompleted && (
                      <span className="ml-auto text-xs text-green-500 flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Progress */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span className="text-orange-400 font-semibold">
                  Step {currentStep}/9
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 9) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {currentStep < 9
                  ? `${9 - currentStep} step${9 - currentStep !== 1 ? "s" : ""} remaining`
                  : "All steps completed!"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {title && (
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  {title}
                </h1>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ApplicationLayout;
