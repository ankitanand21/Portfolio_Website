const express = require("express");
const router = express.Router();

const Visitor = require("../models/Visitor");
const Contact = require("../models/Contact");

/*
 * GET /api/visitors
 * Increments the visitor counter by 1 and returns the new total.
 * Uses findOneAndUpdate with upsert so the counter document is
 * created automatically on the very first visit.
 */
router.get("/visitors", async (req, res) => {
  try {
    const visitor = await Visitor.findOneAndUpdate(
      { _id: "counter" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: visitor.count });
  } catch (error) {
    console.error("Failed to update visitor count:", error.message);
    res.status(500).json({ error: "Could not update visitor count" });
  }
});

/*
 * POST /api/contact
 * Saves a contact form submission to MongoDB.
 */
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (trimmedMessage.length > 1000) {
      return res.status(400).json({ error: "Message must be 1000 characters or fewer" });
    }

    await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Failed to save contact submission:", error.message);
    res.status(500).json({ error: "Could not send your message" });
  }
});

module.exports = router;
