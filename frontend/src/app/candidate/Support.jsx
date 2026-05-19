import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Plus, Eye, Loader2, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import CandidateLayout from "../../components/layouts/CandidateLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { candidateService } from "../../services/candidate.service";

const STATUS_COLORS = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
};

const PRIORITY_COLORS = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

// Must match backend enum exactly
const CATEGORIES = [
  "Technical",
  "Payment",
  "General",
  "Document",
  "Application",
];

const Support = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "General",
    description: "",
    priority: "Medium",
  });
  const [formErrors, setFormErrors] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["candidate-tickets"],
    queryFn: () => candidateService.getMyTickets({ limit: 50 }),
  });

  // Backend returns tickets directly or nested
  const tickets = Array.isArray(data)
    ? data
    : data?.tickets || data?.data || [];

  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: (payload) => candidateService.createTicket(payload),
    onSuccess: () => {
      toast.success("Support ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["candidate-tickets"] });
      setShowCreate(false);
      setForm({
        title: "",
        category: "General",
        description: "",
        priority: "Medium",
      });
      setFormErrors({});
    },
    onError: (err) => toast.error(err.message || "Failed to create ticket"),
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Subject is required";
    if (!form.description.trim()) e.description = "Description is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createTicket({
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      priority: form.priority,
    });
  };

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "In Progress",
  ).length;
  const resolvedCount = tickets.filter((t) =>
    ["Resolved", "Closed"].includes(t.status),
  ).length;

  return (
    <CandidateLayout title="Support Center">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            <p className="text-gray-600 text-sm">
              Raise and track your support tickets
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Open", value: openCount, color: "border-l-red-500" },
            {
              label: "In Progress",
              value: inProgressCount,
              color: "border-l-yellow-500",
            },
            {
              label: "Resolved",
              value: resolvedCount,
              color: "border-l-green-500",
            },
          ].map((s) => (
            <Card key={s.label} className={`border-l-4 ${s.color}`}>
              <div className="p-4">
                <p className="text-xs text-gray-500 font-medium uppercase">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {s.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Ticket Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Create Support Ticket
                </h3>
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.title ? "border-red-400" : "border-gray-300"}`}
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.priority}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, priority: e.target.value }))
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe your issue in detail. Include any error messages, application IDs, or transaction IDs if relevant."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${formErrors.description ? "border-red-400" : "border-gray-300"}`}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreate(false);
                    setFormErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">
              My Tickets ({tickets.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6 text-center text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading tickets...
              </div>
            )}
            {!isLoading && tickets.length === 0 && (
              <div className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No support tickets yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Create a ticket if you need help with your application
                </p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Ticket
                </Button>
              </div>
            )}
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/candidate/support/${ticket._id}`)}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-orange-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-orange-600">
                        {ticket.ticketId}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {ticket.category}
                      </span>
                      {ticket.replies?.length > 0 && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.replies.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
                        : ""}
                    </p>
                  </div>
                  <Badge
                    className={
                      PRIORITY_COLORS[ticket.priority] ||
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge
                    className={
                      STATUS_COLORS[ticket.status] ||
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {ticket.status}
                  </Badge>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Help Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Tips for faster resolution
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Include your Application ID or Transaction ID in the
                description
              </li>
              <li>
                • Select the correct category for faster routing to the right
                team
              </li>
              <li>
                • Mark as High/Critical only for urgent payment or submission
                issues
              </li>
              <li>
                • Check your notifications for replies from our support team
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  );
};

export default Support;
