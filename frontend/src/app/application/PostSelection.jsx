import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import ApplicationLayout from "../../components/layouts/ApplicationLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { candidateService } from "../../services/candidate.service";

const APP_KEY = "app_draft";
const getAppId = () => {
  try {
    return JSON.parse(sessionStorage.getItem(APP_KEY) || "{}").applicationId;
  } catch {
    return null;
  }
};

const PostSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateId = location.state?.applicationId;
    if (stateId) {
      const existing = JSON.parse(sessionStorage.getItem(APP_KEY) || "{}");
      sessionStorage.setItem(
        APP_KEY,
        JSON.stringify({ ...existing, applicationId: stateId }),
      );
    }
  }, [location.state]);

  const applicationId = location.state?.applicationId || getAppId();
  const [selectedPosts, setSelectedPosts] = useState([]);

  // Load the application to get the job details
  const { data: appData, isLoading } = useQuery({
    queryKey: ["application-post-selection", applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 0,
  });

  const app = appData?.application || appData;
  const job = app?.jobId;

  // Pre-select already saved posts
  useEffect(() => {
    if (app?.appliedPosts?.length > 0 && selectedPosts.length === 0) {
      const saved = app.appliedPosts.map((p) => ({
        jobId: p.jobId || job?._id,
        postCode: p.postCode,
        title: p.title,
        department: p.department,
        fee: p.fee || 0,
      }));
      setSelectedPosts(saved);
    }
  }, [app]);

  // The job itself is the post to apply for
  const availablePosts = job
    ? [
        {
          jobId: job._id,
          postCode: job.postCode || "",
          title: job.title || "Untitled Post",
          department: job.department || "",
          vacancies: job.totalPosts,
          fee: job.applicationFee?.general || 0,
          category: job.category,
        },
      ]
    : [];

  const togglePost = (post) => {
    const exists = selectedPosts.find((p) => p.jobId === post.jobId);
    if (exists) {
      setSelectedPosts(selectedPosts.filter((p) => p.jobId !== post.jobId));
    } else {
      setSelectedPosts([...selectedPosts, post]);
    }
  };

  const totalFee = selectedPosts.reduce((sum, p) => sum + (p.fee || 0), 0);

  const { mutate: savePostSelection, isPending } = useMutation({
    mutationFn: (data) =>
      candidateService.savePostSelection(applicationId, data),
    onSuccess: (result) => {
      toast.success("Post selection saved");
      navigate("/application/payment", {
        state: {
          applicationId,
          totalFee: result?.totalFee || totalFee,
          selectedPosts,
        },
      });
    },
    onError: (err) => {
      // Global interceptor already toasts for 400s — only show field-level detail if available
      if (err?.errors?.length > 0) {
        const fieldErrors = err.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(", ");
        toast.error(`Validation: ${fieldErrors}`);
      }
    },
  });

  const handleNext = () => {
    if (!applicationId) {
      toast.error("Application not found");
      navigate("/jobs");
      return;
    }
    if (selectedPosts.length === 0) {
      toast.error("Please select at least one post");
      return;
    }
    savePostSelection({
      appliedPosts: selectedPosts.map((p) => ({
        jobId: p.jobId,
        postCode: p.postCode || "",
        title: p.title || "",
        department: p.department || "",
      })),
    });
  };

  return (
    <ApplicationLayout currentStep={7} title="Post Selection & Application Fee">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">
              Select Posts to Apply
            </h2>
            <p className="text-gray-600">
              Choose the posts you want to apply for. Application fee will be
              calculated based on your selection.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading job details...
              </div>
            )}
            {!isLoading && availablePosts.length === 0 && (
              <p className="text-gray-500 text-sm">
                No posts available for this application.
              </p>
            )}
            {availablePosts.map((post) => (
              <div
                key={post.jobId}
                onClick={() => togglePost(post)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPosts.find((p) => p.jobId === post.jobId)
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      readOnly
                      checked={Boolean(
                        selectedPosts.find((p) => p.jobId === post.jobId),
                      )}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {post.department}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {post.category && (
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                        {post.vacancies && (
                          <span className="text-xs text-gray-500">
                            Vacancies: {post.vacancies}
                          </span>
                        )}
                        {post.postCode && (
                          <span className="text-xs text-gray-500">
                            Code: {post.postCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-600">
                      ₹{(post.fee || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-500">Application Fee</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedPosts.length > 0 && (
          <Card className="shadow-sm bg-orange-50 border-orange-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">
                Fee Summary
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPosts.map((post) => (
                  <div
                    key={post.jobId}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700">{post.title}</span>
                    <span className="font-medium text-gray-800">
                      ₹{(post.fee || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Total Amount
                  </span>
                  <span className="font-bold text-orange-600 text-lg">
                    ₹{totalFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Important Instructions
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Application fee is non-refundable once payment is completed
              </li>
              <li>
                • Ensure you meet the eligibility criteria for selected posts
              </li>
              <li>
                • Fee payment must be completed within 24 hours of selection
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/application/review", { state: { applicationId } })
            }
          >
            ← Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isPending || selectedPosts.length === 0}
            className="px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Proceed to Payment →"
            )}
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default PostSelection;
