const express = require("express");
const { handleGenerateNewShortURL} = require("../Controllers/Url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

module.exports = router;