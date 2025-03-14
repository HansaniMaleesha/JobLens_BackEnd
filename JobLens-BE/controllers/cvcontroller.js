const axios = require('axios');
const FormData = require('form-data');
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

        // Log file details for debugging
        console.log('File:', file);  // Log the file object (check if it exists)
        console.log('File Buffer Length:', file.buffer ? file.buffer.length : 0);  // Check if buffer is valid
        console.log('File Name:', file.originalname);  // Check the file name

        // Define paths
        const tempFilePath = path.join(__dirname, "../uploads", Date.now() + "-" + file.originalname);

        // Save file to disk
        fs.writeFileSync(tempFilePath, file.buffer);
        console.log("Saved file to:", tempFilePath);

        // Upload CV to Firebase and get the URL
        const cvURL = await uploadToFirebase(file);
        console.log("Uploaded CV to Firebase:", cvURL);

        // Log the Firebase URL to ensure it's valid
        console.log('cvLink:', cvURL);

        // Create FormData to send to Python backend
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname); // Appending file
        formData.append('cv_link', cvURL); // Appending the Firebase URL

        // Log headers and FormData before sending
        console.log('Request Headers:', formData.getHeaders());

        // Make HTTP request to Python backend
        const pythonApiUrl = 'https://cvpipeline-python-production.up.railway.app/process_cv'; // Adjust this URL

        const response = await axios.post(pythonApiUrl, formData, {
            headers: formData.getHeaders(),
        });

        // Check response from Python API
        console.log('Response from Python API:', response.data);

        if (response.data.message === "CV processed successfully") {
            // Save application details to MySQL
            try {
                await JobApplication.create({ name, email, phone, cv_url: cvURL });
                console.log("Saved application details to MySQL");
            } catch (dbError) {
                console.error("Database Error:", dbError);
                return res.status(500).json({ message: "Error saving application data" });
            }

            // Delete the temporary file after processing
            fs.unlinkSync(tempFilePath);

            res.status(200).json({ message: "Application Submitted!" });
        } else {
            res.status(500).json({ message: "Error processing CV data" });
        }
    } catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ message: "Error processing application" });
    }
};

module.exports = { upload, uploadCV };
