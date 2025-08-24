// scripts/seedJobs.js
// Seed jobs with randomized technician assignment, customer linkage, and scheduled times.
// - assignedTo: random user from user table (you can filter to technicians if you have ROLE)
// - customerId: random customer; service address copied from customer fields
// - scheduledAt: random date/time within last 7 days between 07:30 and 21:00
// - category/status/priority: randomized from enums
//
// Usage:
//   node scripts/seedJobs.js            # default 50 jobs
//   JOB_COUNT=200 node scripts/seedJobs.js
//
// Notes:
// - Ensure your database connection is configured and models/index.js exports initialized models.
// - If you only want technicians as assignees, filter users by role === 'TECHNICIAN' below.

import "dotenv/config.js";
import { randomUUID } from "crypto";
import db from "../../models/index.js";
import { CATEGORY, JOB_PRIORITY, JOB_STATUS } from "../../utils/enums.js";

// ---------- helpers ----------
function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  // inclusive min, inclusive max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a Date within last 7 days at a time window between 07:30 and 21:00
function randomScheduledAt() {
  // last 7 days
  const now = new Date();
  const daysBack = randomInt(0, 6); // 0..6 days ago
  const base = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysBack,
    0,
    0,
    0,
    0
  );

  // time window: 07:30 to 21:00
  const startMinutes = 7 * 60 + 30; // 07:30
  const endMinutes = 21 * 60; // 21:00
  const minutes = randomInt(startMinutes, endMinutes);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  base.setHours(hours, mins, 0, 0);
  return base;
}

function randomTitle(category) {
  const byCat = {
    AC: [
      "AC not cooling",
      "AC noisy operation",
      "AC installation",
      "AC gas refill",
    ],
    FRIDGE: [
      "Fridge not cooling",
      "Fridge water leakage",
      "Fridge thermostat issue",
      "Door seal replacement",
    ],
    WASHING_MACHINE: [
      "Washer not spinning",
      "Washer vibration",
      "Drainage issue",
      "Belt replacement",
    ],
  };
  const pool = byCat[category] || ["General service", "Maintenance task"];
  return pickRandom(pool);
}

function randomDescription(category) {
  const byCat = {
    AC: [
      "Customer reports insufficient cooling after 2 hours of operation.",
      "Vibration noise during startup. Inspect fan and bearings.",
      "Install new split AC unit. Verify refrigerant lines and power.",
      "Check for refrigerant leak and recharge as needed.",
    ],
    FRIDGE: [
      "Cooling not adequate on top shelf. Check airflow.",
      "Water pooling beneath unit. Inspect drain and line.",
      "Temperature fluctuates. Verify thermostat and sensors.",
      "Seal damaged, causing frost. Replace door gasket.",
    ],
    WASHING_MACHINE: [
      "Drum not spinning during cycle. Inspect motor and belt.",
      "Excessive vibration on spin. Rebalance and check shock absorbers.",
      "Water not draining fully. Inspect pump and filter.",
      "Belt worn out. Replace and test cycle.",
    ],
  };
  const pool = byCat[category] || [
    "General inspection and service required.",
    "Perform diagnostic and provide repair estimate.",
  ];
  return pickRandom(pool);
}

// ---------- main ----------
async function seed(n) {
  const JOB_COUNT = Number(n);

  try {
    // Ensure associations are set
    if (typeof db.sequelize?.authenticate === "function") {
      await db.sequelize.authenticate();
    }

    // Load users and customers
    const users = await db.User.findAll({
      attributes: ["id", "name", "email", "role"],
      raw: true,
    });

    const customers = await db.Customer.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "addressLine1",
        "addressLine2",
        "area",
        "pincode",
      ],
      raw: true,
    });

    if (!users.length) {
      throw new Error("No users found. Seed users first.");
    }
    if (!customers.length) {
      throw new Error("No customers found. Seed customers first.");
    }

    // Optional: filter to technicians only if you have ROLE enum with TECHNICIAN
    // const technicianUsers = users.filter(u => u.role === 'TECHNICIAN');
    // const assigneePool = technicianUsers.length ? technicianUsers : users;
    const assigneePool = users;

    const categories = Object.values(CATEGORY);
    const statuses = Object.values(JOB_STATUS);
    const priorities = Object.values(JOB_PRIORITY);

    const jobsPayload = [];

    // Choose createdBy/updatedBy as any user (e.g., admin) — here random for realism
    const chooseActor = () => pickRandom(users);

    for (let i = 0; i < JOB_COUNT; i++) {
      const assigned = pickRandom(assigneePool);
      const customer = pickRandom(customers);
      const category = pickRandom(categories) || categories[0] || "AC";
      const scheduledAt = randomScheduledAt();
      const status = pickRandom(statuses) || JOB_STATUS.APPROVED;
      const priority = pickRandom(priorities) || JOB_PRIORITY.LOW;

      const title = randomTitle(category);
      const description = randomDescription(category);

      const creator = chooseActor();
      const updater = chooseActor();

      jobsPayload.push({
        // id: randomUUID(), // let DB/Sequelize default handle UUID
        category,
        customerId: customer.id,
        assignedTo: assigned.id,

        title,
        description,

        status,
        priority,
        isActive: true,

        scheduledAt,

        // Autofill service address from customer
        serviceAddressLine1: customer.addressLine1 || null,
        serviceAddressLine2: customer.addressLine2 || null,
        serviceArea: customer.area || null,
        servicePincode: customer.pincode || null,

        createdBy: creator.id,
        updatedBy: updater.id,

        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert in chunks to avoid parameter limits (optional)
    const CHUNK = 500;
    for (let i = 0; i < jobsPayload.length; i += CHUNK) {
      const slice = jobsPayload.slice(i, i + CHUNK);
      await db.Job.bulkCreate(slice, { ignoreDuplicates: true });
    }

    console.log(`Seeded ${jobsPayload.length} jobs successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("seedJobs error:", err);
    process.exit(1);
  }
}

export const seedJobs = async (n) => {
  seed(n);
};
