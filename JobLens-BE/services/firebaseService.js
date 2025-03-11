require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

// ✅ Load Firebase credentials from service account JSON
const serviceAccount = require("../firebase-service-account.json");

// Initialize Firebase app with service account
initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET, // Make sure your .env file has this correct value
});

const storage = getStorage();

const uploadToFirebase = async (file) => {
    try {
        const bucket = storage.bucket();
        const fileRef = bucket.file(file.originalname);

        // Save the file to Firebase Storage
        await fileRef.save(file.buffer);

        // Make the file publicly accessible (optional, if needed)
        await fileRef.makePublic();

        // Return the public URL of the uploaded file
        return `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
    } catch (error) {
        console.error("Error uploading to Firebase:", error);
        throw new Error("Failed to upload file to Firebase.");
    }
};

module.exports = { uploadToFirebase };
