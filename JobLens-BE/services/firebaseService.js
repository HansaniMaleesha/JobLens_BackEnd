require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

const base64ServiceAccount = process.env.FIREBASE_BASE64;

if (!base64ServiceAccount) {
    throw new Error("FIREBASE_BASE64 environment variable is missing!");
}

// Decode Base64 back to JSON
const serviceAccount = JSON.parse(Buffer.from(base64ServiceAccount, 'base64').toString('utf-8'));



// Initialize Firebase app with service account
initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "joblens-6a8c0.firebasestorage.app",  // Make sure your .env file has this correct value
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
