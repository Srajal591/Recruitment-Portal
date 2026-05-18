import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  Download,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { candidateService } from "../../services/candidate.service";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawApplicationId = location.state?.applicationId;
  const transactionId = location.state?.transactionId || "—";
  const amount = location.state?.amount || 0;
  const selectedPostsFromState = location.state?.selectedPosts || [];
  const submittedAtFromState = location.state?.submittedAt;

  // Fetch application to get the human-readable applicationId
  const { data: appData, isLoading } = useQuery({
    queryKey: ["application-success", rawApplicationId],
    queryFn: () => candidateService.getApplication(rawApplicationId),
    enabled: Boolean(rawApplicationId),
    staleTime: 30000,
  });

  const app = appData?.application || appData;
  const applicationId = app?.applicationId || rawApplicationId || "—";
  const selectedPosts =
    app?.appliedPosts?.length > 0 ? app.appliedPosts : selectedPostsFromState;
  const submittedAt = app?.submittedAt || submittedAtFromState;
  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const totalAmount = app?.totalFee || amount;

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white border-b border-orange-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Recruitment Portal</div>
              <div className="text-sm text-gray-600">GOVERNMENT OF INDIA</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="ml-3 text-gray-600">
              Loading application details...
            </span>
          </div>
        ) : (
          <>
            {/* Success Banner */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-lg">
                Your application has been submitted and payment has been
                processed successfully.
              </p>
            </div>

            {/* Application Details */}
            <Card className="shadow-sm mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800">
                  Application Details
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Application ID
                      </label>
                      <div className="text-lg font-semibold text-orange-600 font-mono">
                        {applicationId}
                      </div>
                    </div>
                    {transactionId !== "—" && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Transaction ID
                        </label>
                        <div className="text-lg font-mono text-gray-800">
                          {transactionId}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Payment Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Payment Successful
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Application Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          Submitted
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {totalAmount > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Amount Paid
                        </label>
                        <div className="text-lg font-semibold text-gray-800">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Submitted On
                      </label>
                      <div className="text-lg text-gray-800">
                        {formattedDate}
                      </div>
                    </div>
                    {app?.jobId?.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Job Applied For
                        </label>
                        <div className="text-base font-medium text-gray-800">
                          {app.jobId.title}
                        </div>
                        {app.jobId.department && (
                          <div className="text-sm text-gray-500">
                            {app.jobId.department}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedPosts.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Applied Posts
                    </label>
                    <div className="space-y-2">
                      {selectedPosts.map((post, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full" />
                          <span className="text-gray-800">
                            {post.title}
                            {post.department ? ` — ${post.department}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Track Application
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Monitor your application status and updates
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => navigate("/candidate/applications")}
                  >
                    View Applications
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Stay updated with exam dates and results
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate("/candidate/notifications")}
                  >
                    View Notifications
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Download className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Dashboard
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Go to your candidate dashboard
                  </p>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate("/candidate/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Important Info */}
            <Card className="shadow-sm bg-blue-50 border-blue-200 mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Important Information
                </h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>
                    • Keep your Application ID{" "}
                    <strong className="font-mono">{applicationId}</strong> safe
                    for future reference
                  </li>
                  <li>
                    • Admit cards will be available 15 days before the
                    examination date
                  </li>
                  <li>
                    • Check your registered email and SMS for important updates
                  </li>
                  <li>
                    • Document verification will be conducted after the written
                    examination
                  </li>
                  <li>• Results will be published on the official website</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
