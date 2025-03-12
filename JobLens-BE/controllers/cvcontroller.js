const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const JobApplication = require("../models/applicationModel");
const { uploadToFirebase } = require("../services/firebaseService");

// Multer config - store files in memory
const upload = multer({ storage: multer.memoryStorage() });

const uploadCV = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: "CV file is required" });

        // Define paths
        const tempFilePath = path.join(__dirname, "../uploads", file.originalname);
        const pythonScriptPath = path.resolve("../../cvExtractor/main.py"); // Using resolve to ensure correct path

        // Save file to disk
        fs.writeFileSync(tempFilePath, file.buffer);
        console.log("Saved file to:", tempFilePath);
        console.log("Executing Python script at:", pythonScriptPath);

        // Detect Python version
        const pythonCommand = process.platform === "win32" ? "python" : "python3";

        // Upload CV to Firebase and get the URL
        const cvURL = await uploadToFirebase(file);
        console.log("Uploaded CV to Firebase:", cvURL);

        // Execute Python script and pass the file path and Firebase URL
        exec(`${pythonCommand} "${pythonScriptPath}" "${tempFilePath}" "${cvURL}"`, async (error, stdout, stderr) => {
            console.log(" Python Execution Started...");

            if (error) {
                console.error(` Error executing Python script: ${error.message}`);
                return res.status(500).json({ message: "Error extracting CV data", error: error.message });
            }
            if (stderr) {
                console.error(` Python script error: ${stderr}`);
                return res.status(500).json({ message: "Error extracting CV data", error: stderr });
            }

            // Save application details to MySQL
            try {
                await JobApplication.create({ name, email, phone, cv_url: cvURL });
                console.log("Saved application details to MySQL");
            } catch (dbError) {
                console.error("Database Error:", dbError);
                return res.status(500).json({ message: "Error saving application data", error: dbError.message });
            }

            // Delete the temporary file after processing
            fs.unlinkSync(tempFilePath);

            res.status(200).json({
                message: "Application Submitted!",
                cv_url: cvURL
            });
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ message: "Error processing application", error: error.message });
    }
};

module.exports = { upload, uploadCV };
