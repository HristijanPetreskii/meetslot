
const express = require("express");
const Slot = require("../models/Slot");

const router = express.Router();

// GET: Retrieve all available slots
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.find({ isBooked: false }).sort({
      date: 1,
      startTime: 1,
    });

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available slots." });
  }
});

// POST: Create a new time slot
router.post("/", async (req, res) => {
  try {
    const { date, startTime, duration } = req.body;

    if (!date || !startTime || !duration || Number(duration) <= 0) {
      return res.status(400).json({
        message: "Date, start time, and a valid duration are required.",
      });
    }

    const slot = await Slot.create({
      date,
      startTime,
      duration: Number(duration),
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Failed to create time slot." });
  }
});


 // POST: Book an available time slot
router.post("/:id/book", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const slot = await Slot.findOneAndUpdate(
      { _id: req.params.id, isBooked: false },
      {
        $set: {
          isBooked: true,
          "bookedBy.name": name.trim(),
          "bookedBy.email": email.trim(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(409).json({
        message: "This slot is already booked or does not exist.",
      });
    }

    res.status(200).json({
      message: "Slot booked successfully!",
      slot,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid slot ID." });
    }

    res.status(500).json({ message: "Failed to book slot." });
  }
});



module.exports = router;
