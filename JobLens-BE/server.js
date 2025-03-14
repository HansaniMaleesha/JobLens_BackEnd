require("dotenv").config();
require("./services/db");
require("./controllers/email");
const express = require("express");
const cors = require("cors");
const cvRoutes = require("./routes/cvroutes.js");

const app = express();
// Enable CORS for frontend (Adjust the origin if needed)
app.use(cors({
    origin: "http://localhost:5173",  // Allow your frontend
    methods: "GET,POST,PUT,DELETE",   // Allowed methods
    allowedHeaders: "Content-Type,Authorization" // Allowed headers
}));
app.use(express.json());
app.use("/api/cv", cvRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
