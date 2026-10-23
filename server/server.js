
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const slotRoutes = require("./routes/slotRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Slot routes
app.use("/api/slots", slotRoutes);

// Basic API health check
app.get("/", (req, res) => {
  res.send("MeetSlot API is running!");
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`MeetSlot server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
