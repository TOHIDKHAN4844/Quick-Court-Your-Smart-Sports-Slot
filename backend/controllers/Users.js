const Centres = require("../models/Centres");
const Sports = require("../models/Sports");
const Courts = require("../models/Courts");
const mongoose = require("mongoose");
const Bookings = require("../models/Bookings");
const User = require("../models/Users");

const getUserDetails = async (req, res) => {
  const UserId1 = req.params.userId1;
  try {
    const user = await User.findById(UserId1);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "manager" } });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const bookings = await Bookings.find({ user: req.params.userId1 })
      .populate("centre", "name location")
      .populate("sport", "name")
      .populate("court", "name");

    const formattedBookings = bookings.map((b) => ({
      centre: b.centre.name,
      sport: b.sport.name,
      court: b.court.name,
      date: new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(b.startDateTime),
      startTime: b.startDateTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
      endTime: b.endDateTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

module.exports = { getUserDetails, getBookingDetails, getAllUsers };
