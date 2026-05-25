import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CreditCard,
  Smartphone,
  Building,
  Shield,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  IndianRupee,
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

const METHODS = [
  {
    id: "upi",
    name: "UPI Payment",
    icon: Smartphone,
    desc: "PhonePe, Google Pay, Paytm, BHIM",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard, RuPay accepted",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: Building,
    desc: "All major banks supported",
  },
];

const CATEGORY_LABELS = {
  general: "General",
  obc: "OBC",
  sc: "SC",
  st: "ST",
  ews: "EWS",
  pwd: "PwD",
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateId = location.state?.applicationId;
    if (stateId) {
      const ex = JSON.parse(sessionStorage.getItem(APP_KEY) || "{}");
      sessionStorage.setItem(
        APP_KEY,
        JSON.stringify({ ...ex, applicationId: stateId }),
      );
    }
  }, [location.state]);

  const applicationId = location.state?.applicationId || getAppId();
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      toast.error("No application found");
      navigate("/candidate/applications");
    }
  }, [applicationId, navigate]);

  const { data: appData, isLoading } = useQuery({
    queryKey: ["application-payment", applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 0,
  });

  const application = appData?.application || appData;

  // Fee comes from app.totalFee — calculated by backend based on the application personal details category
  const totalFee = application?.totalFee ?? 0;
  const processingFee = totalFee > 0 ? Math.round(totalFee * 0.02) : 0;
  const grandTotal = totalFee + processingFee;
  const candidateCategory = application?.personalDetails?.category || "";

  const handlePay = async () => {
    if (method === "upi" && !upiId.trim()) {
      toast.error("Enter your UPI ID");
      return;
    }
    if (method === "netbanking" && !bank) {
      toast.error("Select your bank");
      return;
    }
    if (
      method === "card" &&
      (!card.number || !card.expiry || !card.cvv || !card.name)
    ) {
      toast.error("Fill all card details");
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const transactionId = `TXN${Date.now()}`;
      const draft = JSON.parse(sessionStorage.getItem(APP_KEY) || "{}");
      await candidateService.finalizeApplication(
        applicationId,
        transactionId,
        draft.declaration || "",
      );
      sessionStorage.removeItem(APP_KEY);
      toast.success("Payment successful! Application submitted.");
      navigate("/application/success", {
        state: {
          applicationId,
          paymentSuccess: true,
          amount: grandTotal,
          transactionId,
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading)
    return (
      <ApplicationLayout currentStep={8} title="Payment">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </ApplicationLayout>
    );

  if (!application && !isLoading)
    return (
      <ApplicationLayout currentStep={8} title="Payment">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Application not found</p>
            <Button onClick={() => navigate("/candidate/applications")}>
              Go to Applications
            </Button>
          </CardContent>
        </Card>
      </ApplicationLayout>
    );

  return (
    <ApplicationLayout currentStep={8} title="Payment Gateway">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Methods */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">
                  Select Payment Method
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${method === m.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}
                    >
                      <input
                        type="radio"
                        readOnly
                        checked={method === m.id}
                        className="w-4 h-4 text-orange-600"
                      />
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === m.id ? "bg-orange-100" : "bg-gray-100"}`}
                      >
                        <Icon
                          className={`w-5 h-5 ${method === m.id ? "text-orange-600" : "text-gray-500"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{m.name}</p>
                        <p className="text-sm text-gray-500">{m.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {method === "upi" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-800">UPI ID</h3>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    placeholder="yourname@paytm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </CardContent>
              </Card>
            )}

            {method === "card" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-800">Card Details</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    value={card.number}
                    onChange={(e) =>
                      setCard((c) => ({
                        ...c,
                        number: e.target.value
                          .replace(/\D/g, "")
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard((c) => ({ ...c, expiry: e.target.value }))
                      }
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          cvv: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on card"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={card.name}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, name: e.target.value }))
                    }
                  />
                </CardContent>
              </Card>
            )}

            {method === "netbanking" && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-800">Select Bank</h3>
                </CardHeader>
                <CardContent>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                  >
                    <option value="">Choose your bank</option>
                    {[
                      "State Bank of India",
                      "HDFC Bank",
                      "ICICI Bank",
                      "Axis Bank",
                      "Punjab National Bank",
                      "Bank of Baroda",
                      "Canara Bank",
                      "Kotak Mahindra Bank",
                    ].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Summary */}
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Payment Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category fee info */}
                {candidateCategory && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-orange-700">
                        Fee for{" "}
                        <strong>
                          {CATEGORY_LABELS[candidateCategory] ||
                            candidateCategory.toUpperCase()}
                        </strong>{" "}
                        category
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-medium">
                      ₹{totalFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee (2%)</span>
                    <span className="font-medium">
                      ₹{processingFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-orange-600 text-lg">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {application?.applicationId && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Application ID</p>
                    <p className="text-xs font-mono font-semibold text-gray-800">
                      {application.applicationId}
                    </p>
                  </div>
                )}

                {totalFee === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">
                      No fee for your category
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-xs text-green-700 font-medium">
                  SSL Encrypted · PCI-DSS Compliant
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            disabled={processing}
            onClick={() =>
              navigate("/application/post-selection", {
                state: { applicationId },
              })
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handlePay}
            disabled={processing}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : grandTotal === 0 ? (
              "Submit Application (Free)"
            ) : (
              `Pay ₹${grandTotal.toLocaleString("en-IN")}`
            )}
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Payment;
