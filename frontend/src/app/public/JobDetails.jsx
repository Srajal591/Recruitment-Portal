import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  FileBadge,
  IndianRupee,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import PublicLayout from "../../components/layouts/PublicLayout";
import Button from "../../components/ui/Button";
import { jobService } from "../../services/job.service";
import { applicationService } from "../../services/application.service";
import { useAuth, isCandidateUser } from "../../hooks/useAuth";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-job", id],
    queryFn: () => jobService.getPublicJob(id),
    enabled: Boolean(id),
  });

  const job = data?.job;

  const applyMutation = useMutation({
    mutationFn: () => applicationService.createApplication(id),
    onSuccess: (result) => {
      toast.success("Application started");
      navigate("/application/personal-details", {
        state: { applicationId: result?.application?._id, jobId: id },
      });
    },
    onError: (err) => {
      if (err.status === 409) {
        toast.error("You have already applied for this job");
        navigate("/candidate/applications");
      } else {
        toast.error(err.message || "Failed to start application");
      }
    },
  });

  const handleApply = () => {
    if (!token || !user) {
      navigate("/auth/candidate-login", { state: { jobId: id } });
      return;
    }

    if (!isCandidateUser(user)) {
      navigate("/auth/candidate-login", { state: { jobId: id } });
      return;
    }

    applyMutation.mutate();
  };
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f5efe9] px-5 lg:px-10 xl:px-14 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8c7a72] hover:text-orange-600 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          {isLoading && (
            <div className="bg-white border border-[#eadfd7] rounded-lg p-8">
              Loading job details...
            </div>
          )}

          {error && (
            <div className="bg-white border border-red-200 rounded-lg p-8 text-red-700">
              {error.message || "Unable to load this job."}
            </div>
          )}

          {job && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
              <div className="space-y-5">
                <div className="bg-white border border-[#eadfd7] rounded-[24px] p-7 shadow-sm">
                  <div className="inline-flex items-center gap-2 bg-[#ecfdf3] text-[#16a34a] border border-[#bbf7d0] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4">
                    <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
                    {job.status || "active"}
                  </div>
                  <h1 className="text-3xl lg:text-4xl leading-tight font-extrabold text-[#2d2a27] mb-3">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-[#6b625d] text-sm mb-6">
                    <Building2 className="w-4 h-4" />
                    <span>{job.department}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Info
                      icon={Briefcase}
                      label="Vacancies"
                      value={job.totalPosts || 0}
                    />
                    <Info
                      icon={Calendar}
                      label="Last Date"
                      value={
                        job.applicationDeadline
                          ? new Date(
                              job.applicationDeadline,
                            ).toLocaleDateString("en-IN")
                          : "Not announced"
                      }
                    />
                    <Info
                      icon={MapPin}
                      label="Location"
                      value={
                        job.workLocation ||
                        job.projectId?.state ||
                        "Not specified"
                      }
                    />
                    <Info
                      icon={IndianRupee}
                      label="Fee"
                      value={(
                        job.applicationFee?.general ||
                        job.applicationFee?.amount ||
                        0
                      ).toLocaleString("en-IN")}
                    />
                  </div>
                </div>

                <Section title="Job Description">
                  <p className="text-sm leading-7 text-[#5c5753] whitespace-pre-line">
                    {job.description ||
                      "Detailed job description has not been published yet."}
                  </p>
                </Section>

                <Section title="Eligibility">
                  <div className="space-y-3 text-sm text-[#5c5753]">
                    <p>
                      <strong>Category:</strong>{" "}
                      {job.category || "All eligible categories"}
                    </p>
                    <p>
                      <strong>Salary:</strong>{" "}
                      {job.salaryRange?.min || job.salaryRange?.max
                        ? `${job.salaryRange?.min || ""} - ${job.salaryRange?.max || ""}`
                        : "As per rules"}
                    </p>
                    <p>
                      <strong>Education:</strong>{" "}
                      {job.education?.essential?.degree ||
                        job.education?.minimumQualification ||
                        "See official notification"}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {job.experience?.required
                        ? `${job.experience?.years || 0}+ years`
                        : "Not mandatory unless specified"}
                    </p>
                  </div>
                </Section>

                <Section title="Required Documents">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(job.requiredDocuments?.length
                      ? job.requiredDocuments
                      : [
                          "Passport photo",
                          "Signature",
                          "Educational certificates",
                          "Identity proof",
                        ]
                    ).map((document) => (
                      <div
                        key={
                          typeof document === "string"
                            ? document
                            : document.type
                        }
                        className="flex items-center gap-3 bg-[#faf7f4] border border-[#ede3dc] rounded-lg p-4"
                      >
                        <FileBadge className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-[#4b4744]">
                          {typeof document === "string"
                            ? document
                            : document.label || document.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              <aside className="space-y-5">
                <div className="bg-white border border-[#eadfd7] rounded-[24px] overflow-hidden shadow-sm">
                  <div className="bg-[#f97316] px-5 py-4">
                    <h2 className="font-bold text-white text-[15px]">
                      Application Status
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      {job.isApplicationOpen === false
                        ? "Applications closed"
                        : "Applications open"}
                    </div>
                    <Button
                      onClick={handleApply}
                      disabled={
                        applyMutation.isPending ||
                        job.isApplicationOpen === false
                      }
                      className="w-full h-[50px] bg-[#f97316] hover:bg-orange-600"
                    >
                      {applyMutation.isPending ? "Starting..." : "Apply Now"}
                    </Button>
                    <p className="text-xs text-[#9d918b] leading-5 text-center">
                      Candidate login is required before starting an
                      application.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl px-5 py-4">
    <div className="text-[10px] uppercase font-bold tracking-wide text-[#9d8f88] mb-2">
      {label}
    </div>
    <div className="flex items-center gap-2 text-sm font-bold text-[#2e2e2e]">
      <Icon className="w-4 h-4 text-orange-500" />
      {value}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-[24px] border border-[#eadfd7] overflow-hidden shadow-sm">
    <div className="px-6 py-5 bg-[#f8efea]">
      <h2 className="font-bold text-[#3b2e2a] text-[15px]">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

export default JobDetails;
