const express = require("express");
const router = express.Router();
const { testAPI, testDB } = require("../controllers/testController");

router.get("/api", testAPI);
router.get("/db", testDB);

module.exports = router;
