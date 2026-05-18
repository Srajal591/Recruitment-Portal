import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import CandidateLayout from "../../components/layouts/CandidateLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { candidateService } from "../../services/candidate.service";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: Clock },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-700",
    icon: FileText,
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-700",
    icon: AlertCircle,
  },
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const Applications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["candidate-applications", activeTab],
    queryFn: () =>
      candidateService.getMyApplications({
        status: activeTab === "all" ? undefined : activeTab,
        limit: 20,
      }),
  });

  const applications = Array.isArray(data)
    ? data
    : data?.applications || data?.data || [];
  const total =
    data?.meta?.totalItems ||
    data?.pagination?.totalItems ||
    applications.length;

  const tabs = [
    { id: "all", label: "All" },
    { id: "draft", label: "Draft" },
    { id: "submitted", label: "Submitted" },
    { id: "under_review", label: "Under Review" },
    { id: "verified", label: "Verified" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <CandidateLayout title="My Applications">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Applications
            </h1>
            <p className="text-gray-600 text-sm">{total} total applications</p>
          </div>
          <Button
            onClick={() => navigate("/jobs")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Browse Jobs
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6 text-center text-gray-500">
                Loading applications...
              </div>
            )}
            {!isLoading && applications.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No applications found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Browse available jobs and start applying
                </p>
                <Button
                  onClick={() => navigate("/jobs")}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Browse Jobs
                </Button>
              </div>
            )}
            {applications.map((app) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-orange-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {app.jobId?.title || "Job Application"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.jobId?.department || "—"}
                      </p>
                      <p className="text-xs text-orange-600 mt-0.5">
                        {app.applicationId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">
                        {app.submittedAt
                          ? `Submitted ${new Date(app.submittedAt).toLocaleDateString("en-IN")}`
                          : `Created ${new Date(app.createdAt).toLocaleDateString("en-IN")}`}
                      </p>
                    </div>
                    <Badge className={cfg.color}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {cfg.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  );
};

export default Applications;
