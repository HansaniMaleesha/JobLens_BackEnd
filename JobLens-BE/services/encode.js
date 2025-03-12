const fs = require("fs");

const encodeFileToBase64 = (filePath) => {
    const fileData = fs.readFileSync(filePath, "utf8");
    return Buffer.from(fileData).toString("base64");
};

// Encode credentials.json
const credentialsBase64 = encodeFileToBase64("../credentials.json");

console.log("Base64 Encoded App Credentials:");
console.log(credentialsBase64);
