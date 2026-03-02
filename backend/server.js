const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const donationRoutes = require("./routes/donationRoutes");
app.use("/api/donations", donationRoutes);

// Test DB Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
    connection.release();
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Donation Management API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});