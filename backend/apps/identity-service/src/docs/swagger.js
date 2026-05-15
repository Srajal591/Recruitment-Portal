const swaggerJsdoc = require("swagger-jsdoc");

const PORT = parseInt(process.env.IDENTITY_SERVICE_PORT) || 5001;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Identity Service API",
      version: "1.0.0",
      description: `
## Identity & Access Management Service

Handles authentication, authorization, employee management, and role-based access control.

### Authentication
- Use **Bearer token** in the Authorization header: \`Authorization: Bearer <access_token>\`
- Get tokens from \`POST /api/auth/admin/login\` or \`POST /api/auth/candidate/login\`

### Features
- Admin & Candidate authentication
- Employee management
- Role & permission management
- Activity logging & audit trails
      `,
      contact: {
        name: "API Support",
        email: "support@recruitment.gov.in",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Identity Service",
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
      { name: "Auth", description: "Authentication & authorization" },
      { name: "Admin - Employees", description: "Employee management" },
      { name: "Admin - Roles", description: "Role & permission management" },
      { name: "Admin - Activity Logs", description: "Audit & activity logs" },
    ],
  },
  apis: ["./src/controllers/**/*.js", "./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
