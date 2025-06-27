const Centres = require("../models/Centres");
const Sports = require("../models/Sports");
const Courts = require("../models/Courts");
const mongoose = require("mongoose");
const Bookings = require("../models/Bookings");
const User = require("../models/Users");
const moment = require("moment");

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
    // Find all users where the role is not 'manager'
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
      .populate({
        path: "centre",
        select: "name location",
      })
      .populate({
        path: "sport",
        select: "name",
      })
      .populate({
        path: "court",
        select: "name",
      })
      .select("date startTime endTime");

      const booking = bookings.map((booking) => {
        // Format the booking date to Indian format
        const date = new Date(booking.date);
        const formattedDate = new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        }).format(date);
      
        // Split time string and construct Date in IST without using UTC (Z)
        const [startHour, startMinute] = booking.startTime.split(":");
        const [endHour, endMinute] = booking.endTime.split(":");
      
        const startTimeDate = new Date();
        startTimeDate.setHours(Number(startHour), Number(startMinute), 0);
      
        const endTimeDate = new Date();
        endTimeDate.setHours(Number(endHour), Number(endMinute), 0);
      
        const startTimeIST = startTimeDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
      
        const endTimeIST = endTimeDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
      
        return {
          centre: booking.centre.name,
          sport: booking.sport.name,
          court: booking.court.name,
          date: formattedDate,
          startTime: startTimeIST,
          endTime: endTimeIST,
        };
      });
      

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

module.exports = { getUserDetails, getBookingDetails, getAllUsers };