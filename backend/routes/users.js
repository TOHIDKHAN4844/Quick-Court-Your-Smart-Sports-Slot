const express = require("express");
const {getUserDetails, getBookingDetails, getAllUsers} = require("../controllers/Users.js");
const router = express.Router();

router.get("/getUserDetailS/:userId1", getUserDetails);
router.get("/getBookingDetailS/:userId1", getBookingDetails);
router.get("/getAllUsers", getAllUsers);

module.exports = router;