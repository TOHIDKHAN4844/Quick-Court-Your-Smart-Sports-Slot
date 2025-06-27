if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http"); // ✅ IMPORTANT for Vercel

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
  'http://localhost:5000',
  'http://localhost:5173',
  'https://quick-court-your-smart-sports-slot-rho.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ success: false, message: err.message });
});

// ✅ No app.listen() — Vercel handles this

module.exports = app;
module.exports.handler = serverless(app); // ✅ Wrap for Vercel Serverless
