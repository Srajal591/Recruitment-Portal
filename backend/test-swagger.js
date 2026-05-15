#!/usr/bin/env node

/**
 * Quick test to verify Swagger spec generation
 */

const swaggerSpec = require("./src/docs/swagger");

console.log("\n🔍 Swagger Specification Test\n");
console.log("═".repeat(60));

console.log("\n📊 API Info:");
console.log(`   Title: ${swaggerSpec.info.title}`);
console.log(`   Version: ${swaggerSpec.info.version}`);

console.log("\n🏷️  Tags (${swaggerSpec.tags.length}):");
swaggerSpec.tags.forEach((tag, i) => {
  console.log(`   ${i + 1}. ${tag.name} - ${tag.description}`);
});

console.log("\n🔐 Security Schemes:");
Object.keys(swaggerSpec.components.securitySchemes).forEach((scheme) => {
  console.log(`   ✓ ${scheme}`);
});

console.log("\n📝 Schemas:");
Object.keys(swaggerSpec.components.schemas).forEach((schema) => {
  console.log(`   ✓ ${schema}`);
});

console.log("\n🛣️  API Paths:");
const paths = Object.keys(swaggerSpec.paths || {});
if (paths.length > 0) {
  console.log(`   Total endpoints documented: ${paths.length}`);
  paths.slice(0, 10).forEach((path) => {
    const methods = Object.keys(swaggerSpec.paths[path]).filter(
      (m) => m !== "parameters",
    );
    console.log(`   ${methods.map((m) => m.toUpperCase()).join(", ")} ${path}`);
  });
  if (paths.length > 10) {
    console.log(`   ... and ${paths.length - 10} more`);
  }
} else {
  console.log(
    "   ⚠️  No paths found - controllers may not have @swagger annotations",
  );
}

console.log("\n═".repeat(60));
console.log("✅ Swagger spec generated successfully!\n");
console.log("📖 View full docs at: http://localhost:5002/api/docs\n");
