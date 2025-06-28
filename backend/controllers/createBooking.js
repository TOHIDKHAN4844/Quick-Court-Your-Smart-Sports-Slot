const User = require("../models/Users");
const Court = require("../models/Courts");
const Booking = require("../models/Bookings");
const mongoose = require("mongoose");
const Centre = require("../models/Centres");
const Sport = require("../models/Sports");

const getAvailableSlots = async (req, res) => {
  const { centre, sport, date } = req.body;
  console.log(centre, sport, date);
  try {
    const courts = await Court.find({
      sport: new mongoose.Types.ObjectId(sport),
    });

    const bookings = await Booking.find({
      centre: new mongoose.Types.ObjectId(centre),
      sport: new mongoose.Types.ObjectId(sport),
      date,
    });
    console.log(bookings);

    const startHour = 8;
    const endHour = 20;
    const timeSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    const bookedSlotsMap = {};
    bookings.forEach((booking) => {
      const courtId = booking.court.toString();
      if (!bookedSlotsMap[courtId]) {
        bookedSlotsMap[courtId] = new Set();
      }
      bookedSlotsMap[courtId].add(booking.startTime);
    });

    const availableSlotsPerCourt = courts.map((court) => {
      const courtId = court._id.toString();
      const availableSlots = timeSlots.filter(
        (slot) => !bookedSlotsMap[courtId]?.has(slot)
      );

      return {
        court: court,
        availableSlots: availableSlots,
      };
    });

    return res.status(200).json({ availableSlotsPerCourt });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({
      message: "Failed to retrieve available slots",
      error: error.message,
    });
  }
};

const createBooking = async (req, res) => {
  const { centre_id, sport_id, court_id, user_id, date, startTime } = req.body;

  try {
    if (!isValidStartTime(startTime)) {
      return res
        .status(404)
        .json({ error: "Center will be closed at that time." });
    }

    const centre = await Centre.findById(centre_id);
    if (!centre) return res.status(404).json({ error: "Centre not found" });

    const sport = await Sport.findOne({ _id: sport_id, centre: centre_id });
    if (!sport) return res.status(404).json({ error: "Sport not found" });

    const court = await Court.findOne({ _id: court_id, sport: sport_id });
    if (!court) return res.status(404).json({ error: "Court not found" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const endTime = addMinutesToTime(startTime, 60);

    const existingBooking = await Booking.findOne({
      court: court_id,
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "This time slot is already booked for the selected court",
      });
    }

    const newBooking = new Booking({
      centre: centre_id,
      sport: sport_id,
      court: court_id,
      date: date,
      startTime: startTime,
      endTime: endTime,
      user: user._id,
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error. Unable to create booking." });
  }
};

const addMinutesToTime = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(":").map(Number);

  // Create date in Asia/Kolkata
  const ist = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  ist.setHours(hours);
  ist.setMinutes(minutes + minutesToAdd);

  const newHours = String(ist.getHours()).padStart(2, "0");
  const newMinutes = String(ist.getMinutes()).padStart(2, "0");

  return `${newHours}:${newMinutes}`;
};

const isValidStartTime = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startTimeInMinutes = hours * 60 + minutes;
  const minTimeInMinutes = 8 * 60;
  const maxTimeInMinutes = 20 * 60;
  return startTimeInMinutes >= minTimeInMinutes && startTimeInMinutes < maxTimeInMinutes;
};

module.exports = { getAvailableSlots, createBooking };
