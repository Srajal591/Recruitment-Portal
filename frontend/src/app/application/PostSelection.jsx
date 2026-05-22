import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
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
  const applicationId = location.state?.applicationId || getAppId();
  const [selectedPosts, setSelectedPosts] = useState([]);

  useEffect(() => {
    if (location.state?.applicationId) {
      const existing = JSON.parse(sessionStorage.getItem(APP_KEY) || "{}");
      sessionStorage.setItem(
        APP_KEY,
        JSON.stringify({ ...existing, applicationId: location.state.applicationId }),
      );
    }
  }, [location.state]);

  const { data: appData, isLoading } = useQuery({
    queryKey: ["application-post-selection", applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 0,
  });

  const app = appData?.application || appData;
  const job = app?.jobId;

  const availablePosts = useMemo(() => {
    if (!job) return [];
    if (job.posts?.length) {
      return job.posts
        .filter((post) => post.status !== "inactive")
        .map((post) => ({
          postId: post._id,
          jobId: job._id,
          postCode: post.postCode || "",
          title: post.title || post.designation,
          designation: post.designation || post.title,
          department: post.department || job.department || "",
          vacancies: post.vacancies || 0,
          payLevel: post.payLevel || "",
          location: post.location || job.workLocation || "",
        }));
    }

    return [
      {
        postId: job._id,
        jobId: job._id,
        postCode: job.postCode || "",
        title: job.title || "Untitled Post",
        designation: job.title || "Untitled Post",
        department: job.department || "",
        vacancies: job.totalPosts || 0,
        payLevel: "",
        location: job.workLocation || "",
      },
    ];
  }, [job]);

  useEffect(() => {
    if (app?.appliedPosts?.length > 0 && selectedPosts.length === 0) {
      setSelectedPosts(
        [...app.appliedPosts]
          .sort((a, b) => (a.preference || 0) - (b.preference || 0))
          .map((post, index) => ({
            postId: post.postId || post.jobId,
            jobId: post.jobId || job?._id,
            postCode: post.postCode || "",
            title: post.title || post.designation,
            designation: post.designation || post.title,
            department: post.department || "",
            vacancies: post.vacancies || 0,
            preference: post.preference || index + 1,
          })),
      );
    }
  }, [app, job, selectedPosts.length]);

  const applicationFee =
    job?.applicationFee?.general || job?.paymentConfig?.applicationFee || 0;

  const isSelected = (postId) =>
    selectedPosts.some((post) => post.postId === postId);

  const normalizePreferences = (posts) =>
    posts.map((post, index) => ({ ...post, preference: index + 1 }));

  const togglePost = (post) => {
    if (isSelected(post.postId)) {
      setSelectedPosts((current) =>
        normalizePreferences(current.filter((item) => item.postId !== post.postId)),
      );
    } else {
      setSelectedPosts((current) =>
        normalizePreferences([...current, { ...post, preference: current.length + 1 }]),
      );
    }
  };

  const movePost = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedPosts.length) return;
    setSelectedPosts((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return normalizePreferences(next);
    });
  };

  const { mutate: savePostSelection, isPending } = useMutation({
    mutationFn: (data) => candidateService.savePostSelection(applicationId, data),
    onSuccess: (result) => {
      toast.success("Post preferences saved");
      navigate("/application/payment", {
        state: {
          applicationId,
          totalFee: result?.totalFee || applicationFee,
          selectedPosts,
        },
      });
    },
    onError: (err) => {
      if (err?.errors?.length > 0) {
        toast.error(
          err.errors.map((e) => `${e.field}: ${e.message}`).join(", "),
        );
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
      toast.error("Please select at least one post preference");
      return;
    }

    savePostSelection({
      appliedPosts: selectedPosts.map((post, index) => ({
        jobId: job._id,
        postId: post.postId,
        postCode: post.postCode || "",
        title: post.title || post.designation || "",
        designation: post.designation || post.title || "",
        department: post.department || "",
        vacancies: post.vacancies || 0,
        preference: index + 1,
      })),
    });
  };

  return (
    <ApplicationLayout currentStep={7} title="Post Preference Selection">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">
              Select Post Preferences
            </h2>
            <p className="text-gray-600">
              Select the designations you want to apply for and arrange them in
              your preference order. Preference 1 is considered first.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading posts...
              </div>
            )}

            {!isLoading && availablePosts.length === 0 && (
              <p className="text-gray-500 text-sm">
                No posts are available for this application.
              </p>
            )}

            {availablePosts.map((post) => (
              <button
                type="button"
                key={post.postId}
                onClick={() => togglePost(post)}
                className={`w-full text-left border rounded-lg p-4 transition-all ${
                  isSelected(post.postId)
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      readOnly
                      checked={isSelected(post.postId)}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {post.designation}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{post.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {post.postCode && (
                          <Badge variant="outline" className="text-xs">
                            {post.postCode}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          Vacancies: {post.vacancies}
                        </span>
                        {post.payLevel && (
                          <span className="text-xs text-gray-500">
                            Pay: {post.payLevel}
                          </span>
                        )}
                        {post.location && (
                          <span className="text-xs text-gray-500">
                            {post.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected(post.postId) && (
                    <div className="rounded-full bg-orange-600 text-white text-xs font-bold px-3 py-1">
                      Preference{" "}
                      {selectedPosts.find((item) => item.postId === post.postId)
                        ?.preference}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedPosts.length > 0 && (
          <Card className="shadow-sm bg-orange-50 border-orange-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">
                Preference Order
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPosts.map((post, index) => (
                  <div
                    key={post.postId}
                    className="flex items-center justify-between gap-3 bg-white border border-orange-100 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {index + 1}. {post.designation}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.postCode || "No code"} • {post.vacancies} vacancies
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => movePost(index, -1)}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === selectedPosts.length - 1}
                        onClick={() => movePost(index, 1)}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Application Fee
                  </span>
                  <span className="font-bold text-orange-600 text-lg">
                    ₹{applicationFee.toLocaleString("en-IN")}
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
              <li>• Preference order cannot be changed after final payment.</li>
              <li>• You must meet eligibility for every selected designation.</li>
              <li>• Application fee is charged once for this recruitment.</li>
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
