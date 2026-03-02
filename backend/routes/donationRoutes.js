const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const donationController = require("../controllers/donationController");

router.post("/", donationController.createDonation);
router.get("/", donationController.getAllDonations);
router.put("/:id", verifyToken, donationController.updateDonation);
router.delete("/:id", verifyToken, donationController.deleteDonation);
module.exports = router;