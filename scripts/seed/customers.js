// script/seed/customers.js
// Seed 50 randomized customers for Surat, Gujarat, India using Sequelize bulkCreate

import db from "../../models/index.js";

const FIRST_NAMES = [
  "Rohit","Amit","Priya","Neha","Vikram","Anita","Suresh","Pooja","Kiran","Meera",
  "Raj","Nisha","Anil","Sunita","Deepak","Kavita","Manish","Ritu","Arjun","Sneha",
  "Harsh","Isha","Nitin","Payal","Vivek","Komal","Yash","Aarav","Riya","Ishaan",
  "Krishna","Dhruv","Tanya","Aakash","Divya","Gaurav","Mahesh","Karishma","Parth","Juhi",
  "Hitesh","Mansi","Sanjay","Bhavin","Jinal","Hetal","Dhara","Chirag","Jigar","Forum",
];

const LAST_NAMES = [
  "Sharma","Patel","Desai","Mehta","Joshi","Trivedi","Bhatt","Kapoor","Gupta","Verma",
  "Rao","Iyer","Mishra","Chauhan","Gandhi","Reddy","Kulkarni","Naik","Thakkar","Panchal",
  "Soni","Prajapati","Gohil","Parmar","Vyas","Tiwari","Pathak","Bose","Das","Banerjee",
  "Choudhary","Yadav","Jadeja","Solanki","Vaghela","Dabhi","Modi","Pandya","Purohit","Suthar",
  "Vora","Shah","Khatri","Brahmbhatt","Upadhyay","Zaveri","Rawal","Sengupta","Mahida","Dalal",
];

const AREAS = [
  "Adajan","Vesu","Piplod","Varachha","Katargam","Athwa","Parvat Patiya","Udhna","Pal","Rander",
  "City Light","Nanpura","Althan","Dumas Road","Sarthana","Bhatar","Ghod Dod Road","Amroli","Kapodra","Pandesara",
];

const STREETS = [
  "Ring Road","Ghod Dod Rd","Dumas Rd","Canal Rd","VIP Road","Udhna Magdalla Rd","L P Savani Rd",
  "Yogi Chowk Rd","Varachha Main Rd","Adajan Gam Rd","Pal Hazira Rd","Athwa Gate Rd","Puna Kumbharia Rd",
];

const NEARBY = [
  "City Mall","L P Savani School","VR Mall","Reliance Market","Bus Depot","Community Hall","Temple","Garden",
  "Hospital","Police Station","Fire Station","Lake","Playground","College","Metro Station","Bridge",
];

const PINCODES = [395003,395007,395009,395010,395017,395004,395006,395005,395002,394210,394221,394355];
const DOMAINS = ["example.com","mail.com","inbox.com","testmail.org","sample.net"];

// Helpers
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const chance = (p) => Math.random() < p;

function randomPhone() {
  const first = String(6 + rand(4)); // 6..9
  const rest = String(Math.floor(Math.random() * 1e9)).padStart(9, "0");
  return first + rest;
}

function randomHouse() {
  const num = 1 + rand(200);
  const suffix = chance(0.6) ? "" : String.fromCharCode(65 + rand(6)); // A-F
  return `${num}${suffix}`;
}

function randomAddressLine1() {
  return pick(STREETS);
}

function randomAddressLine2() {
  return "Near " + pick(NEARBY);
}

function randomEmail() {
  const f = pick(FIRST_NAMES).toLowerCase();
  const l = pick(LAST_NAMES).toLowerCase();
  const num = 100 + rand(900);
  const domain = pick(DOMAINS);
  return `${f}.${l}${num}@${domain}`;
}

function randomCreatedAt() {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return new Date(now - Math.random() * sevenDaysMs);
}

function randomUpdatedAt(createdAt) {
  const plus12 = 12 * 60 * 60 * 1000;
  return new Date(createdAt.getTime() + Math.random() * plus12);
}

// Optional UUID generator if your model lets you set id manually
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function seed(count = 50) {
  const Customer = db.customer || db.Customer;
  if (!Customer) throw new Error("Customer model not found (db.customer or db.Customer)");

  // If your model has underscored: true, you can keep snake_case in data.
  // If it does NOT have underscored, use camelCase attribute names below.

  const data = [];
  const seenEmails = new Set();
  const seenPhones = new Set();

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);

    let email = randomEmail();
    while (seenEmails.has(email)) email = randomEmail();
    seenEmails.add(email);

    let phone = randomPhone();
    while (seenPhones.has(phone)) phone = randomPhone();
    seenPhones.add(phone);

    const houseNumber = randomHouse();
    const addressLine1 = randomAddressLine1();
    const addressLine2 = randomAddressLine2();
    const area = pick(AREAS);
    const pincode = pick(PINCODES);
    const createdAt = randomCreatedAt();
    const updatedAt = randomUpdatedAt(createdAt);
    const isActive = true;

    // If DB auto-generates id, omit; otherwise uncomment:
    // const id = uuidv4();

    data.push({
      // id,
      firstName,          // was first_name
      lastName,           // was last_name
      phone,
      email,
      houseNumber,        // was house_number
      addressLine1,       // was address_line1
      addressLine2,       // was address_line2
      area,
      pincode,
      createdAt,          // was created_at
      updatedAt,          // was updated_at
      isActive,           // was is_active
    });
  }

  try {
    await Customer.bulkCreate(data, {
      validate: true,
      ignoreDuplicates: true, // if you have unique indexes on email/phone
      // fields: Object.keys(data[0]), // optional explicit fields
    });

    console.log(`Inserted ${data.length} customers via bulkCreate`);
  } catch (err) {
    console.error("Seed error:", err);
    throw err;
  }
}

export const seedCustomers = async (n) => {
  await seed(n ?? 50).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
};

// Allow running directly (node script/seed/customers.js)
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
