require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model("Job", jobSchema);

async function checkJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const jobs = await Job.find().select(
      "title status postCode publishedAt createdAt",
    );

    console.log(`\n📊 Total Jobs: ${jobs.length}\n`);

    if (jobs.length === 0) {
      console.log("❌ No jobs found in database!");
      console.log("💡 Create jobs from Admin Portal first.\n");
    } else {
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title}`);
        console.log(`   Post Code: ${job.postCode}`);
        console.log(`   Status: ${job.status}`);
        console.log(`   Published: ${job.publishedAt || "Not published"}`);
        console.log(`   Created: ${job.createdAt}\n`);
      });

      const draftCount = jobs.filter((j) => j.status === "draft").length;
      const activeCount = jobs.filter((j) => j.status === "active").length;

      console.log(`📈 Status Summary:`);
      console.log(`   Draft: ${draftCount}`);
      console.log(`   Active: ${activeCount}`);
      console.log(`   Other: ${jobs.length - draftCount - activeCount}\n`);

      if (draftCount > 0) {
        console.log(
          "⚠️  You have draft jobs that are NOT visible on public pages.",
        );
        console.log(
          "💡 To make them visible, publish them from Admin Portal.\n",
        );
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkJobs();
