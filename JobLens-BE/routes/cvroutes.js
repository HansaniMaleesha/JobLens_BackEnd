const express = require("express");
const { upload, uploadCV } = require("../controllers/cvcontroller");

const router = express.Router();
router.post("/upload", upload.single("cv"), uploadCV);

module.exports = router;
