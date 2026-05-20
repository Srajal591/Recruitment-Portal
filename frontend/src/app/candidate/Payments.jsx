import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  IndianRupee,
  Loader2,
  Receipt,
} from "lucide-react";
import CandidateLayout from "../../components/layouts/CandidateLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { candidateService } from "../../services/candidate.service";

const STATUS_CONFIG = {
  paid: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Paid",
  },
  success: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Success",
  },
  failed: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Failed" },
  pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    label: "Pending",
  },
  refunded: {
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
    label: "Refunded",
  },
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const Payments = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["candidate-payments"],
    queryFn: () => candidateService.getMyPayments({ limit: 50 }),
  });

  // API returns payments array directly or nested
  const payments = Array.isArray(data)
    ? data
    : data?.payments || data?.data || [];

  const totalPaid = payments
    .filter((p) => p.status === "paid" || p.status === "success")
    .reduce((sum, p) => sum + (p.amount || p.totalFee || 0), 0);

  const successCount = payments.filter(
    (p) => p.status === "paid" || p.status === "success",
  ).length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <CandidateLayout title="Payment History">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            All your application fee transactions
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Total Paid
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalPaid.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {successCount} successful transaction
                {successCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {payments.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-600" />
              Transactions
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading payments...
              </div>
            )}

            {!isLoading && payments.length === 0 && (
              <div className="p-10 text-center">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No payment records yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Payments will appear here after you complete an application
                </p>
                <Button
                  onClick={() => navigate("/candidate/jobs")}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {payments.map((payment, i) => {
              const cfg =
                STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const amount = payment.amount || payment.totalFee || 0;

              return (
                <div
                  key={payment._id || i}
                  className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-orange-50 transition-colors"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        cfg.color.includes("green")
                          ? "bg-green-100"
                          : cfg.color.includes("red")
                            ? "bg-red-100"
                            : cfg.color.includes("yellow")
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                      }`}
                    >
                      <StatusIcon
                        className={`w-5 h-5 ${
                          cfg.color.includes("green")
                            ? "text-green-600"
                            : cfg.color.includes("red")
                              ? "text-red-600"
                              : cfg.color.includes("yellow")
                                ? "text-yellow-600"
                                : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {payment.applicationId?.jobId?.title ||
                          payment.jobTitle ||
                          "Application Fee"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {(payment.transactionId || payment._id) && (
                          <p className="text-xs font-mono text-gray-400 truncate max-w-[180px]">
                            {payment.transactionId || payment._id}
                          </p>
                        )}
                        {payment.gateway && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                            {payment.gateway}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(payment.createdAt || payment.paidAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-base">
                        ₹{amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Badge className={`${cfg.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Info note */}
        {payments.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Payment Policy</p>
                <p className="text-blue-700 text-xs mt-0.5">
                  Application fees are non-refundable once payment is processed.
                  For payment disputes, raise a support ticket.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CandidateLayout>
  );
};

export default Payments;
