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
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Accept both HH:MM and HH:MM:SS formats
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM or HH:MM:SS format.`
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Accept both HH:MM and HH:MM:SS formats
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM or HH:MM:SS format.`
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

BookingSchema.pre("validate", function (next) {
  // Automatically set endTime as 1 hour after startTime if not provided
  if (this.startTime && !this.endTime) {
    const startTimeArray = this.startTime.split(":");
    const startHour = parseInt(startTimeArray[0]);
    const startMinute = parseInt(startTimeArray[1]);
    
    const endHour = startHour + 1;
    const endMinute = startMinute;
    
    this.endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  }
  
  // Ensure times are in HH:MM format (remove seconds if present)
  if (this.startTime && this.startTime.includes(':')) {
    const parts = this.startTime.split(':');
    this.startTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  
  if (this.endTime && this.endTime.includes(':')) {
    const parts = this.endTime.split(':');
    this.endTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  
  next();
});

// Add a method to get formatted date
BookingSchema.methods.getFormattedDate = function() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(this.date);
};

// Add a method to get formatted time
BookingSchema.methods.getFormattedStartTime = function() {
  // Handle both HH:MM and HH:MM:SS formats
  const timeParts = this.startTime.split(':');
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);
  
  const date = new Date(this.date);
  date.setHours(hour, minute, 0, 0);
  
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

BookingSchema.methods.getFormattedEndTime = function() {
  // Handle both HH:MM and HH:MM:SS formats
  const timeParts = this.endTime.split(':');
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);
  
  const date = new Date(this.date);
  date.setHours(hour, minute, 0, 0);
  
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

module.exports = mongoose.model("Bookings", BookingSchema);