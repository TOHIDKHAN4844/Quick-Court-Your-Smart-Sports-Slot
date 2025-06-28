const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Centres",
    required: true,
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sports",
    required: true,
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courts",
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("Bookings", BookingSchema);
