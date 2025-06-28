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

    const formattedBookings = bookings.map((booking) => {
      const date = new Date(booking.date);

      const formattedDate = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(date);

      // Combine date + startTime with IST
      const [startHour, startMinute] = booking.startTime.split(":").map(Number);
      const [endHour, endMinute] = booking.endTime.split(":").map(Number);

      const baseDate = new Date(
        new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const startDate = new Date(baseDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(baseDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      const startTimeIST = startDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      const endTimeIST = endDate.toLocaleTimeString("en-IN", {
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

    res.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

module.exports = { getUserDetails, getBookingDetails, getAllUsers };
