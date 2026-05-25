import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Eye,
  RefreshCw,
} from "lucide-react";
import ApplicationLayout from "../../components/layouts/ApplicationLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { candidateService } from "../../services/candidate.service";

const APP_KEY = "app_draft";
const getAppId = () => {
  try {
    return JSON.parse(sessionStorage.getItem(APP_KEY) || "{}").applicationId;
  } catch {
    return null;
  }
};

const DOC_TYPES = [
  {
    id: "passport_photo",
    name: "Passport Photo",
    description: "JPEG/JPG only, Max 100KB",
    required: true,
    accept: "image/jpeg,image/jpg",
    maxKB: 100,
  },
  {
    id: "signature",
    name: "Signature",
    description: "JPEG/JPG, scanned on white background",
    required: true,
    accept: "image/jpeg,image/jpg",
    maxKB: 100,
  },
  {
    id: "tenth_certificate",
    name: "10th Certificate",
    description: "PDF/JPG, Max 500KB",
    required: true,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "twelfth_certificate",
    name: "12th Certificate",
    description: "PDF/JPG, Max 500KB",
    required: true,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "graduation_certificate",
    name: "Graduation Certificate",
    description: "PDF/JPG, Max 500KB",
    required: false,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "category_certificate",
    name: "Category Certificate",
    description: "PDF/JPG, Max 500KB",
    required: false,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "aadhar_card",
    name: "Aadhar Card (ID Proof)",
    description: "PDF/JPG, Max 500KB",
    required: true,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "driving_license",
    name: "Driving License",
    description: "PDF/JPG, Max 500KB",
    required: false,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "computer_certificate",
    name: "Computer Certificate",
    description: "PDF/JPG, Max 500KB",
    required: false,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
  {
    id: "domicile_certificate",
    name: "Bihar Domicile Certificate",
    description: "PDF/JPG, Max 500KB",
    required: false,
    accept: "application/pdf,image/jpeg,image/jpg",
    maxKB: 500,
  },
];

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRefs = useRef({});

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

  const applicationId = getAppId();
  const [uploading, setUploading] = useState({}); // { docId: true/false }
  const [uploadedDocs, setUploadedDocs] = useState({}); // { docId: { url, name } }

  // Load existing uploaded documents
  const {
    data: appData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["application-documents", applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 0,
  });

  useEffect(() => {
    if (appData) {
      const app = appData?.application || appData;
      const docs = app?.documents || [];
      const map = {};
      docs.forEach((doc) => {
        if (doc.status === "uploaded") {
          map[doc.type] = {
            url: doc.cloudinaryUrl,
            name: doc.originalName,
            sizeKB: doc.sizeKB,
          };
        }
      });
      setUploadedDocs(map);
    }
  }, [appData]);

  const handleFileSelect = async (docType, file) => {
    if (!file) return;
    const docConfig = DOC_TYPES.find((d) => d.id === docType);
    if (!docConfig) return;

    // Validate size
    const sizeKB = file.size / 1024;
    if (sizeKB > docConfig.maxKB) {
      toast.error(
        `File too large. Max size is ${docConfig.maxKB}KB. Your file is ${Math.round(sizeKB)}KB.`,
      );
      return;
    }

    setUploading((prev) => ({ ...prev, [docType]: true }));
    try {
      await candidateService.uploadDocument(applicationId, docType, file);
      toast.success(`${docConfig.name} uploaded successfully`);
      // Refresh to get updated doc list
      const result = await refetch();
      const app = result.data?.application || result.data;
      const docs = app?.documents || [];
      const map = { ...uploadedDocs };
      docs.forEach((doc) => {
        if (doc.status === "uploaded") {
          map[doc.type] = {
            url: doc.cloudinaryUrl,
            name: doc.originalName,
            sizeKB: doc.sizeKB,
          };
        }
      });
      setUploadedDocs(map);
    } catch (err) {
      toast.error(err.message || `Failed to upload ${docConfig.name}`);
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
      // Reset file input
      if (fileInputRefs.current[docType]) {
        fileInputRefs.current[docType].value = "";
      }
    }
  };

  const handleNext = () => {
    if (!applicationId) {
      toast.error("Application not found");
      navigate("/jobs");
      return;
    }
    // Check required docs
    const missingRequired = DOC_TYPES.filter(
      (d) => d.required && !uploadedDocs[d.id],
    );
    if (missingRequired.length > 0) {
      toast.error(
        `Please upload required documents: ${missingRequired.map((d) => d.name).join(", ")}`,
      );
      return;
    }
    // If editing from Review, go back to Review
    if (location.state?.returnToReview) {
      navigate("/application/review", { state: { applicationId } });
    } else {
      navigate("/application/review", { state: { applicationId } });
    }
  };

  const uploadedCount = Object.keys(uploadedDocs).length;
  const requiredCount = DOC_TYPES.filter((d) => d.required).length;
  const uploadedRequiredCount = DOC_TYPES.filter(
    (d) => d.required && uploadedDocs[d.id],
  ).length;

  return (
    <ApplicationLayout currentStep={5} title="Document Upload">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Document Upload
                </h2>
                <p className="text-gray-600">
                  Upload all required documents to proceed.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {uploadedRequiredCount}/{requiredCount} required uploaded
                </div>
                <div className="text-xs text-gray-500">
                  {uploadedCount} total uploaded
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${requiredCount > 0 ? (uploadedRequiredCount / requiredCount) * 100 : 0}%`,
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading uploaded documents...</span>
              </div>
            )}

            {DOC_TYPES.map((doc) => {
              const isUploaded = Boolean(uploadedDocs[doc.id]);
              const isUploadingNow = uploading[doc.id];
              const uploadedInfo = uploadedDocs[doc.id];

              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    isUploaded
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Status Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isUploaded
                          ? "bg-green-100"
                          : isUploadingNow
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                      }`}
                    >
                      {isUploaded ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isUploadingNow ? (
                        <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">
                          {doc.name}
                        </h4>
                        {doc.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                      {isUploaded && uploadedInfo && (
                        <p className="text-xs text-green-600 mt-0.5">
                          ✓ {uploadedInfo.name} ({uploadedInfo.sizeKB}KB)
                        </p>
                      )}
                      {isUploadingNow && (
                        <p className="text-xs text-yellow-600 mt-0.5">
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept={doc.accept}
                      ref={(el) => (fileInputRefs.current[doc.id] = el)}
                      onChange={(e) =>
                        handleFileSelect(doc.id, e.target.files[0])
                      }
                      className="hidden"
                    />

                    {isUploaded && uploadedInfo?.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => {
                          // Open the actual uploaded file URL
                          const url = uploadedInfo.url;
                          if (url)
                            window.open(url, "_blank", "noopener,noreferrer");
                          else toast.error("File URL not available");
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}

                    <Button
                      size="sm"
                      disabled={isUploadingNow}
                      className={
                        isUploaded
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                    >
                      {isUploadingNow ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Uploading
                        </>
                      ) : isUploaded ? (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Replace
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 mr-1" />
                          Select File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Important Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">
                    Important Note
                  </h4>
                  <p className="text-sm text-orange-700">
                    Ensure all documents are clearly legible. Scanned copies
                    should be in high resolution. Failure to provide valid
                    documents will result in immediate rejection of your
                    application.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/application/address", { state: { applicationId } })
            }
          >
            ← Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!applicationId}
            className="px-6 bg-orange-600 hover:bg-orange-700"
          >
            Save & Continue →
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Documents;
