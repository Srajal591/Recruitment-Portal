const swaggerJsdoc = require("swagger-jsdoc");
const env = require("../../packages/config/env");

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
Connect to \`ws://localhost:${env.PORT}\` with \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: "API Support",
        email: "support@recruitment.gov.in",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.RECRUITMENT_SERVICE_PORT || 5002}`,
        description: "Recruitment Service (Swagger hosted here)",
      },
      {
        url: `http://localhost:${env.PORT}`,
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
      { name: "Auth", description: "Authentication & authorization" },
      { name: "Public", description: "Public endpoints (no auth required)" },
      { name: "Candidate", description: "Candidate portal endpoints" },
      {
        name: "Candidate - Applications",
        description: "Candidate application management",
      },
      { name: "Candidate - Support", description: "Candidate support tickets" },
      {
        name: "Candidate - Notifications",
        description: "Candidate notifications",
      },
      {
        name: "Candidate - Payments",
        description: "Candidate payment history",
      },
      { name: "Application", description: "Multi-step application flow" },
      { name: "Admin - Dashboard", description: "Admin dashboard & analytics" },
      {
        name: "Admin - Projects",
        description: "Recruitment project management",
      },
      { name: "Admin - Jobs", description: "Job posting management" },
      {
        name: "Admin - Applications",
        description: "Application review & management",
      },
      { name: "Admin - Employees", description: "Employee management" },
      { name: "Admin - Roles", description: "Role & permission management" },
      { name: "Admin - Support", description: "Support ticket management" },
      {
        name: "Admin - Payments",
        description: "Payment management & gateways",
      },
      { name: "Admin - Activity Logs", description: "Audit & activity logs" },
      { name: "Notifications", description: "In-app notifications" },
    ],
  },
  // Scan all route and controller files for JSDoc @swagger annotations
  apis: [
    "./src/routes/**/*.js",
    "./src/controllers/**/*.js",
    "./src/docs/schemas/*.js",
    // Identity Service
    "./apps/identity-service/src/controllers/**/*.js",
    "./apps/identity-service/src/routes/**/*.js",
    // Recruitment Service
    "./apps/recruitment-service/src/controllers/**/*.js",
    "./apps/recruitment-service/src/routes/**/*.js",
    // Communication & Payment Service
    "./apps/communication-payment-service/src/controllers/**/*.js",
    "./apps/communication-payment-service/src/routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
