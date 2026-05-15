const swaggerJsdoc = require("swagger-jsdoc");

const PORT = parseInt(process.env.COMMUNICATION_SERVICE_PORT) || 5003;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Communication & Payment Service API",
      version: "1.0.0",
      description: `
## Communication & Payment Service

Handles notifications, support tickets, payment processing, and payment gateway management.

### Authentication
- Use **Bearer token** in the Authorization header: \`Authorization: Bearer <access_token>\`
- Get tokens from authentication service

### Features
- Real-time notifications
- Support ticket management
- Payment processing & refunds
- Payment gateway configuration
- RabbitMQ message queue integration
      `,
      contact: {
        name: "API Support",
        email: "support@recruitment.gov.in",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Communication & Payment Service",
      },
      {
        url: "http://localhost:5000",
        description: "API Gateway",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            statusCode: { type: "integer" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "integer" },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      {
        name: "Candidate - Notifications",
        description: "Candidate notifications",
      },
      { name: "Candidate - Support", description: "Candidate support tickets" },
      {
        name: "Candidate - Payments",
        description: "Candidate payment management",
      },
      { name: "Admin - Support", description: "Support ticket management" },
      { name: "Admin - Payments", description: "Payment management" },
      {
        name: "Admin - Payment Gateways",
        description: "Payment gateway configuration",
      },
    ],
  },
  apis: ["./src/controllers/**/*.js", "./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
