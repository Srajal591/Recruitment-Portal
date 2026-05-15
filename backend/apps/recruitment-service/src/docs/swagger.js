const swaggerJsdoc = require("swagger-jsdoc");

const PORT = parseInt(process.env.RECRUITMENT_SERVICE_PORT) || 5002;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Government Recruitment Portal API",
      version: "1.0.0",
      description: `
## Government Recruitment & Examination Management Portal

Enterprise-level REST API for managing government recruitment workflows.

### Authentication
- Use **Bearer token** in the Authorization header: \`Authorization: Bearer <access_token>\`
- Get tokens from \`POST /api/auth/login\`
- Refresh tokens via \`POST /api/auth/refresh-token\`

### Roles
| Role | Description |
|------|-------------|
| \`admin\` | Main admin — full access |
| \`employee\` | Sub-role created by admin — permission-based access |
| \`candidate\` | Registered candidate |

### WebSocket Events
Connect to \`ws://localhost:5000\` with \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: "API Support",
        email: "support@recruitment.gov.in",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Recruitment Service (Swagger hosted here)",
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
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPages: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      {
        name: "Auth",
        description: "Authentication & authorization (Identity Service)",
      },
      { name: "Public", description: "Public endpoints (no auth required)" },
      {
        name: "Candidate - Applications",
        description: "Candidate application management (Recruitment Service)",
      },
      {
        name: "Candidate - Notifications",
        description: "Candidate notifications (Communication Service)",
      },
      {
        name: "Candidate - Support",
        description: "Candidate support tickets (Communication Service)",
      },
      {
        name: "Candidate - Payments",
        description: "Candidate payment management (Communication Service)",
      },
      {
        name: "Admin - Dashboard",
        description: "Admin dashboard & analytics (Recruitment Service)",
      },
      {
        name: "Admin - Projects",
        description: "Recruitment project management (Recruitment Service)",
      },
      {
        name: "Admin - Jobs",
        description: "Job posting management (Recruitment Service)",
      },
      {
        name: "Admin - Applications",
        description: "Application review & management (Recruitment Service)",
      },
      {
        name: "Admin - Employees",
        description: "Employee management (Identity Service)",
      },
      {
        name: "Admin - Roles",
        description: "Role & permission management (Identity Service)",
      },
      {
        name: "Admin - Support",
        description: "Support ticket management (Communication Service)",
      },
      {
        name: "Admin - Activity Logs",
        description: "Audit & activity logs (Identity Service)",
      },
      {
        name: "Admin - Payments",
        description: "Payment management (Communication Service)",
      },
      {
        name: "Admin - Payment Gateways",
        description: "Payment gateway configuration (Communication Service)",
      },
    ],
  },
  // Scan all controller files across all microservices
  apis: [
    "./src/controllers/**/*.js",
    "./src/routes/**/*.js",
    "../identity-service/src/controllers/**/*.js",
    "../identity-service/src/routes/**/*.js",
    "../communication-payment-service/src/controllers/**/*.js",
    "../communication-payment-service/src/routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
