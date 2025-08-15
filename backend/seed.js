require("dotenv").config();
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Job = require("./models/Job");
const bcrypt = require("bcryptjs");

connectDB();

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await Admin.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword
      });

      console.log("✅ Admin user seeded");
    } else {
      console.log("⚠️ Admin already exists, skipping");
    }
  } catch (error) {
    console.error(error);
  }
};

const seedJobs = async () => {
  try {
    const jobs = [
      {
        title: "Frontend Developer",
        company: "Tech Solutions",
        category: "IT",
        location: "Mumbai",
        salary: "₹50,000/month",
        skills: ["React", "JavaScript", "CSS"],
        lastDateToApply: "2025-09-30",
        description: "We are looking for a React developer to build amazing web apps.",
        applyLink: "https://techsolutions.com/job/frontend"
      },
      {
        title: "Sales Manager",
        company: "SalesCorp",
        category: "Sales",
        location: "Delhi",
        salary: "₹60,000/month",
        skills: ["Communication", "Negotiation"],
        lastDateToApply: "2025-09-25",
        description: "Lead our sales team and increase company revenue.",
        applyLink: "https://salescorp.com/job/salesmanager"
      }
    ];

    await Job.deleteMany(); // optional: clears old jobs
    await Job.insertMany(jobs);

    console.log("✅ Jobs seeded");
  } catch (error) {
    console.error(error);
  }
};

// Run both seeds inside an async function
const runSeeds = async () => {
  await seedAdmin();
  await seedJobs();
  process.exit();
};

runSeeds();
