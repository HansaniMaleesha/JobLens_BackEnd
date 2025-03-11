const cron = require("node-cron");
const { sendEmail } = require("../services/emailService");
const db = require("../services/db");

const checkApplicationsAndSendEmails = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

    try {
        // Query using async/await
        const [rows] = await db.query(
            "SELECT email FROM jobapplications WHERE DATE(createdAt) = ?",
            [formattedDate]
        );

        if (rows.length > 0) {
            for (const row of rows) {
                await sendEmail(row.email);
                console.log(`✅ Email sent to ${row.email}`);
            }
        } else {
            console.log("ℹ️ No job applications from yesterday.");
        }
    } catch (error) {
        console.error("❌ Error fetching applications or sending emails:", error);
    }
};

// Schedule the job at 10:30 AM daily
cron.schedule("0 8 * * *", () => {
    console.log("⏳ Checking job applications and sending emails...");
    checkApplicationsAndSendEmails();
});

console.log("✅ Job scheduled to run at 10:30 AM daily.");
