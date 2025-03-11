require("dotenv").config();
require("./services/db");
require("./controllers/email");
const express = require("express");
const cors = require("cors");
const cvRoutes = require("./routes/cvRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cv", cvRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
