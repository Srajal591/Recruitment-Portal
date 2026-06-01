const { z } = require("zod");

const createTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  category: z.enum([
    "Technical",
    "Payment",
    "General",
    "Document",
    "Application",
  ]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  linkedApplicationId: z.string().optional(),
  transactionId: z.string().optional(),
  attachments: z.array(z.string().url()).max(5).optional(),
});

const updateTicketSchema = z.object({
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]).optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  assignedTo: z.string().optional(),
});

const addReplySchema = z.object({
  message: z.string().min(1, "Reply message is required").max(2000),
});

const ticketActionSchema = z.object({
  note: z.string().max(1000).optional(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  addReplySchema,
  ticketActionSchema,
};
