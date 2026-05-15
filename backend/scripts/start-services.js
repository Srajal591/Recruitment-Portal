#!/usr/bin/env node

/**
 * Recruitment Portal — Microservices Startup Script
 * Run: npm run dev
 *
 * Starts all 4 services with colored, labeled output.
 * Graceful shutdown on Ctrl+C.
 */

const { spawn } = require("child_process");
const net = require("net");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// ── ANSI colors ───────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// ── Service definitions ───────────────────────────────────────
const SERVICES = [
  {
    name: "API Gateway",
    short: "GATEWAY ",
    dir: path.join(__dirname, "../apps/api-gateway"),
    color: C.cyan,
    icon: "🌐",
    port: parseInt(process.env.API_GATEWAY_PORT) || 5000,
  },
  {
    name: "Identity Service",
    short: "IDENTITY",
    dir: path.join(__dirname, "../apps/identity-service"),
    color: C.green,
    icon: "🔐",
    port: parseInt(process.env.IDENTITY_SERVICE_PORT) || 5001,
  },
  {
    name: "Recruitment Service",
    short: "RECRUIT ",
    dir: path.join(__dirname, "../apps/recruitment-service"),
    color: C.blue,
    icon: "📋",
    port: parseInt(process.env.RECRUITMENT_SERVICE_PORT) || 5002,
  },
  {
    name: "Comm & Payment",
    short: "COMM    ",
    dir: path.join(__dirname, "../apps/communication-payment-service"),
    color: C.magenta,
    icon: "💬",
    port: parseInt(process.env.COMMUNICATION_SERVICE_PORT) || 5003,
  },
];

const processes = [];

// ── Helpers ───────────────────────────────────────────────────
const ts = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const label = (svc, isErr = false) =>
  `${C.dim}[${ts()}]${C.reset} ${isErr ? C.red : svc.color}${C.bright}[${svc.short}]${C.reset}`;

const log = (svc, msg) => console.log(`${label(svc)} ${msg}`);
const err = (svc, msg) =>
  console.error(`${label(svc, true)} ${C.red}${msg}${C.reset}`);

// ── Check if a port is in use (non-blocking, pure Node) ───────
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (e) => resolve(e.code === "EADDRINUSE"));
    server.once("listening", () => server.close(() => resolve(false)));
    server.listen(port, "127.0.0.1");
  });
}

// ── Banner ────────────────────────────────────────────────────
function printBanner() {
  console.clear();
  console.log(`
${C.bright}${C.cyan}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀  Government Recruitment Portal — Microservices  🚀     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝${C.reset}
`);
}

// ── Check all ports before starting ──────────────────────────
async function checkPorts() {
  const busy = [];
  for (const svc of SERVICES) {
    const inUse = await isPortInUse(svc.port);
    if (inUse) busy.push(svc);
  }

  if (busy.length > 0) {
    console.log(
      `${C.red}${C.bright}❌ The following ports are already in use:${C.reset}`,
    );
    busy.forEach((svc) =>
      console.log(
        `   ${svc.color}${svc.icon} ${svc.name}${C.reset} → port ${C.bright}${svc.port}${C.reset}`,
      ),
    );
    console.log(`
${C.yellow}Fix: Run this command to free the ports, then try again:${C.reset}
${C.bright}   npm run kill-ports${C.reset}
`);
    process.exit(1);
  }
}

// ── Start a single service ────────────────────────────────────
function startService(svc) {
  return new Promise((resolve) => {
    log(svc, `Starting on port ${C.bright}${svc.port}${C.reset}...`);

    const proc = spawn("node", ["server.js"], {
      cwd: svc.dir,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    processes.push({ name: svc.name, proc });

    proc.stdout.on("data", (data) => {
      data
        .toString()
        .trim()
        .split("\n")
        .forEach((line) => {
          if (line.trim()) log(svc, line);
        });
    });

    proc.stderr.on("data", (data) => {
      data
        .toString()
        .trim()
        .split("\n")
        .forEach((line) => {
          if (!line.trim()) return;
          if (
            line.includes("ExperimentalWarning") ||
            line.includes("DeprecationWarning")
          )
            return;
          err(svc, line);
        });
    });

    proc.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        err(svc, `❌ Process exited with code ${code}`);
      }
    });

    proc.on("error", (e) => {
      err(svc, `❌ Failed to start: ${e.message}`);
      resolve();
    });

    // Give each service 2.5s to boot before starting the next
    setTimeout(resolve, 2500);
  });
}

// ── Print summary ─────────────────────────────────────────────
function printSummary() {
  console.log(`
${C.bright}${C.green}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           ✅  All Services Started Successfully  ✅           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝${C.reset}

${C.bright}📍 Service URLs:${C.reset}
   ${C.cyan}🌐 API Gateway:${C.reset}          http://localhost:${SERVICES[0].port}
   ${C.green}🔐 Identity Service:${C.reset}     http://localhost:${SERVICES[1].port}
   ${C.blue}📋 Recruitment Service:${C.reset}  http://localhost:${SERVICES[2].port}
   ${C.magenta}💬 Comm & Payment:${C.reset}       http://localhost:${SERVICES[3].port}

${C.bright}📚 Documentation:${C.reset}
   ${C.bright}Swagger UI:${C.reset}   http://localhost:${SERVICES[2].port}/api/docs
   ${C.bright}Health:${C.reset}       http://localhost:${SERVICES[0].port}/health

${C.bright}🔌 WebSocket:${C.reset}    ws://localhost:${SERVICES[0].port}

${C.yellow}Press Ctrl+C to stop all services${C.reset}
`);
}

// ── Graceful shutdown ─────────────────────────────────────────
function shutdown(signal) {
  console.log(
    `\n${C.yellow}[${signal}] Shutting down all services...${C.reset}`,
  );
  processes.forEach(({ name, proc }) => {
    console.log(`${C.dim}  Stopping ${name}...${C.reset}`);
    try {
      proc.kill("SIGTERM");
    } catch (_) {}
  });
  setTimeout(() => {
    console.log(`${C.green}✅ All services stopped.${C.reset}\n`);
    process.exit(0);
  }, 2000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (e) => {
  console.error(`${C.red}❌ Uncaught Exception:${C.reset}`, e.message);
  shutdown("ERROR");
});

// ── Main ──────────────────────────────────────────────────────
(async () => {
  printBanner();

  // Check ports first — exit early with clear message if busy
  await checkPorts();

  // Start all services sequentially
  for (const svc of SERVICES) {
    await startService(svc);
  }

  printSummary();
})();
