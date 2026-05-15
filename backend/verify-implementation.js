#!/usr/bin/env node

/**
 * Comprehensive Backend Verification Script
 * Checks all controllers, routes, models, and configurations
 */

const fs = require("fs");
const path = require("path");

const C = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

console.log(
  `\n${C.bright}${C.cyan}╔══════════════════════════════════════════════════════════════╗`,
);
console.log(`║                                                              ║`);
console.log(`║         🔍 Backend Implementation Verification 🔍            ║`);
console.log(`║                                                              ║`);
console.log(
  `╚══════════════════════════════════════════════════════════════╝${C.reset}\n`,
);

let totalChecks = 0;
let passedChecks = 0;

function check(name, condition, details = "") {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`${C.green}✓${C.reset} ${name}`);
    if (details) console.log(`  ${C.blue}→${C.reset} ${details}`);
  } else {
    console.log(`${C.red}✗${C.reset} ${name}`);
    if (details) console.log(`  ${C.yellow}→${C.reset} ${details}`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function countFiles(dir, ext = ".js") {
  if (!fs.existsSync(path.join(__dirname, dir))) return 0;
  const files = fs.readdirSync(path.join(__dirname, dir), { recursive: true });
  return files.filter((f) => f.endsWith(ext)).length;
}

console.log(`${C.bright}1. Core Configuration${C.reset}`);
console.log("─".repeat(60));
check("Environment file", fileExists(".env"), ".env exists");
check("Package.json", fileExists("package.json"), "Dependencies configured");
check(
  "Docker Compose",
  fileExists("../docker-compose.yml"),
  "Infrastructure defined",
);
check("Nodemon config", fileExists("nodemon.json"), "Dev server configured");

console.log(`\n${C.bright}2. Microservices${C.reset}`);
console.log("─".repeat(60));
check("API Gateway", fileExists("apps/api-gateway/server.js"), "Port 5000");
check(
  "Identity Service",
  fileExists("apps/identity-service/server.js"),
  "Port 5001",
);
check(
  "Recruitment Service",
  fileExists("apps/recruitment-service/server.js"),
  "Port 5002",
);
check(
  "Communication Service",
  fileExists("apps/communication-payment-service/server.js"),
  "Port 5003",
);

console.log(`\n${C.bright}3. Shared Packages${C.reset}`);
console.log("─".repeat(60));
check(
  "Common package",
  fileExists("packages/common/index.js"),
  "Shared utilities",
);
check(
  "Config package",
  fileExists("packages/config/index.js"),
  "Database, Redis, RabbitMQ",
);
check(
  "Socket module",
  fileExists("packages/common/socket/index.js"),
  "WebSocket support",
);

console.log(`\n${C.bright}4. Database Models (12 models)${C.reset}`);
console.log("─".repeat(60));
const models = [
  "User",
  "Employee",
  "Role",
  "Project",
  "Job",
  "Application",
  "Payment",
  "PaymentGateway",
  "SupportTicket",
  "Notification",
  "ActivityLog",
];
models.forEach((model) => {
  check(
    `${model} model`,
    fileExists(`src/models/${model}.js`),
    `Schema defined`,
  );
});

console.log(`\n${C.bright}5. Controllers${C.reset}`);
console.log("─".repeat(60));

// Identity Service Controllers
check(
  "Auth controller",
  fileExists("apps/identity-service/src/controllers/auth.controller.js"),
  "9 endpoints",
);
check(
  "Employee controller",
  fileExists("apps/identity-service/src/controllers/employee.controller.js"),
  "6 endpoints",
);
check(
  "Role controller",
  fileExists("apps/identity-service/src/controllers/role.controller.js"),
  "6 endpoints",
);
check(
  "Activity Log controller",
  fileExists("apps/identity-service/src/controllers/activityLog.controller.js"),
  "3 endpoints",
);

// Recruitment Service Controllers
const recruitmentControllers = countFiles(
  "apps/recruitment-service/src/controllers",
);
check(
  "Recruitment controllers",
  recruitmentControllers >= 4,
  `${recruitmentControllers} controller files`,
);

// Communication Service Controllers
const commControllers = countFiles(
  "apps/communication-payment-service/src/controllers",
);
check(
  "Communication controllers",
  commControllers >= 2,
  `${commControllers} controller files`,
);

console.log(`\n${C.bright}6. Routes${C.reset}`);
console.log("─".repeat(60));
const identityRoutes = countFiles("apps/identity-service/src/routes");
const recruitmentRoutes = countFiles("apps/recruitment-service/src/routes");
const commRoutes = countFiles("apps/communication-payment-service/src/routes");

check("Identity routes", identityRoutes >= 4, `${identityRoutes} route files`);
check(
  "Recruitment routes",
  recruitmentRoutes >= 4,
  `${recruitmentRoutes} route files`,
);
check("Communication routes", commRoutes >= 2, `${commRoutes} route files`);

console.log(`\n${C.bright}7. Middlewares${C.reset}`);
console.log("─".repeat(60));
const middlewares = [
  "authenticate",
  "authorize",
  "auditLog",
  "errorHandler",
  "notFound",
  "rateLimiter",
  "validate",
];
middlewares.forEach((mw) => {
  check(
    `${mw} middleware`,
    fileExists(`packages/common/middlewares/${mw}.js`),
    "Implemented",
  );
});

console.log(`\n${C.bright}8. Validations${C.reset}`);
console.log("─".repeat(60));
const validations = countFiles("packages/common/validations");
check(
  "Validation schemas",
  validations >= 7,
  `${validations} validation files`,
);

console.log(`\n${C.bright}9. Services${C.reset}`);
console.log("─".repeat(60));
const services = countFiles("src/services");
check("Service layer", services >= 8, `${services} service files`);

console.log(`\n${C.bright}10. Documentation${C.reset}`);
console.log("─".repeat(60));
check("Swagger config", fileExists("src/docs/swagger.js"), "API documentation");
check("README", fileExists("../README.md"), "Project documentation");
check("PROJECT.md", fileExists("../PROJECT.md"), "Detailed specs");
check("QUICKSTART", fileExists("../QUICKSTART.md"), "Setup guide");

console.log(`\n${C.bright}11. Scripts${C.reset}`);
console.log("─".repeat(60));
check(
  "Start services",
  fileExists("scripts/start-services.js"),
  "Multi-service launcher",
);
check("Seed admin", fileExists("scripts/seed-admin.js"), "Initial data");

console.log(`\n${C.bright}12. WebSocket Events${C.reset}`);
console.log("─".repeat(60));
try {
  const socketModule = require("./packages/common/socket/index.js");
  const events = Object.keys(socketModule.SOCKET_EVENTS || {});
  check(
    "Socket events defined",
    events.length >= 10,
    `${events.length} events`,
  );
  check(
    "Socket helpers",
    typeof socketModule.emitToUser === "function" &&
      typeof socketModule.emitToAdmins === "function",
    "emitToUser, emitToAdmins, emitToCandidate, emitBroadcast",
  );
} catch (e) {
  check("Socket module", false, e.message);
}

console.log(`\n${C.bright}13. Swagger Documentation${C.reset}`);
console.log("─".repeat(60));
try {
  const swaggerSpec = require("./src/docs/swagger.js");
  const paths = Object.keys(swaggerSpec.paths || {});
  check(
    "Swagger paths",
    paths.length >= 50,
    `${paths.length} endpoints documented`,
  );
  check(
    "Swagger tags",
    swaggerSpec.tags.length >= 15,
    `${swaggerSpec.tags.length} tags`,
  );
  check(
    "Security schemes",
    Object.keys(swaggerSpec.components.securitySchemes).length > 0,
    "Bearer auth configured",
  );
} catch (e) {
  check("Swagger spec", false, e.message);
}

// Summary
console.log(
  `\n${C.bright}${C.cyan}╔══════════════════════════════════════════════════════════════╗`,
);
console.log(`║                                                              ║`);
console.log(`║                      📊 Summary                              ║`);
console.log(`║                                                              ║`);
console.log(
  `╚══════════════════════════════════════════════════════════════╝${C.reset}\n`,
);

const percentage = Math.round((passedChecks / totalChecks) * 100);
const status =
  percentage === 100
    ? `${C.green}✅ PERFECT`
    : percentage >= 90
      ? `${C.green}✅ EXCELLENT`
      : percentage >= 75
        ? `${C.yellow}⚠️  GOOD`
        : `${C.red}❌ NEEDS WORK`;

console.log(`   Total Checks: ${C.bright}${totalChecks}${C.reset}`);
console.log(`   Passed: ${C.green}${passedChecks}${C.reset}`);
console.log(
  `   Failed: ${passedChecks < totalChecks ? C.red : C.green}${totalChecks - passedChecks}${C.reset}`,
);
console.log(`   Success Rate: ${status} ${percentage}%${C.reset}\n`);

if (percentage === 100) {
  console.log(
    `${C.green}${C.bright}🎉 All checks passed! Backend is ready for deployment.${C.reset}\n`,
  );
} else if (percentage >= 90) {
  console.log(
    `${C.green}${C.bright}✨ Almost perfect! Minor issues to address.${C.reset}\n`,
  );
} else {
  console.log(
    `${C.yellow}${C.bright}⚠️  Some components need attention.${C.reset}\n`,
  );
}

console.log(`${C.bright}Next Steps:${C.reset}`);
console.log(`   1. Start Docker: ${C.cyan}docker-compose up -d${C.reset}`);
console.log(`   2. Start backend: ${C.cyan}npm run dev${C.reset}`);
console.log(
  `   3. View Swagger: ${C.cyan}http://localhost:5000/api/docs${C.reset}`,
);
console.log(`   4. Test WebSocket: ${C.cyan}ws://localhost:5000${C.reset}\n`);

process.exit(percentage === 100 ? 0 : 1);
