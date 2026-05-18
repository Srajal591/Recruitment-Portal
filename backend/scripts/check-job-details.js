require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model("Job", jobSchema);

async function checkJobDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const jobs = await Job.find({ status: "active" }).select(
      "title postCode applicationDeadline applicationStartDate totalPosts department",
    );

    console.log(`📊 Active Jobs: ${jobs.length}\n`);

    const now = new Date();

    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Post Code: ${job.postCode}`);
      console.log(`   Department: ${job.department || "Not set"}`);
      console.log(`   Total Posts: ${job.totalPosts || 0}`);
      console.log(`   Start Date: ${job.applicationStartDate || "Not set"}`);
      console.log(`   Deadline: ${job.applicationDeadline || "Not set"}`);

      if (job.applicationDeadline) {
        const deadline = new Date(job.applicationDeadline);
        const isPast = deadline < now;
        console.log(`   Status: ${isPast ? "❌ EXPIRED" : "✅ OPEN"}`);
        if (!isPast) {
          const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          console.log(`   Days Left: ${daysLeft}`);
        }
      } else {
        console.log(`   Status: ⚠️  NO DEADLINE SET`);
      }
      console.log("");
    });

    const openJobs = jobs.filter(
      (j) => !j.applicationDeadline || new Date(j.applicationDeadline) >= now,
    );
    console.log(`\n✅ Jobs visible on public pages: ${openJobs.length}`);

    if (openJobs.length === 0) {
      console.log("\n⚠️  No jobs will be visible because:");
      console.log("   - All jobs have expired deadlines, OR");
      console.log("   - Jobs need application deadline to be set\n");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkJobDetails();
