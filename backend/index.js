if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

// Routes
const authRoute = require("./routes/auth");
const centres = require("./routes/centres");
const createBooking = require("./routes/createBooking");
const Users1 = require("./routes/users");

// Express initialization
const app = express();

// Mongoose initialization (runs on cold start)
const dbUrl = process.env.DB_URL;
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  }
}
connectDB().catch((err) => console.log(err));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://quick-court-your-smart-git-a96e33-tohid-khans-projects-1ef85432.vercel.app',
  'https://quick-court-your-smart-sports-slot-rho.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin:", origin); // Debug log
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight handler

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world from Quick Court API!");
});

app.use("/api/auth", authRoute);
app.use("/api/centres", centres);
app.use("/api/createBooking", createBooking);
app.use("/api/User", Users1);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ success: false, message: err.message });
});

// ✅ Export serverless handler
module.exports = app;
module.exports.handler = serverless(app);
