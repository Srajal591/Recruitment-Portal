import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ApplicationLayout from "../../components/layouts/ApplicationLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  CreditCard,
  Smartphone,
  Building,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { candidateService } from "../../services/candidate.service";

const APP_KEY = "app_draft";
const getAppId = () => {
  try {
    return JSON.parse(sessionStorage.getItem(APP_KEY) || "{}").applicationId;
  } catch {
    return null;
  }
};

const Payment = () => {
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
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const { data: appData, isLoading } = useQuery({
    queryKey: ["application-payment", applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 0,
  });

  const application = appData?.application || appData;

  useEffect(() => {
    if (!applicationId) {
      toast.error("No application found");
      navigate("/candidate/applications");
    }
  }, [applicationId, navigate]);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay accepted",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "PhonePe, Google Pay, Paytm, BHIM",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building,
      description: "All major banks supported",
    },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing (actual gateway will be integrated by admin)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionId = `TXN${Date.now()}`;

      // Read declaration saved from Review step
      const draft = JSON.parse(sessionStorage.getItem(APP_KEY) || "{}");
      const declaration = draft.declaration || "";

      // Finalize the application — marks as submitted + payment paid
      await candidateService.finalizeApplication(
        applicationId,
        transactionId,
        declaration,
      );

      // Clear session storage after successful payment
      sessionStorage.removeItem(APP_KEY);

      toast.success("Payment successful! Application submitted.");
      navigate("/application/success", {
        state: {
          applicationId,
          paymentSuccess: true,
          amount: grandTotal,
          transactionId,
          selectedPosts:
            location.state?.selectedPosts || application?.appliedPosts || [],
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="ml-3 text-gray-600">Loading payment details...</span>
        </div>
      </ApplicationLayout>
    );
  }

  if (!application && !isLoading) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Application not found</p>
            <Button
              onClick={() => navigate("/candidate/applications")}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              Go to Applications
            </Button>
          </CardContent>
        </Card>
      </ApplicationLayout>
    );
  }

  const totalFee = application?.totalFee || location.state?.totalFee || 0;
  const processingFee = Math.round(totalFee * 0.02);
  const grandTotal = totalFee + processingFee;

  return (
    <ApplicationLayout currentStep={8} title="Payment Gateway">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800">
                  Select Payment Method
                </h2>
                <p className="text-gray-600">
                  Choose your preferred payment method to complete the
                  application
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          readOnly
                          checked={selectedMethod === method.id}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Payment Gateway Note */}
            <Card className="shadow-sm bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1">
                      Payment Gateway Integration
                    </p>
                    <p className="text-sm text-blue-700">
                      The actual payment gateway will be integrated by the
                      admin. For now, clicking "Pay" will simulate a successful
                      payment and complete your application.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">
                  Payment Summary
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      Application Fee
                    </span>
                    <span className="font-medium text-gray-800">
                      ₹{totalFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      Processing Fee (2%)
                    </span>
                    <span className="font-medium text-gray-800">
                      ₹{processingFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        Total Amount
                      </span>
                      <span className="font-bold text-orange-600 text-lg">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {application?.applicationId && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p className="font-medium mb-1">Application ID:</p>
                    <p className="text-xs font-mono break-all">
                      {application.applicationId}
                    </p>
                  </div>
                )}

                {/* Applied Posts */}
                {(application?.appliedPosts?.length > 0 ||
                  location.state?.selectedPosts?.length > 0) && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Applied For:
                    </p>
                    {(
                      application?.appliedPosts ||
                      location.state?.selectedPosts ||
                      []
                    ).map((post, i) => (
                      <p key={i} className="text-xs text-gray-700">
                        • {post.title}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="shadow-sm bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Secure Payment
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We use
                  industry-standard SSL encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Secure payment gateway</span>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/application/post-selection", {
                  state: { applicationId },
                })
              }
              className="px-6"
              disabled={processing}
            >
              ← Back
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="px-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : grandTotal > 0 ? (
                <>Pay ₹{grandTotal.toLocaleString("en-IN")}</>
              ) : (
                <>Submit Application (Free)</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Payment;
