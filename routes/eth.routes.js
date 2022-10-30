const express = require("express");
const router = express.Router();
const ethController = require("../controllers/eth.controller.js");

router.get("/:tokenAddress", ethController.getPrice);

module.exports = router;
